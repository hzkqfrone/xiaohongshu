<template>
    <div class="article_libray_wrap">
        <div v-if="!showPubArticle && !showAddArticle">
            <Card style="margin-bottom:20px">
                <p slot="title">
                    霸屏文章库
                </p>
                <Row>
                    <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                        <FormItem label="标题">
                            <Input v-model="params.title" clearable placeholder="请输入标题" style="width: 200px" @on-change="searchData" />
                        </FormItem>
                        <FormItem label="用户" v-if="!isAuth([2])">
                            <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="searchData();changeMember();">
                                <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="博主账号">
                            <Select v-model="params.blogger_id" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in bloggerList" :key="index" :value="item.id">{{item.nickname}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择营销顾问" v-if="!isAuth([2])">
                            <Select v-model="params.market" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in marketData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择销售" v-if="!isAuth([2])">
                            <Select v-model="params.sale" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in saleData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态">
                            <Select v-model="params.status" clearable style="width:200px" @on-change="searchData">
                                <Option :value="0">未审核</Option>
                                <Option :value="1">审核通过</Option>
                                <Option :value="2">审核未通过</Option>
                                <Option :value="3">发布中</Option>
                                <Option :value="4">已发布</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="有无评论">
                            <Select v-model="params.has_comment" clearable style="width:200px" @on-change="searchData">
                                <Option :value="1">有评论</Option>
                                <Option :value="0">无评论</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="是否回复评论">
                            <Select v-model="params.is_reply" clearable style="width:200px" @on-change="searchData">
                                <Option :value="1">已回复评论</Option>
                                <Option :value="0">未回复评论</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="是否收录">
                            <Select v-model="params.is_record" clearable style="width:200px" @on-change="searchData">
                                <Option :value="1">已收录</Option>
                                <Option :value="0">未收录</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="发布日期">
                            <date-picker @changeTime="selectCreateTime"></date-picker>
                        </FormItem>
                        <FormItem label="完成日期">
                            <date-picker @changeTime="selectPubTime"></date-picker>
                        </FormItem>
                    </Form>
                    <div class="button_wrap">
                        <Button icon="md-arrow-round-down" @click="downLoadBtn">下载</Button>
                        <Button icon="ios-search" type="primary" @click="searchData">搜索</Button>
                    </div>
                </Row>
            </Card>
            <Card>
                <Row class="searchable-table-con1">
                    <div class="button_wrap">
                        <Button icon="md-add" type="primary" @click="showAddArticle=!showAddArticle">添加文章</Button>
                        <Button icon="md-close" type="error" @click="batchAuditNotPass">批量审核不通过</Button>
                        <Button icon="md-checkmark" type="success" @click="batchAuditPass">批量审核通过</Button>
                        <Button icon="md-create" type="info" v-if="isAuth([1, 5, 6])" @click="backEditBtn">批量修改</Button>
                        <Button icon="ios-settings" type="info" v-if="isAuth([1, 5, 6])" @click="changeIncludeStatus">修改收录状态</Button>
                        <Tag class="publish_count" type="border" color="#2c8df2">今日提交发布 {{publish_count}} 篇</Tag>
                    </div>
                    <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData" @selectTabCol="selectionChange"></show-table-head>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
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

        <!-- 审核文案 -->
        <Modal
            width="900"
            title="审核文案"
            transfer
            :mask-closable="false"
            v-model="auditModal"> 
            <div class="audit_wrap">
                <h4>{{detailData.title}}</h4>
                <div class="content" v-html="detailData.content"></div>
                <div class="image_wrap">
                    <img v-for="item in detailData.images" :src="item" :key="item" @click="imgName=item;imgModal=true">
                </div>
            </div>
            <div class="article_library_hint">
                <Button type="error" icon="md-close" @click="noPassModal=true">审核不通过</Button>
                <Button type="success" icon="md-checkmark" :loading="noPassLoading" @click="auditParams.audit=1; audit()">审核通过</Button>
            </div>
            <div slot="footer">
                <Button @click="auditModal=false">取消</Button>
                <Button type="primary" @click="auditModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 审核不通过原因 -->
        <Modal
            v-model="noPassModal"
            transfer
            :mask-closable="false"
            title="审核不通过原因">
            <Input type="textarea" :rows="4" placeholder="审核不通过原因" v-model="auditParams.argument"/>
            <div slot="footer">
                <Button @click="noPassModal=false">取消</Button>
                <Button type="primary" :loading="noPassLoading" @click="auditParams.audit=2; audit()">确定</Button>
            </div>
        </Modal>

        <!-- 批量修改 -->
        <Modal
            v-model="batchEditModal"
            title="批量修改"
            :mask-closable="false"
            transfer
            width="1200">
            <Table border :columns="columnsEditData" :data="batchEditData"></Table>
            <div slot="footer">
                <Button @click="batchEditModal=false">取消</Button>
                <Button type="primary" :loading="editLoading" @click="sureBatchEdit">确定</Button></Button>
            </div>
        </Modal>

        <!-- 批量修改收录状态 -->
        <Modal
            v-model="includeModal"
            title="修改收录状态"
            :mask-closable="false"
            transfer>
            <RadioGroup v-model="is_record" size="large">
                <Radio :label="1">已收录</Radio>
                <Radio :label="0">未收录</Radio>
            </RadioGroup>
            <div slot="footer">
                <Button @click="includeModal=false">取消</Button>
                <Button type="primary" :loading="changeIncludeLoading" @click="handleChangeInclude">确定</Button></Button>
            </div>
        </Modal>

        <!-- 文章评论 -->
        <Modal
            width="600"
            transfer
            :mask-closable="false"
            v-model="articleCommentModal"
            title="评论列表"> 
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div class="comment_empty" v-if="commentTotalCount==0">
                暂无评论~
            </div>
            <div class="comment_list" v-for="(item, index) in commentData" :key="index+item.name">
                <div class="head_wrap">
                    <img :src="item.head_portrait">
                    <div class="username">
                        <p>{{item.name}}</p>
                    </div>
                    <div class="reply_wrap">
                        <Button type="primary" size="small" @click="item.showCommentInput = !item.showCommentInput;$set(commentData, index, item)">回复</Button>
                        <Button type="warning" size="small" :loading="noReplyLoading" @click="notReply(index)">无需回复</Button>
                    </div>
                </div>
                <div class="content">
                    <div v-if="item.link">
                        <img :src="item.link" @click="imgName=item.link;imgModal=true">
                    </div>
                    <div v-else>
                        {{item.content}}
                    </div>
                </div>
                <ul class="reply_list" v-if="item.reply.length!=0">
                    <li v-for="(item, index) in item.reply" :key="index + item.content">
                        <p class="reply_time">{{item.created_at}}</p>
                        <p>
                            <Tag color="warning" v-if="!item.status">发送中</Tag>
                            <span>{{item.content}}</span>
                        </p>
                    </li>
                </ul>
                <div class="comment_wrap" :class="item.showCommentInput? 'show_comment':'hide_comment'">
                    <Input v-model="item.comment" :autofocus="item.showCommentInput" />
                    <Button type="success" size="small" :loading="item.commentBtnLoading" @click="handleCommentBtn(index)">评论</Button>
                </div>
            </div>
            <Page :total="commentTotalCount" v-if="commentTotalCount" :current="commentPage" show-total @on-change="changeCommentNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="articleCommentModal=false">取消</Button> 
                <Button type="primary" @click="articleCommentModal=false">确定</Button>
            </div>  
        </Modal>
 
        <!-- 查看大图 -->
        <Modal title="图片" draggable v-model="imgModal">
            <img :src="imgName" v-if="imgModal" style="width: 100%;margin: 0 auto;">
        </Modal>
        
        <!-- 发布任务 -->
        <pub-article v-if="showPubArticle" :orderNum="orderNum" :editId="editId" @cancel="showPubArticle=false, init()"></pub-article>

        <!-- 添加文章 -->
        <add-article v-if="showAddArticle" :editId="editId"  @cancel="showAddArticle=false, init()"></add-article>
    </div>
</template>
<script>
    import pubArticle from '@/views/baping/components/pub_article';
    import addArticle from '@/views/baping/components/add_article';
    import { getScreenArticle, screenArticleDetail, screenArticleRemark, screenArticleRemarkLog, screenArticleAudit, 
            batchEditArticle, getScreenBloggerList, getUserInBloggerList, getArticleComments, replyArticleComments,
            screenBatchRecord } from '@/libs/api';
    import { url, userAuthority, getUserList, downloadingTools } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    export default {
        mixins: [userAuthority, getUserList, downloadingTools],
        data(){
            return{
                showPubArticle: false,     //发布文章
                showAddArticle: false,     //添加文章
                tabLoading: false,
                resData: [],
                publish_count: 0,    //今日发布多少篇
                totalCount: 0,
                editId: '',          //编辑 发布 id
                orderNum: '',        //订单数量
                marketData: [],      //营销顾问 
                saleData: [],        //销售
                params: {},          
                auditModal: false,   //审核文案
                auditParams: {},     //审核参数 audit=>1 通过 audit=>2 不通过
                detailData: {},      //文章详情
                previewData: {},
                noPassModal: false,
                noPassLoading: false,
                showRemarks: false,     //备注 modal
                remarkParams: {},       //备注参数
                remarkLogData: [],      //备注日志
                taskList: [],           //多选 素材列表
                imgModal: false,        //查看图片 大图
                imgName: '',            //查看大图 地址
                bloggerList: [],        //博主账号列表
                articleCommentModal: false,    //文章评论
                commentData: [],               //评论列表数据
                commentTotalCount: 0,          //评论总条数
                commentPage: 1,                //评论列表 当前页码
                showSpin: false,               //评论列表 加载中
                currentRowData: {},            //点击回复评论  当前行的数据
                includeModal: false,           //收录状态 modal
                changeIncludeLoading: false,   //修改收录状态 btn loading
                is_record: 0,                  //收录状态 0 1
                noReplyLoading: false,         //点击不需要回复 loading
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        show: true,
                    },
                    {
                        key: '',
                        title: '操作',
                        width: 150,
                        show: true,
                        render: (h, params) => {
                            //审核通过之后才能预览文案  发布文案
                            let arr = [];
                            arr.push(
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on:{
                                        click:()=> {
                                            window.open(`${url}show/screen.html?time=${params.row.time}&encrypt=${params.row.encrypt}`);
                                        }
                                    },
                                },'预览文案')
                            )
                            if(params.row.status == 0){
                                //未审核
                                arr.push(
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on:{
                                            click: ()=> {
                                                this.auditModal = true;
                                                this.auditParams.ids = [params.row.id];
                                                this.detailData.title = params.row.title;
                                                this.getDetail(params.row.id);
                                            }
                                        }
                                    }, '审核')
                                )
                            }
                            if(this.isAuth([1,5,6])){
                                if(params.row.status==1){
                                    arr.push(
                                        h('Button', {
                                            props: {
                                                type: 'success',
                                                size: 'small'
                                            },
                                            on:{
                                                click: ()=>{
                                                    this.orderNum = params.row.num;
                                                    this.editId = params.row.id;
                                                    if(params.row.source_id){
                                                        this.showPubArticle = true;
                                                    }else{
                                                        this.showAddArticle = true;
                                                    }
                                                }
                                            }
                                        },'发布')
                                    )
                                }
                            }
                            return h('div', arr);
                        } 
                    },
                    {
                        key: 'member_name',
                        title: '用户',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: 'material_title',
                        title: '素材标题',
                        minWidth: 100, 
                        show: true,
                    },
                    {
                        key: 'title',
                        title: '正常标题',
                        minWidth: 100, 
                        show: true,
                        render: (h, params) => {
                            if(params.row.link){
                                return h('a', {
                                    attrs: {
                                        href: params.row.link,
                                        target: '_blank'
                                    }
                                }, params.row.title)
                            }else{
                                return h('div', params.row.title)
                            }
                        }
                    },
                    {
                        key: 'blogger_name',
                        title: '博主账号',
                        minWidth: 70, 
                        show: true,
                    },
                    {
                        key: 'combo_title',
                        title: '文章数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `收藏: ${params.row.star}`),
                                h('p', `点赞: ${params.row.like}`),
                                h('p', `评论: ${params.row.comment}`)
                            ])
                        } 
                    },
                    {
                        key: 'combo_title',
                        title: '阅读量',
                        minWidth: 80,
                        show: true,
                        render: (h, params) => {
                            return h('div', params.row.read_num)
                        } 
                    },
                    {
                        key: 'comment',
                        title: '评论',
                        minWidth: 80, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('Badge', {
                                    props: {
                                        count: params.row.comment_num,
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () =>{
                                                this.articleCommentModal = true;
                                                this.currentRowData = params.row;
                                                this.showSpin = true;
                                                this.getComments(params.row.id);
                                            }
                                        }
                                    }, '回复评论')
                                ])
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '完成时间',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', params.row.finish_time),
                            ])
                        } 
                    },
                    {
                        key: '',
                        title: '发布时间',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', params.row.online_time)
                            ])
                        } 
                    },
                    {
                        key: 'is_record',
                        title: '是否收录',
                        minWidth: 80, 
                        show: !this.isAuth([2]),
                        render: (h, params) => {
                            let record = params.row.is_record;
                            return h('div', {
                                style: {
                                    color: record ? 'green': 'red'
                                }
                            }, record ? '收录' : '未收录')
                        }
                    },
                    {
                        key: 'status_name',
                        title: '状态',
                        minWidth: 80, 
                        show: true,
                        render: (h, params) => {
                            return h('div', params.row.status_name)
                        }
                    },
                    {
                        key: '',
                        title: '备注说明',
                        minWidth: 60, 
                        show: !this.isAuth([2]),
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
                batchEditModal:false,        //批量修改 modal
                editLoading: false,          //批量修改 提交loading
                batchEditData:[],
                //批量修改
                columnsEditData:[
                    {
                        key: 'title',
                        title: '标题',
                        minWidth: 100,
                    },
                    {
                        key: 'title',
                        title: '博主账号',
                        minWidth: 70
                    },
                    {
                        key: 'link',
                        title: '链接',
                        minWidth: 120,
                        render:  (h, params) =>{
                            return h('Input', {
                                props:{
                                    type:'text',
                                    value: params.row.link
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.batchEditMsg[params.index].link = value.target.value;
                                    }
                                }
                            });
                        }
                    },
                    {
                        key: 'link',
                        title: '收藏',
                        minWidth: 70,
                        render:  (h, params) =>{
                            return h('InputNumber', {
                                props:{
                                    value: params.row.star
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.batchEditMsg[params.index].star = value;
                                    }
                                }
                            });
                        }
                    },
                    {
                        key: 'link',
                        title: '点赞',
                        minWidth: 70,
                        render:  (h, params) =>{
                            return h('InputNumber', {
                                props:{
                                    value: params.row.like
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.batchEditMsg[params.index].like = value;
                                    }
                                }
                            });
                        }
                    },
                    {
                        key: 'link',
                        title: '评论',
                        minWidth: 70,
                        render:  (h, params) =>{
                            return h('InputNumber', {
                                props:{
                                    value: params.row.comment
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.batchEditMsg[params.index].comment = value;
                                    }
                                }
                            });
                        }
                    },
                    {
                        key: 'link',
                        title: '阅读量',
                        minWidth: 70,
                        render:  (h, params) =>{
                            return h('InputNumber', {
                                props:{
                                    value: params.row.read_num
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.batchEditMsg[params.index].read_num = value;
                                    }
                                }
                            });
                        }
                    },
                ],
            }
        },
        mounted() {
            this.init();
            this.getBaPingUserList();
            this.loadSaleList();
            this.loadMarketList();
            this.getBloggerList();
        },
        computed: {
            batchEditMsg(){
                return JSON.parse(JSON.stringify(this.batchEditData));
            }
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                getScreenArticle(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.publish_count = res.data.publish_count;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //获取文章详情
            getDetail(id){
                screenArticleDetail(id).then(res => {
                    if(res.code == 200){
                        this.$set(this.detailData, 'content', res.data.content);
                        this.$set(this.detailData, 'images', res.data.images);
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //审核
            audit(){
                this.noPassLoading = true;
                if(this.auditParams.audit == 1) delete this.auditParams.argument
                screenArticleAudit(this.auditParams).then(res => {
                    this.noPassLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.noPassModal = false;
                        this.auditModal = false;
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                screenArticleRemarkLog({id: id}).then(res => {
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
                screenArticleRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //多选
            selectionChange(data){
                this.auditParams = {
                    ids: []
                };
                this.batchEditData = [];
                this.taskList = data;
                data.forEach(v => {
                    this.auditParams.ids.push(v.id);
                    this.batchEditData.push({
                        id: v.id,
                        title: v.title,
                        read_num: v.read_num,
                        trans: v.trans,
                        comment: v.comment,
                        like: v.like,
                        star: v.star,
                        link: v.link
                    })
                })
            },
            
            //发布日期
            selectCreateTime(date){
                this.params.online_time_start = date.createTimeStart;
                this.params.online_time_end = date.createTimeEnd;
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
                getScreenArticle(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/screen/article?', this.params, res);
                });
            },

            //搜索
            searchData(){
                this.params.page = 1;
                this.init();
            },

            //批量审核通过
            batchAuditPass(){
                this.$Modal.confirm({
                    title: '已选择中文章确定审核通过吗?',
                    onOk: () => {
                        this.auditParams.audit = 1;
                        this.audit();
                    },
                    onCancel: () => {
                        
                    }
                });
            },

            //批量审核不通过
            batchAuditNotPass(){
                this.auditParams.audit = 2;
                this.noPassModal = true;
            },  

            //选择修改文章
            backEditBtn(){
                if(this.batchEditData.length==0){
                    this.$Notice.warning({ title: '请选中要修改的列' })
                    return 
                }
                this.batchEditModal = true;
            },

            //确定批量修改
            sureBatchEdit(){
                this.editLoading = true;
                batchEditArticle({article: this.batchEditMsg}).then(res => {
                    this.editLoading = false;
                    if(res.code == 200){
                        this.batchEditModal = false;
                        this.init();
                        this.$Notice.success({ title: res.message });
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //批量修改收录状态  
            changeIncludeStatus(){
                if(this.batchEditData.length==0){
                    this.$Notice.warning({ title: '请选中要修改的列' })
                    return 
                }
                this.includeModal = true;
            },

            //确定 修改收录状态
            handleChangeInclude(){
                let data = {
                    ids: this.auditParams.ids,
                    is_record: this.is_record
                }
                this.changeIncludeLoading = true;
                screenBatchRecord(data).then(res =>{
                    this.changeIncludeLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.init();
                        this.includeModal = false;
                        this.is_record = 0;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //筛选 -  选择用户 显示对应的 博主账号
            changeMember(){
                if(this.params.member_id){
                    getUserInBloggerList({member_id: this.params.member_id}).then(res => {
                        if(res.code == 200){
                            this.bloggerList = res.data;
                        }else{
                            this.$Notice.error({title: res.message});
                        }
                    })
                }
            },  

            //加载博主账号列表
            getBloggerList(){
                getScreenBloggerList().then(res => {
                    if(res.code == 200){
                        this.bloggerList = res.data;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //单个文章的评论列表
            getComments(id){
                getArticleComments({id: id}).then(res => {
                    this.showSpin = false;
                    if(res.code == 200){
                        this.commentData = res.data.list;
                        this.commentData.forEach( v => {
                            v.showCommentInput = false;
                        })
                        this.commentTotalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //评论 页码
            changeCommentNum(page){
                this.commentPage = page;
                this.init();
            },

            //回复 评论
            handleCommentBtn(index){
                let msg = this.commentData[index];
                let data = {
                    id: msg.id,
                    content: msg.comment
                }
                if(!msg.comment){
                    this.$Notice.warning({ title: '(#`O′)未填写评论内容' });
                    return
                }
                msg.commentBtnLoading = true;
                this.$set(this.commentData, index, msg);
                replyArticleComments(data).then(res => {
                    msg.commentBtnLoading = false;
                    this.$set(this.commentData, index, msg);
                    if(res.code == 200){
                        this.successReply(msg, index);
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //回复评论 成功~
            successReply(msg, index){
                // 未回复过的评论       回复成功后列表 未回复数减一
                if(msg.reply.length == 0){
                    this.currentRowData.comment_num -= 1;
                }
                msg.comment = '';
                this.$set(this.commentData, index, msg);
                this.getComments(this.currentRowData.id);
            },

            //不需要回复
            notReply(index){
                this.noReplyLoading = true;

                this.currentRowData.comment_num -= 1;
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
            pubArticle,
            addArticle,
            datePicker,
            showTableHead
        }
    }
</script>

<style lang="less">
    .article_libray_wrap{
        .ivu-table-cell{
            overflow: initial;
        }
        .publish_count{
            float: right;
            vertical-align: top;
            margin-left: 10px;
        }
    }
    .article_library_hint{
        text-align: center;
        margin-top:20px;
        button{
            margin:0 10px;
        }
    }
    .audit_wrap{
        h4{
            padding-bottom:20px;
            text-align: center;
        }
        .content{
            img{
                max-width: 800px !important;
            }
        }
        .image_wrap{
            margin-top: 10px;
            img{
                max-width: 200px;
                display: inline-block;
                padding: 5px;
                border: 1px solid #e5e5e5;
                margin: 10px;
                vertical-align: top;
            }
        }
    }
    .comment_empty{
        line-height: 50px;
        color: #999;
        text-align: center;
    }
    .comment_list{
        padding:10px 0;
        border-bottom: 1px solid #e5e5e5;
        &:last-child{
            border:none;
        }
        .head_wrap{
            img{
                width: 32px;
                height: 32px;
                display: inline-block;
                border-radius: 16px;
            }
            .username{
                display: inline-block;
                margin-left: 10px;
                vertical-align: top;
                margin-top: 5px;
            }
            .reply_wrap{
                display: none;
                float: right;
                margin: 10px;
            }
        }
        .content{
            margin-left: 42px;
            line-height: 24px;
            color:#000;
            padding-bottom: 10px;
            i{
                color: #ef026d;
                font-size: 18px;
                vertical-align: top;
                cursor: pointer;
            }
            img{
                max-width: 280px;
            }
        }
        &:hover{
            background: #f9f9f9;
            & .reply_wrap{
                display: block;
            }
        }
        .reply_list{
            margin: 0 20px 0 50px;
            background: #f4f9ff;
            li{
                padding: 0 10px;
                list-style: none;
                line-height: 24px;
                border-bottom: 1px solid #efefef;
                &:last-child{
                    border:none;
                }
                .ivu-tag.ivu-tag-warning{
                    height: 20px;
                    line-height: 20px;
                    padding: 0 4px;
                }
                .reply_time{
                    color: #999;
                }
            }
        }
        .comment_wrap{
            text-align: center;
            padding-top: 5px;
            .ivu-input-wrapper{
                width: 400px;
                display: inline-block;
            }
            transition: all .5s ease-in-out;
            &.hide_comment{
                height: 0;
                overflow: hidden;
                opacity: 0;
            }
            &.show_comment{
                height: auto;
                opacity: 1;
            }
        }
    }
</style>
