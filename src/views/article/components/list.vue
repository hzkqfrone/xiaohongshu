<template>
    <div class="manuscript">
        <Row :gutter="10" v-if="!showPublish">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        小红薯稿件列表
                    </p>
                    <Tabs :value="tabValue" @on-click="selectTab">
                        <TabPane label="选号稿件" name="name1"></TabPane>
                        <TabPane label="定制稿件" name="name2"></TabPane>
                    </Tabs>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="标题:">
                                <Input v-model="form.title" clearable placeholder="请输入标题" style="width: 200px"/>
                            </FormItem>
                            <FormItem label="媒体:">
                                <Select v-model="form.media_id" filterable clearable  style="width:200px" @on-change="handleSearch">
                                    <Option v-for="(item, index) in mediaList" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="用户:" v-if="isAuth([1])">
                                <Select v-model="form.member_id" filterable clearable style="width:200px" @on-change="handleSearch">
                                    <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="状态:">
                                <Select v-model="form.status" clearable style="width:200px" @on-change="handleSearch">
                                    <Option v-for="(item, index) in pubStatusList" :key="index" :value="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="创建时间">
                                <date-picker @changeTime="selectCreateTime"></date-picker>
                            </FormItem>
                            <FormItem label="完成时间">
                                <date-picker @changeTime="selectPubTime"></date-picker>
                            </FormItem>
                            <Row>
                                <Button class="searchBtn" icon="ios-search" type="primary" @click="handleSearch">搜索</Button>
                                <span @click="downSearch"><Button icon="md-cloud-download">下载</Button></span>
                            </Row>
                        </Form>
                    </Row>
                </Card>
                <Card class="articleWrapper">
                    <!-- 稿件列表状态选择 -->
                    <media-list-tabs @tabClick="tabSearch" :statusNum="statusNum"></media-list-tabs>
                    <Row class="searchable-table-con1">
                        <show-table-head :loading="showLoading" :columns="columnsData" :data="resData"></show-table-head>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="pageInfo.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 查看多条回链 -->
        <Modal
            v-model="backLinkModal"
            title="回链">
            <div v-if="backLinkArr.length==0">暂无数据~</div>
            <Form v-else :label-width="20" class="backLinkModal">
                <FormItem v-for="(item, index) in backLinkArr" :key="index">{{item}}</FormItem>
            </Form>
            <div slot="footer">
                <Button @click="backLinkModal=false">取消</Button>
                <Button type="primary" @click="backLinkModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看图片-->
        <Modal
            v-model="includeModal"
            width='600'
            title="小红薯收录图片">
            <img style="max-width:100%;" :src="includedImg">
            <div slot="footer">
                <Button @click="includeModal=false">取消</Button>
                <Button type="primary" @click="includeModal=false">确定</Button>
            </div>
        </Modal>
        
        <!-- 小红薯稿件编辑 -->
        <xiaohognshu-publish v-if="showPublish" :editId="editId" :tagList="editData" @addDetails="showPublish=false,init()"></xiaohognshu-publish>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'; 
    import {xhsInitCate, xuanHaoArticle} from '@/libs/api.js';
    import {downloadingTools, url, getUserList, userAuthority} from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table';            //表格
    import datePicker from '@/views/my-components/date-picker/date-picker';             //日期选择
    import xiaohognshuPublish from '@/views/my-components/article/publish';             //稿件发布
    import mediaListTabs from '@/views/my-components/media/media-tabs/media-list-tabs'; //媒体列表状态选择
    import Clipboard from 'clipboard';                                                  //拷贝
    export default {
        mixins:[downloadingTools, url, getUserList, userAuthority],
        name: 'article_list',
        data () {
            return {
                tabValue: 'name1',
                self:this,
                loading: true,
                ids:[],
                form:{ },
                pageInfo:{},
                mediaList:[],
                pubStatusList:[],
                pubTime:'',
                columnsData: [
                    {
                        key: 'title',
                        title: '操作',
                        width:90,
                        show: true,
                        render: (h, params) => {
                            let WMGX_authList = [];
                            WMGX_authList.push(
                                h('a', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editPub(params.index)
                                        }
                                    }
                                },'再发布')
                            )

                            WMGX_authList.push(
                                h('a', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    attrs: {
                                        href: `${url}show/index.html?time=${params.row.time}&encrypt=${params.row.encrypt}`,
                                        target: '_blank'
                                    }
                                },'预览')
                            )

                            WMGX_authList.push(
                                h('a', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    attrs:{
                                        "data-clipboard-text":`${params.row.title}\n${params.row.media_name}\n${params.row.link}`,
                                        "class":"tag-read"
                                    },
                                    on: {
                                        click: () => {
                                            var clipboard = new Clipboard('.tag-read')
                                            clipboard.on('success', e => {
                                                this.$Message.success('复制成功');
                                                // 释放内存
                                                clipboard.destroy()
                                            })
                                            clipboard.on('error', e => {
                                                // 不支持复制
                                                this.$Message.warning('该浏览器不支持自动复制');
                                                // 释放内存
                                                clipboard.destroy()
                                            })
                                        }
                                    }
                                },'一键复制')
                            )
                            return h('div',WMGX_authList);
                        }
                    },
                    {
                        key: 'title',
                        title: '标题',
                        width:200,
                        show: true,
                    },
                    {
                        key: 'link',
                        title: '回链',
                        minWidth:80,
                        show: true
                    },
                    {
                        key: 'media_name',
                        title: '博主账号',
                        width:200,
                        show: true,
                    },
                    {
                        key: 'price',
                        title: '价格',
                        minWidth:50,
                        show: true
                    },
                    {
                        key: 'shoulv',
                        title: '收录图片',
                        minWidth: 80,
                        show:true,
                        render: (h, params) => {
                            if(params.row.fengmian){
                                return h('img', {
                                    attrs: {
                                        src: params.row.fengmian
                                    },
                                    style: {
                                        maxWidth: '100%'
                                    },
                                    on: {
                                        click: () => {
                                            this.includedImg = params.row.fengmian;
                                            this.includeModal = true;
                                        }
                                    }
                                })
                            }
                        }
                    },
                    {
                        key: 'pubStatus',
                        title: '状态',
                        minWidth:50,
                        show: true,
                        render: (h, params) => {
                            if(params.row.failNum >= 1){
                                return h('div',[
                                    h('div', params.row.pubStatus),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on:{
                                            click: ()=>{
                                                this.showPublish = true;
                                                this.editId = params.row.id;
                                                this.editData.mediaName = params.row.mediaName;
                                                this.editData.meijiePrice = params.row.totalPrice / params.row.orderNum;
                                                this.editData.orderNum = params.row.orderNum;
                                            }
                                        }
                                    }, '重发')
                                ])
                            }else{
                                return h('span', params.row.pubStatus)
                            }
                        }
                    },
                    {
                        key: 'member_name',
                        title:'创建人',
                        minWidth:50,
                        show: true
                    },
                    {
                        key: 'createTime',
                        title: '创建时间 / 发布时间',
                        minWidth:132,
                        show: true,
                        render:  (h, params) =>{
                            return h('div',[
                                h('div',this.resData[params.index].createTime),
                                h('div',this.resData[params.index].pubTime),
                            ]);
                        }
                    },
                    {
                        key: 'createTime',
                        title: '数据',
                        minWidth:150,
                        show: this.isAuth([1]),
                        render:  (h, params) =>{
                            return h('div',[
                                h('span',[
                                    h('Icon',{
                                        props:{type: 'heart' }
                                    }),
                                    h('span', params.row.likes)
                                ]),
                                h('span',[
                                    h('Icon',{
                                        props:{type: 'star'}
                                    }),
                                    h('span', params.row.collects)
                                ]),
                                h('span',[
                                    h('Icon',{
                                        props:{type: 'chatbox-working' }
                                    }),
                                    h('span', params.row.commentsTotal)
                                ]),
                            ]);
                        }
                    },
                ],
                resData:[],
                totalCount:0,
                showLoading: false,
                statusNum:{},
                backLinkModal: false,             //查看多条回链
                backLinkArr: [],                  //多条回链
                includeModal: false,              //查看小红薯收录图片
                includedImg: '',                  //小红薯收录图片
                showPublish: false,               //显示编辑稿件
                editId: '',                       //编辑稿件id
                editData: {},                     //编辑稿件列表
                fengmian: '', 
            };
        },
        methods: {
            init () {
                this.showLoading = true;
                xuanHaoArticle(Object.assign(this.form, this.pageInfo)).then(res => {
                    this.showLoading = false;
                    if (res.code == 200) {
                        this.resData = res.data.list;
                        this.totalCount = parseInt(res.data.totalCount);
                        this.statusNum = res.data.count;
                    } else {
                        this.$Notice.error({title:res.message});
                    }
                });
            },

            //下载
            downSearch () {
                var down = {export: 2};
                xuanHaoArticle(Object.assign(this.form, down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/article?', this.form, res);
                });
            },

            //文章媒体列表
            getCate(){
                xhsInitCate().then(res => {
                    if (res.code == 200) {
                        this.mediaList = res.data.media;
                        this.pubStatusList = res.data.status;
                    } else {
                        this.$Notice.error({title:res.message});
                    }
                });
            },

            //改变页数
            changeNum (page){
                this.pageInfo.page = page;
                this.init();
            },

            //改变显示数
            changeSize (size){
                this.pageInfo.per_page = size;
                this.init();
            },

            //搜索
            handleSearch(){
                this.pageInfo.page = 1;
                this.init();
            },

            //创建时间
            selectCreateTime(data){
                this.form.create_start_time = data.createTimeStart;
                this.form.create_end_time = data.createTimeEnd;
                if(data.createTimeStart == '') {
                    this.form.soAll = 1;
                }
                this.handleSearch();
            },

            //发布时间
            selectPubTime(data){
                this.form.finish_start_time = data.createTimeStart;
                this.form.finish_end_time = data.createTimeEnd;
                this.handleSearch();
            },

            //切换tab
            selectTab(name){
                if(name == 'name2'){
                    this.$emit('showList', 1);
                }
            },

            //再发布
            editPub (index) {
                //获取拷贝的数据
                this.$router.push({
                    path: '/article/pub',
                    query: {id: this.resData[index].id}
                })
            },


            //列表状态tab
            tabSearch(name){
                this.pageInfo.page = 1;
                this.form.status = name;
                this.init();
            },

        },
        mounted () {
            this.init();
            this.getCate();
            this.loadUserList();
        },
        components:{
            showTableHead,
            datePicker,
            xiaohognshuPublish,
            mediaListTabs
        }
    };
</script>
<style lang="less" scoped>
    .manuscript{
        .section{
            display: inline-block;
            width:100px;
        }
        span.border{
            color:#666;
        }
        .backLinkModal{
            color:red;
            .ivu-form-item{
                margin-bottom:0;
            }
        }
        .include-image{
            img{
                max-width: 100%;
            }
        }
    }
</style>
