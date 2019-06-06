<template>
    <div>
        <div v-if="!showPubPage">
            <Card style="margin-bottom:20px">
                <p slot="title">
                    种草素材库
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
                                <Option :value="0">未发布</Option>
                                <Option :value="1">已发布</Option>
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
                        <!-- <Button icon="md-arrow-round-down" @click="downLoadBtn">下载</Button> -->
                        <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
                    </div>
                </Row>
            </Card>
            <Card>
                <Row class="searchable-table-con1">
                    <div class="button_wrap">
                        <Button icon="md-add" type="primary" @click="showPubPage=true">添加素材</Button>
                    </div>
                    <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                </Row>
            </Card>
        </div>

        <!-- 添加备注 showRemarks -->
        <Modal
            v-model="showRemarks"
            transfer
            :mask-closable="false"
            title="备注">
            <Form label-position="top">
                <FormItem label="备注" v-if="isAuth([1,5,6])">
                    <Input placeholder="备注" v-model="remarkParams.remark"/>
                </FormItem>
                <FormItem label="备注日志">
                    <Timeline>
                        <TimelineItem color="green" v-for="(item, index) in remarkLogData" :key="index">
                            <p>{{item.created_at}} <span>&nbsp;&nbsp;&nbsp;{{item.member_name}}</span></p>
                            <p>{{item.data}}</p>
                        </TimelineItem>
                    </Timeline>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="showRemarks=false">取消</Button>
                <Button type="primary" @click="addRemarkBtn">确定</Button>
            </div>
        </Modal>

        <!-- 预览 -->
        <Modal 
            width="600"
            transfer
            :title="previewData.title" 
            v-model="previewModal" class="previewData">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'left'">
                <FormItem label="标题："><div>{{previewData.title}}</div></FormItem>
                <FormItem label="用户："><div>{{previewData.member_name}}</div></FormItem>
                <FormItem label="套餐："><div>{{previewData.combo_name}}</div></FormItem>
                <FormItem label="代写数量："><div>{{previewData.num}}</div></FormItem>
                <FormItem label="代写代发素材提交说明："><div>{{previewData.attention}}</div></FormItem>
                <FormItem label="客户咨询建议博主回复什么："><div>{{previewData.note}}</div></FormItem>
                <FormItem label="完成日期："><div>{{previewData.finish_time}}</div></FormItem>
                <FormItem label="期望优化的关键词：">
                    <Tag v-for="(item, index) in previewData.keywords" :key="index">{{item}}</Tag>
                </FormItem>
                <FormItem label="图片：">
                    <div class="demo-upload-list" v-for="(item, index) in previewData.images" :key="index">
                        <img :src="item">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="附件：">
                    <p class="attachment" v-for="(item, index) in previewData.attachment" :key="index"><a :href="item" target="_blank"><Tag>{{item}}</Tag></a></p>
                </FormItem>
            </Form>
        </Modal>

        <!-- 查看大图 -->
        <Modal title="图片" v-model="imgModal">
            <img :src="imgName" v-if="imgModal" style="width: 100%">
        </Modal>

        <!-- 已上传的图片 -->
        <Modal title="图片" v-model="imagesModal">
            <div class="demo-upload-list" v-for="(item, index) in images" :key="index">
                <img :src="item">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
            <div v-if="images.length == 0">
                暂无图片~
            </div>
        </Modal>

        <!-- 添加素材 编辑 -->
        <add-library v-if="showPubPage" :editId="editId" @hideAddLibrary="showPubPage=false, init()"></add-library>
    </div>
</template>
<script>
    import addLibrary from '@/views/seeding/components/add_library';
    import { getSeedingMaterial, materialRemark, materialRemarkLog, getSeedingMaterialDetail } from '@/libs/api';
    import { url, userAuthority, getUserList, downloadingTools } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [userAuthority, getUserList, downloadingTools],
        data(){
            return{
                showPubPage: false,
                tabLoading: false,
                resData: [],
                totalCount: 0,
                editId: '',             //编辑 发布 id
                marketData: [],         //营销顾问 
                saleData: [],           //销售
                params: {},          
                imgModal: false,        //查看大图 modal
                imgName: '',            //查看大图 url
                showRemarks: false,     //备注 modal
                remarkParams: {},       //备注参数
                remarkLogData: [],      //备注日志
                previewModal: false,    //预览
                previewData: {},        //预览素材 数据
                images: [],             //已上传的图片
                imagesModal: false,     //已上传的图片 modal
                columnsData: [
                    {
                        key: '',
                        title: '操作',
                        width: 80,
                        render: (h, params) => {
                            if(params.row.status == 0){
                                return h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        icon: 'md-create'
                                    },
                                    on: {
                                        click: () => {
                                            this.editId = params.row.id;
                                            this.showPubPage = true;
                                        }
                                    }
                                }, '编辑')
                            }else{
                                return h('div', '已发布');
                            }
                        } 
                    },
                    {
                        key: 'member_name',
                        title: '用户',
                        minWidth: 80, 
                    },
                    {
                        key: 'combo_title',
                        title: '套餐类型',
                        minWidth: 60, 
                    },
                    {
                        key: 'combo_price',
                        title: '数据详情',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div',[
                                h('p', `代写篇数：${params.row.num}`),
                                h('p', `已完成篇数：${params.row.receipt_num}`)
                            ])
                        } 
                    },
                    {
                        key: 'title',
                        title: '素材标题',
                        minWidth: 80, 
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: ()=> {
                                        this.preview(params.row.id);
                                    }
                                }
                            }, params.row.title)
                        }
                    },
                    {
                        key: 'img_count',
                        title: '已上传图片数量',
                        minWidth: 50, 
                        render: (h, params) => {
                            return h('a',{
                                attrs:{
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.images = params.row.images;
                                        this.imagesModal = true;
                                    }
                                }
                            }, params.row.img_count)
                        }
                    },
                    {
                        key: 'created_at',
                        title: '添加日期',
                        minWidth: 80, 
                    },
                    {
                        key: 'status_name',
                        title: '状态',
                        minWidth: 80, 
                    },
                    {
                        key: '',
                        title: '备注说明',
                        minWidth: 60, 
                        show: true,
                        render:(h, params) => {
                            return h('a', {
                                attrs:{
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: () =>{
                                        this.remarkLog(params.row.id);
                                    }
                                }
                            }, params.row.remark || '暂无备注~')
                        }
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
                getSeedingMaterial(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                materialRemarkLog({id: id}).then(res => {
                    if(res.code == 200){
                        this.remarkLogData = res.data;
                        this.showRemarks = true;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //添加备注
            addRemarkBtn(){
                if(!this.remarkParams.remark){
                    this.showRemarks = false;
                    return
                }
                materialRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //预览
            preview(id){
                getSeedingMaterialDetail(id).then(res => {
                    if(res.code == 200){
                        this.previewModal = true;
                        this.previewData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //预览 查看大图
            handleView (name) {
                this.imgName = name;
                this.imgModal = true;
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
                getSeedingMaterial(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding-material?', this.params, res);
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
            addLibrary,
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
    .attachment .ivu-tag{
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
<style lang="less">
    .previewData{
        .ivu-form-item-label{
            font-weight: bold !important;
        }
    }
</style>
