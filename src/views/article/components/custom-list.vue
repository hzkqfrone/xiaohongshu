<template>
    <div class="manuscript">
        <Row :gutter="10" v-if="!showPublish">
            <Col>
                <Card style="margin-bottom:20px">
                   <p slot="title">
                        小红薯稿件列表
                    </p>
                    <Tabs value="name2" @on-click="selectTab">
                        <TabPane label="选号稿件" name="name1"></TabPane>
                        <TabPane label="定制稿件" name="name2"></TabPane>
                    </Tabs>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="标题:">
                                <Input v-model="form.brandTitle" clearable placeholder="请输入标题" style="width: 200px" />
                            </FormItem>
                            <FormItem label="用户:" v-if="isAuth([1])">
                                <Select v-model="form.member_id" filterable clearable style="width:200px" @on-change="handleSearch">
                                    <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="评论:">
                                <Select v-model="form.commentsTotal" clearable style="width:200px" @on-change="handleSearch">
                                    <Option :value="1">有评论</Option>
                                    <Option :value="-1">无评论</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="总评论条数:">
                                <Input class="section" v-model="form.commentsTotal1" clearable></Input> <span class="border"> — </span>
                                <Input class="section" v-model="form.commentsTotal2" clearable></Input>
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
                    <Row class="searchable-table-con1">
                        <show-table-head :loading="showLoading" :columns="columnsData" :data="resData"></show-table-head>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="pageInfo.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 单个数据 -->
        <Modal
            v-model="dataModal"
            width='1200'
            title="单个数据">
            <Table border :loading="tabLoading" :columns="tabColumnsData" :data="dataDetails"></Table>
            <div slot="footer">
                <Button @click="dataModal=false">取消</Button>
                <Button type="primary" @click="dataModal=false">确定</Button>
            </div>
        </Modal>

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

        <!-- 查看多个图片-->
        <Modal
            v-model="includeModal"
            width='600'
            title="小红书收录图片">
            <div v-if="includedImg.length==0">暂无数据~</div>
            <ul v-else class="include-image">
                <li v-for="(item, index) in includedImg" :key="index"><img style="max-width:100%;" :src="item"></li>
            </ul>
            <div slot="footer">
                <Button @click="includeModal=false">取消</Button>
                <Button type="primary" @click="includeModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看多个图片-->
        <Modal
            v-model="includedScreenshots"
            width='600'
            title="收录截图">
            <div v-if="!fengmian">暂无数据~</div>
            <img v-else style="max-width:100%;" :src="fengmian">
            <div slot="footer">
                <Button @click="includedScreenshots=false">取消</Button>
                <Button type="primary" @click="includedScreenshots=false">确定</Button>
            </div>
        </Modal>
        
        <!-- 小红书稿件编辑 -->
        <custom-publish v-if="showPublish" :editId="editId" :tagList="editData" @addDetails="showPublish=false,init()"></custom-publish>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'; 
    import {xhsInitCate, customArticleList, getMultiData, customAritcle} from '@/libs/api.js';
    import {downloadingTools, url, getUserList, userAuthority} from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table';            //表格
    import datePicker from '@/views/my-components/date-picker/date-picker';             //日期选择
    import customPublish from '@/views/my-components/article/custom-publish';           //稿件发布
    import mediaListTabs from '@/views/my-components/media/media-tabs/media-list-tabs'; //媒体列表状态选择
    export default {
        mixins:[downloadingTools, getUserList, userAuthority],
        name: 'article_list',
        data () {
            return {
                dataModal: false,               //显示单个数据列表
                tabLoading: false,             //单个数据加载中
                tabColumnsData: [
                    {
                        key: 'title',
                        title: '标题',
                        width:200,
                    },
                    {
                        key: 'title',
                        title: '链接',
                        width:220,
                        render:  (h, params) =>{
                            return h('div',{
                                attrs:{
                                    class:'ivu-input-wrapper ivu-input-type ivu-input-group-link ivu-input-group-with-append ivu-input-hide-icon',
                                }
                            },[
                                h('Input', {
                                    props:{
                                        type:'text',
                                        value:this.resData[params.index].link
                                    },
                                    attrs:{
                                        class:'ivu-input'
                                    },
                                    style:{
                                        width:"163px",
                                        borderRight:"none",
                                        float:'left'
                                    }
                                }),
                                h('div',{
                                    attrs:{
                                        class:'ivu-input-group-append',
                                    },
                                    style:{
                                        padding:'0',
                                        height:'32px'
                                    }
                                },[
                                    h('Button',{
                                        props:{
                                            slot:'append',
                                            icon:'ios-link'
                                        },
                                        on:{
                                            click: () => {
                                                if(this.resData[params.index].link) window.open(this.resData[params.index].link,'_blank');
                                            }
                                        }
                                    })
                                ]),
                                
                            ]);
                        }
                    },
                    {
                        key: 'pubTime',
                        title: '发布时间',
                        minWidth:80,
                    },
                    {
                        key: 'title',
                        title: '查看收录截图',
                        minWidth:80,
                        render: (h, params) => {
                            if(params.row.isImage == 1){
                                return h('img', {
                                    attrs:{
                                        src: params.row.fengmian
                                    },
                                    on:{
                                        click: () =>{
                                            this.fengmian = params.row.fengmian;
                                            this.includedScreenshots = true;
                                        }
                                    }
                                })
                            }
                        }
                    },
                    {
                        key: 'createTime',
                        title: '发布效果数据',
                        minWidth:150,
                        show: Cookies.get("WMGX_auth")=="1" ? true : false,
                        render:  (h, params) =>{
                            if(params.row.pubData){
                                return h('div',[
                                    h('p',[
                                        h('span','收藏:  '),
                                        h('span', params.row.pubData.collects)
                                    ]),
                                    h('p',[
                                        h('span','点赞:  '),
                                        h('span', params.row.pubData.likes)
                                    ]),
                                    h('p',[
                                        h('span','评论:  '),
                                        h('span', params.row.pubData.commentsTotal)
                                    ])
                                ]);
                            }
                        }
                    },
                    {
                        key: 'title',
                        title: '发文博主信息',
                        minWidth:120,
                        render:  (h, params) =>{
                            if(params.row.bozhuData){
                                return h('div',[
                                    h('p',[
                                        h('span','账号名称:  '),
                                        h('span', params.row.bozhuData.mediaName)
                                    ]),
                                    h('p',[
                                        h('span','地区:  '),
                                        h('span', params.row.bozhuData.region)
                                    ]),
                                    h('p',[
                                        h('span','主页地址:  '),
                                        h('span', params.row.bozhuData.userLink)
                                    ])
                                ]);
                            }
                        }
                    },
                    {
                        key: 'title',
                        title: '发文博主数据',
                        minWidth:120,
                        render:  (h, params) =>{
                            if(params.row.bozhuData){
                                return h('div',[
                                    h('p',[
                                        h('span','粉丝数:  '),
                                        h('span', params.row.bozhuData.fansNum)
                                    ]),
                                    h('p',[
                                        h('span','笔记数:  '),
                                        h('span', params.row.bozhuData.noteNum)
                                    ]),
                                    h('p',[
                                        h('span','总收藏与点赞:  '),
                                        h('span', params.row.bozhuData.collectNum)
                                    ])
                                ]);
                            }
                        }
                    },
                ],
                self:this,
                loading: true,
                ids:[],
                form:{ },
                pageInfo:{
                    per_page:15,
                    page:1,
                },
                mediaList:[],
                pubStatusList:[],
                userList:[],
                pubTime:'',
                columnsData: [
                    {
                        key: 'title',
                        title: '操作',
                        width:90,
                        show: true,
                        render: (h, params) => {
                            let arr = [ h('a', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on:{
                                        click: () => {
                                            window.open(`${url}show/custom.html?time=${params.row.time}&encrypt=${params.row.encrypt}`,'_blank');
                                        }
                                    }
                                }, '预览'),];
                            return h('div',{
                                attrs:{
                                    class: 'hint'
                                }
                            },arr)
                        }
                    },
                    {
                        key: 'brandTitle',
                        title: '新闻标题',
                        width:200,
                        show: true
                    },
                    {
                        key: 'media_name',
                        title: '定制信息',
                        width:200,
                        show: true,
                    },
                    {
                        key: 'orderNum',
                        title: '下单数量',
                        minWidth:50,
                        show: true
                    },
                    {
                        key: 'totalPrice',
                        title: '总价格',
                        minWidth:50,
                        show: true
                    },
                    {
                        key: 'link',
                        title: '回链',
                        minWidth:80,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.backLinkArr = params.row.links;
                                        this.backLinkModal = true;
                                    }
                                }
                            },'查看多条回链');
                        }
                    },
                    {
                        key: 'shoulv',
                        title: '小红书收录图片',
                        minWidth: 80,
                        show:true,
                        show: true,
                        render: (h, params) => {
                            if(params.row.attachments.length>0){
                                return h('a',{
                                    on:{
                                        click: ()=>{
                                            this.includedImg = params.row.attachments;
                                            this.includeModal = true;
                                        }
                                    }
                                }, '查看多个图片');
                            }
                        }
                    },
                    {
                        key: 'status',
                        title: '状态',
                        minWidth:100,
                        show: true,
                        render: (h, params) => {
                            if(params.row.back_count >= 1){
                                return h('div',[
                                    h('pre', {
                                        domProps: {
                                            innerHTML: params.row.status
                                        }
                                    }),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on:{
                                            click: ()=>{
                                                this.showPublish = true;
                                                this.editId = params.row.id;
                                            }
                                        }
                                    }, '重发')
                                ])
                            }else{
                                return h('pre', {
                                    domProps: {
                                        innerHTML: params.row.status
                                    }
                                })
                            }
                        }
                    },
                    {
                        key:'member_name',
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
                        title: '总效果数据',
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
                    {
                        key:'createUid',
                        title:'单个数据',
                        width:60,
                        show: true,
                        render: (h, params) => {
                            return h('a',{
                                on:{
                                    click: () => {
                                        this.accessMultiple(params.row.id);
                                        this.dataModal = true;
                                    }
                                }
                            }, '查看单个数据')
                        }
                    },
                ],
                resData:[],
                totalCount:0,
                showLoading:true,
                backLinkModal: false,             //查看多条回链
                backLinkArr: [],                  //多条回链
                includeModal: false,              //查看小红书收录图片
                includedImg: [],                  //小红书收录图片
                dataDetails: [],                  //查看单个数据
                fengmian: '',                     //单个数据 - 收录截图
                includedScreenshots: false,       //单个数据 - 显示收录截图
                showPublish: false,               //显示编辑稿件
                editId: '',                       //编辑稿件id
                editData: {},                     //编辑稿件列表
            };
        },
        computed:{
            //用户列表
            userListCom() {
                var obj={};  
                obj=JSON.parse(JSON.stringify(this.userList)); 
                return obj 
            }
        },
        methods: {
            //加载列表
            init () {
                this.showLoading = true;
                customArticleList(Object.assign(this.form,this.pageInfo)).then(res => {
                    this.showLoading = false;
                    if (res.code == 200) {
                        this.resData = res.data.list;
                        this.totalCount = parseInt(res.data.totalCount);
                    } else {
                        this.$Notice.error({title:res.message});
                    }
                });
            },

            //下载
            downSearch () {
                var down = {export: 2};
                customArticleList(Object.assign(this.form, down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/article/custom-list?', this.form,res);
                });
            },

            //文章媒体列表
            getCate(){
                xhsInitCate().then(res => {
                    if (res.code === 200) {
                        this.mediaList = res.data.mediaList;
                        this.pubStatusList = res.data.pubStatusList;
                        this.userList = res.data.userList;
                    } else {
                        this.$Notice.error({title:res.message});
                    }
                });
            },

            //页码
            changeNum (page){
                this.pageInfo.page = page;
                this.init();
            },

            //每页显示条数
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
                this.handleSearch();
            },

            //发布时间
            selectPubTime(data){
                this.form.finish_start_time = data.createTimeStart;
                this.form.finish_end_time = data.createTimeEnd;
                this.handleSearch();
            },
            
            //重置用户列表
            searchUser(query){
                this.userList = this.userListCom;
            },

            //获取多条数据
            //link 获取多条链接，只取链接
            //fengmian 获取多条收录图片
            accessMultiple(id){
                customAritcle({id: id}).then(res => {
                    if(res.code == 200){
                        this.dataDetails = res.data;
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                })
            },

            //切换tab
            selectTab(name){
                if(name == 'name1'){
                    this.$emit('showList', 0);
                }
            },

            //列表状态tab
            tabSearch(name){
                this.pageInfo.page = 1;
                this.form.pubStatus = Number(name);
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
            customPublish,
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
