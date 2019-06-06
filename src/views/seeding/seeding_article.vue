<template>
    <div>
        <div v-if="!showPubtask">
            <Card style="margin-bottom:20px">
                <p slot="title">
                    种草稿件列表
                </p>
                <Row>
                    <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                        <FormItem label="标题">
                            <Input v-model="params.title" clearable placeholder="请输入标题" style="width: 200px" @on-change="serchData" />
                        </FormItem>
                        <FormItem label="用户" v-if="!isAuth([2])">
                            <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="serchData">
                                <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择营销顾问" v-if="!isAuth([2])">
                            <Select v-model="params.market" filterable clearable style="width:200px" @on-change="serchData">
                                <Option v-for="(item, index) in marketData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择销售" v-if="!isAuth([2])">
                            <Select v-model="params.sale" filterable clearable style="width:200px" @on-change="serchData">
                                <Option v-for="(item, index) in saleData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="评论:">
                            <Select v-model="params.has_comment" clearable style="width:200px" @on-change="serchData">
                                <Option :value="1">有评论</Option>
                                <Option :value="0">无评论</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="总评论条数:">
                            <Input class="section" v-model="params.change_comment" clearable style="width:200px" @on-change="serchData"></Input>
                            <!-- <span class="border"> — </span> -->
                            <!-- <Input class="section" v-model="comment2" clearable style="width:100px"></Input> -->
                        </FormItem>
                        <FormItem label="状态:">
                            <Select v-model="params.status" clearable style="width:200px" @on-change="serchData">
                                <Option :value="-1">失败</Option>
                                <Option :value="0">等待发布</Option>
                                <Option :value="1">发布中</Option>
                                <Option :value="2">发布完成</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="创建日期">
                            <date-picker @changeTime="selectCreateTime"></date-picker>
                        </FormItem>
                        <FormItem label="完成日期">
                            <date-picker @changeTime="selectPubTime"></date-picker>
                        </FormItem>
                    </Form>
                    <div class="button_wrap">
                        <Button icon="md-arrow-round-down" @click="downLoadBtn">下载</Button>
                        <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
                    </div>
                </Row>
            </Card>
            <Card>
                <Row class="searchable-table-con1">
                    <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                </Row>
            </Card>

            <!-- 数据详情 -->
            <Modal
                width="1200"
                v-model="articleDetailModal"> 
                <div slot="header" class="detailModal">
                    <h3>数据详情</h3>
                    <Button type="info" icon="md-arrow-round-down" @click="downLoadDetail" class="downLoadDetail">下载</Button>
                </div>
                <Table stripe border :loading="articleInfoLoading" :columns="articleInfoCol" :data="articleInfoData"></Table>
                <div slot="footer">
                    <Button @click="articleDetailModal=false">取消</Button>
                    <Button type="primary" @click="articleDetailModal=false">确定</Button>
                </div>
            </Modal>

            <Modal title="截图" v-model="imgModal">
                <img :src="imgName" v-if="imgModal" style="width: 100%">
            </Modal>

            <!-- 复制稿件 -->
            <Modal
                v-model="copyArticleModal"
                :mask-closable="false"
                title="复制稿件"> 
                <Form :label-width="100" class="addContent">
                    <FormItem label="订单数量">
                        <InputNumber :min="1" v-model="copyParams.copy_num" style="width:100px"></InputNumber>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="copyArticleModal=false">取消</Button>
                    <Button type="primary" :loading="copyBtnLoading" @click="copyArticle">确定</Button>
                </div>
            </Modal>

        </div>

        <!-- 发布任务 编辑 发布 重发 -->
        <pub-task v-if="showPubtask" :orderNum="orderNum" :editId="editId" :handleType="handleType" @cancel="showPubtask=false, init()"></pub-task>
    </div>
</template>
<script>
    import pubTask from '@/views/seeding/components/pub_task';
    import { getSeedingPubList, seedingAritcle, copySeeding } from '@/libs/api';
    import { url, userAuthority, getUserList, downloadingTools } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [userAuthority, getUserList, downloadingTools],
        data(){
            return{
                showPubtask: false,
                tabLoading: false,
                resData: [],
                totalCount: 0,
                editId: '',          //编辑 发布 id
                handleType: '',      //类型 编辑发布 =>1    重发 =>2
                orderNum: '',        //订单数量
                marketData: [],      //营销顾问 
                saleData: [],        //销售
                params: {},          
                copyArticleModal: false,     //复制稿件 modal
                copyParams: {},              //复制稿件 参数
                copyBtnLoading: false,       //复制稿件 btn Loading
                imgModal: false,             //查看大图 modal
                imgName: '',                 //查看大图 url
                columnsData: [
                    {
                        key: '',
                        title: '操作',
                        minWidth: 80,
                        render: (h, params) => {
                            //审核通过之后才能预览文案  发布文案
                            let arr = [];
                            // if(params.row.status == 0){
                            //     arr.push(
                            //         h('p', [
                            //             h('a', {
                            //                 on:{
                            //                     click: ()=> {
    
                            //                     }
                            //                 }
                            //             }, '审核文案')
                            //         ])
                            //     )
                            // }
                            arr.push(
                                h('p', [
                                   h('a', {
                                        style: {
                                            marginRight: '5px'
                                        },
                                        attrs: {
                                            href: `${url}show/seeding.html?time=${params.row.time}&encrypt=${params.row.encrypt}`,
                                            target: '_blank'
                                        }
                                    },'预览文案')
                                ])
                            )
                            if(this.isAuth([1,5,6])){
                                if(params.row.status==0){
                                    arr.push(
                                        h('p', [
                                           h('a', {
                                                style: {
                                                    marginRight: '5px'
                                                },
                                                attrs: {
                                                    href: 'javascript:;'
                                                },
                                                on:{
                                                    click: ()=>{
                                                        this.orderNum = params.row.num;
                                                        this.editId = params.row.id;
                                                        this.showPubtask = true;
                                                        this.handleType = 1;
                                                    }
                                                }
                                            },'编辑')
                                        ])
                                    )
                                }
                                arr.push(
                                    h('p', [
                                        h('a', {
                                            style: {
                                                marginRight: '5px'
                                            },
                                            attrs: {
                                                href: 'javascript:;'
                                            },
                                            on:{
                                                click: ()=>{
                                                    this.copyParams = {
                                                        copy_id: params.row.id,
                                                        copy_num: params.row.num
                                                    }
                                                    this.copyArticleModal = true;
                                                }
                                            }
                                        },'复制')
                                    ])
                                )
                            }
                            // if(params.row.status == 1){
                            //     arr.push(
                            //         h('p', [
                            //             h('a', {
                            //                 on:{
                            //                     click: ()=> {
                            //                         this.showPubtask = true;
                            //                     }
                            //                 }
                            //             }, '发布任务')
                            //         ])
                            //     )
                            // }
                            return h('div', arr);
                        } 
                    },
                    {
                        key: 'member_name',
                        title: '用户',
                        minWidth: 80, 
                    },
                    {
                        key: 'title',
                        title: '标题',
                        minWidth: 90, 
                    },
                    {
                        key: 'combo_title',
                        title: '套餐类型',
                        minWidth: 60, 
                    },
                    {
                        key: 'combo_price',
                        title: '套餐价格',
                        minWidth: 60, 
                    },
                    {
                        key: 'num',
                        title: '订单数量',
                        minWidth: 50, 
                    },
                    {
                        key: 'status_name',
                        title: '状态',
                        minWidth: 80, 
                        render: (h, params) => {
                            if(params.row.back_count >= 1){
                                return h('div',[
                                    h('pre', {
                                        domProps: {
                                            innerHTML: params.row.status_name
                                        }
                                    }),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on:{
                                            click: ()=>{
                                                this.orderNum = params.row.num;
                                                this.editId = params.row.id;
                                                this.showPubtask = true;
                                                this.handleType = 2;
                                            }
                                        }
                                    }, '重发')
                                ])
                            }else {
                                return h('pre', {
                                    domProps: {
                                        innerHTML: params.row.status_name
                                    }
                                })
                            }
                        }
                    },
                    {
                        key: '',
                        title: '总数据',
                        minWidth: 120, 
                        render: (h, params) => {
                            return h('div', [
                                h('p',[
                                    h('span','收藏数:  '),
                                    h('span', params.row.star)
                                ]),
                                h('p',[
                                    h('span','点赞数:  '),
                                    h('span', params.row.like)
                                ]),
                                h('p',[
                                    h('span','评论数:  '),
                                    h('span', params.row.comment)
                                ])
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '提交时间 / 完成时间',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('p', params.row.created_at),
                                h('p', params.row.finish_time)
                            ])
                        } 
                    },
                    {
                        key: '',
                        title: '数据详情',
                        width: 80, 
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    on: {
                                        click: () =>{
                                            this.articleDetailModal = true;
                                            this.accessMultiple(params.row.id);
                                        }
                                    }
                                }, '查看详情')
                            ])
                        }
                    },
                ],
                articleDetailModal: false,     //数据详情
                articleInfoLoading: false,
                articleInfoData: [],           //数据详情 数据
                detailId: '',                  //数据详情 id
                articleInfoCol: [
                    {
                        key: 'title',
                        title: '标题',
                        minWidth: 80, 
                    },
                    {
                        key: 'link',
                        title: '链接',
                        minWidth: 80, 
                    },
                    {
                        key: 'online_pic',
                        title: '是否收录',
                        minWidth: 60, 
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.online_pic,
                                    target: '_blank'
                                },
                                style:{
                                    maxWidth: '100%'
                                },
                                on: {
                                    click: () =>{
                                        this.imgName = params.row.online_pic;
                                        this.imgModal = true;
                                    }
                                }
                            })
                        }
                    },
                    {
                        key: '',
                        title: '关键词 / 排名位置',
                        minWidth: 100,
                        // render: (h, params) => {
                        //     return h('div', [
                        //          h('p',[
                        //             h('span','关键词:  '),
                        //             h('span', params.row.keyword)
                        //         ]),
                        //         h('p',[
                        //             h('span','排名位置:  '),
                        //             h('span', params.row.note)
                        //         ]),
                        //     ])
                        // } 
                    },
                    {
                        key: '',
                        title: '收藏 / 点赞 / 评论',
                        minWidth: 100, 
                        render: (h, params) => {
                            return h('div', [
                                 h('p',[
                                    h('span','收藏:  '),
                                    h('span', params.row.star)
                                ]),
                                h('p',[
                                    h('span','点赞:  '),
                                    h('span', params.row.like)
                                ]),
                                h('p',[
                                    h('span','评论:  '),
                                    h('span', params.row.comment)
                                ]),
                            ])
                        } 
                    },
                    {
                        key: '',
                        title: '博主信息',
                        minWidth: 100, 
                        render: (h, params) => {
                            return h('div', [
                                 h('p',[
                                    // h('span','账号名称:  '),
                                    h('span', params.row.blogger)
                                ]),
                            ])
                        } 
                    },
                    
                    {
                        key: 'online_time',
                        title: '完成日期',
                        minWidth: 60, 
                    },
                ],
            }
        },
        mounted() {
            this.init();
            this.getSeedingUserList();
            this.loadSaleList();
            this.loadMarketList();
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                getSeedingPubList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //获取多条数据
            accessMultiple(id){
                this.detailId = id;
                this.articleInfoLoading = true;
                seedingAritcle({id: id}).then(res => {
                    this.articleInfoLoading = false;
                    if(res.code == 200){
                        this.articleInfoData = res.data;
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                })
            },

            //复制稿件
            copyArticle(){
                this.copyBtnLoading = true;
                copySeeding(this.copyParams).then(res => {
                    this.copyBtnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.params.page = 1;
                        this.init();
                        this.copyArticleModal = false;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },
            
            //创建日期
            selectCreateTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //完成日期
            selectPubTime(date){
                this.params.finish_start = date.createTimeStart;
                this.params.finish_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //列表下载
            downLoadBtn(){
                var down = {export: 2};
                getSeedingPubList(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding?', this.params, res);
                });
            },

            //数据详情下载
            downLoadDetail(){
                var down = {export: 2, id: this.detailId};
                seedingAritcle(down).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding/seeding-article?', down, res);
                });
            },

            //搜索
            serchData(){
                this.params.page = 1;
                this.init();
            },

            //页码
            changeNum(page){
                this.params.page = page;
                this.init();
            },

            //每页多少条
            changeSize(size){
                this.params.per_page = size;
                this.init();
            }
        },
        components:{
            pubTask,
            datePicker
        }
    }
</script>
<style lang="less" scoped>
    .detailModal{
        h3{
            display: inline-block;
        }
        .downLoadDetail{
            display: inline-block;
            margin-left:30px;
        }
    }
</style>
