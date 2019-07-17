<template>
    <div>
        <Card>
            <p slot="title">
                博主账户管理
            </p>
            <Alert type="warning">使用说明：
                <p class="alert_item">1.提交一个博主链接扣 <b>100</b> 积分，可以免费提交5个文章链接，超过5个链接，增加一个文章链接扣10积分。查询周期一个月。</p>
                <p class="alert_item">2.添加之后一个月之内不可删除修改，一个月之后可选择下线(在到期之前的前三天可选择下线)，如未点击下线默认自动扣除积分。</p> 
            </Alert>
            <Row>
                <Col class="button_wrap">
                    <Row>
                        <Col :md="12" :sm="24">
                            <Button type="primary" icon="md-add" @click="bloggerLinkModal=true;bloggerLink=''">添加博主链接</Button>
                            <Button type="primary" icon="md-add" @click="articleLinkModal=true;articleLink={}">添加文章链接</Button>
                        </Col>
                        <Col :md="12" :sm="24" class="statistics">
                            <Tag type="border" color="blue">当前总积分: {{interalData.frozen_integral}}  </Tag>
                            <Tag type="border" color="blue">剩余积分: {{interalData.integral}}  </Tag>
                            <Button type="info" size="small" @click="page=1;showConsumeLog()">扣除积分明细</Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Table :loading="tableLoading" :columns="columns" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                </Col>
            </Row>
        </Card>

        <!-- 添加博主链接 -->
        <Modal
            v-model="bloggerLinkModal"
            transfer
            :mask-closable="false"
            title="添加博主链接">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" inline>
                <FormItem label="博主链接">
                    <Input clearable placeholder="请输入链接" v-model="bloggerLink" style="width: 300px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="bloggerLinkModal=false">取消</Button>
                <Button type="primary" :loading="addLinkLoading" @click="handleAddLink">确定</Button>
            </div>
        </Modal>

        <!-- 添加文章链接 -->
        <Modal
            v-model="articleLinkModal"
            transfer
            :mask-closable="false"
            title="添加文章链接">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" inline>
                <FormItem label="选择博主">
                    <Select clearable style="width:300px" v-model="articleLink.blogger_id" @on-change="changeBlogger">
                        <Option v-for="(item, index) in bloggerList" :key="index" :value="item.id">{{item.name}}</Option>
                    </Select>
                    <p v-if="freeNumberHint" class="freeNumberHint">{{freeNumberHint}}</p>
                </FormItem>
                <FormItem label="文章链接">
                    <Input clearable placeholder="请输入链接" style="width: 300px" v-model="articleLink.link" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="articleLinkModal=false">取消</Button>
                <Button type="primary" :loading="addArticleLinkLoading" @click="handleAddArticleLink">确定</Button>
            </div>
        </Modal>

        <!-- 查看文章数据 -->
        <Modal
            width="1000"
            v-model="articleDataModal"
            transfer
            title="文章数据">
            <Table :loading="articleLoading" :columns="articleColumns" :data="articleResData"></Table>
            <Page :total="articleTotalCount" show-total @on-change="changeArticleNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="articleDataModal=false">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>

        <!-- 扣除积分明细 -->
        <Modal
            width="800"
            v-model="consumeLogModal"
            title="扣除积分明细"> 
            <Table stripe border :loading="consumLoading" :columns="consumeCol" :data="consumeData"></Table>
            <Page :total="consumeTotal" show-total @on-change="consumeChangeNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="consumeLogModal=false">取消</Button>
                <Button type="primary" @click="consumeLogModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 文章评论 -->
        <Modal
            width="600"
            v-model="articleCommentModal"
            title="最新两条评论"> 
            <div class="comment_list" v-for="(item, index) in commentData" :key="index">
                <div class="head_wrap">
                    <img :src="item.image">
                    <div class="username">
                        <p>{{item.nickname}}</p>
                    </div>
                </div>
                <div class="content">
                    {{item.content}}
                </div>
            </div>
            <div slot="footer">
                <Button @click="articleCommentModal=false">取消</Button>
                <Button type="primary" @click="articleCommentModal=false">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { bloggerAccountList, addBloggerLink, addBloggerArticleLink, integralConsumeLog, getBloggerList, freeNumber, getBloggerArticle, getIntegralDetails } from '@/libs/api';
export default {
    data(){
        return {
            tableLoading: false,
            totalCount: 0,             //总条数
            params: {},
            bloggerLinkModal: false,   //添加博主链接 modal
            addLinkLoading: false,
            bloggerLink: '',           //博主链接 params
            articleLinkModal: false,   //添加文章链接 modal
            articleLink: {},           //文章链接 params
            addArticleLinkLoading: false,
            articleCommentModal: false,//文章评论 modal
            commentData: [],           //文章评论 数据
            resData: [], 
            columns: [
                {
                    key: 'name',
                    title: '博主名称',
                    minWidth: 80, 
                },
                {
                    key: 'link',
                    title: '博主链接',
                    minWidth: 80, 
                    render: (h, params) => {
                        return h('a', {
                            attrs: {
                                href: params.row.link,
                                target: '_blank'
                            }
                        }, params.row.link)
                    }
                },
                {
                    key: '',
                    title: '相关数据',
                    minWidth: 120, 
                    render: (h, params) => {
                        let msg = params.row;
                        return h('div', [
                            h('p', `粉丝数：${msg.fans}`),
                            h('p', `笔记数：${msg.note}`),
                            h('p', `总收藏与点赞：${msg.collect}`)
                        ])
                    }
                },
                {
                    key: 'comments',
                    title: '文章评论(最新两条评论)',
                    minWidth: 80, 
                    render:(h, params) => {
                        if(params.row.comments.length > 0){
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.commentData = params.row.comments;
                                        this.articleCommentModal = true;
                                    }
                                }
                            }, '查看文章评论')
                        }
                    }
                },
                {
                    key: 'created_at',
                    title: '添加日期',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '文章数据',
                    minWidth: 100, 
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small',
                                type: 'success'
                            },
                            on: {
                                click: ()=> {
                                    this.showArticleContent(params.row.id);
                                }
                            }
                        }, '查看文章数据')
                    }
                },
            ],
            articleDataModal: false,
            articleLoading: false,
            articleTotalCount: 0,       //文章数据 总条数
            articleResData: [],         //文章数据
            articleColumns: [   
                {
                    key: 'title',
                    title: '标题',
                    minWidth: 80, 
                },
                {
                    key: 'link',
                    title: '链接',
                    minWidth: 80, 
                    render: (h, params) => {
                        return h('a', {
                            attrs:{
                                href: params.row.link,
                                target: '_blank'
                            }
                        }, params.row.link)
                    }
                },
                {
                    key: 'record',
                    title: '是否收录',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '文章数据',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('p', `收藏：${params.row.like}`),
                            h('p', `点赞：${params.row.star}`),
                            h('p', `评论：${params.row.comment}`)
                        ])
                    } 
                },
                {
                    key: '',
                    title: '最新两条评论',
                    minWidth: 80, 
                    render:(h, params) => {
                        if(params.row.comments.length>0){
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.commentData = params.row.comments;
                                        this.articleCommentModal = true;
                                    }
                                }
                            }, '查看文章评论')
                        }
                    }
                },
                {
                    key: 'search_time',
                    title: '查询日期',
                    minWidth: 80, 
                }
            ],
            consumeLogModal: false,
            consumLoading: false,
            consumeTotal: 0,
            consumPage: 1,
            consumeData: [],
            consumeCol: [
                {
                    key: 'created_at',
                    title: '日期',
                    minWidth: 80
                },
                {
                    key: 'old_num',
                    title: '扣除前',
                    minWidth: 80
                },
                {
                    key: 'new_num',
                    title: '扣除后',
                    minWidth: 80
                },
                {
                    key: 'num',
                    title: '扣除积分',
                    minWidth: 80
                },
                {
                    key: 'remark',
                    title: '备注',
                    minWidth: 80
                },
            ],
            bloggerList: [], 
            freeNumberHint: '',          //免费添加文章链接 次数提示
            interalData: {},             //积分详情
        }
    },
    mounted() {
        this.init();
        this.getBloggerList();
        this.getIntegralDetails();
    },
    methods: {
        //加载列表
        init(){
            this.tableLoading = true;
            bloggerAccountList(this.params).then(res => {
                this.tableLoading = false;
                if(res.code == 200){
                    this.resData = res.data.list;
                    this.totalCount = res.data.totalCount;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //添加博主链接
        handleAddLink(){
            if(!this.bloggerLink){
                this.$Notice.warning({title: '请填写博主链接'});
                return
            }
            this.addLinkLoading = true;
            addBloggerLink({link: this.bloggerLink}).then(res => {
                this.addLinkLoading = false;
                if(res.code == 200){
                    this.$Notice.success({title: res.message});
                    this.bloggerLinkModal = false;
                    this.init();
                    this.getBloggerList();
                    this.getIntegralDetails();
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查询 添加文章链接剩余免费次数
        changeBlogger(){
            let data = { blogger_id: this.articleLink.blogger_id }
            freeNumber(data).then(res => {
                if(res.code == 200){
                    this.freeNumberHint = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },  

        //添加文章链接
        handleAddArticleLink(){
            if(!this.articleLink.blogger_id){
                this.$Notice.warning({title: '请选择博主'});
                return 
            }else if(!this.articleLink.link){
                this.$Notice.warning({title: '请填写文章链接'});
                return
            }
            this.addArticleLinkLoading = true;
            addBloggerArticleLink(this.articleLink).then(res => {
                this.addArticleLinkLoading = false;
                if(res.code == 200){
                    this.articleLinkModal = false;
                    this.$Notice.success({title: res.message});
                    this.init();
                    this.getIntegralDetails();
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看消费明细
        showConsumeLog(){
            this.consumeLogModal = true;
            this.consumLoading = true;
            integralConsumeLog({page: this.consumPage}).then(res => {
                this.consumLoading = false;
                if(res.code == 200){
                    this.consumeData = res.data.list;
                    this.consumeTotal = res.data.totalCount;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //消费明细分页
        consumeChangeNum(page){
            this.consumPage = page;
            this.showConsumeLog();
        },

        //获取博主列表
        getBloggerList(){
            getBloggerList().then(res => {
                if(res.code == 200){
                    this.bloggerList = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看文章数据
        showArticleContent(id, page){
            this.articleDataModal = true;
            this.articleLoading = true;
            let data = { blogger_id: id };
            if(page) data.page = page;
            getBloggerArticle(data).then(res => {
                this.articleLoading = false;
                if(res.code == 200){
                    this.articleResData = res.data.list;
                    this.articleTotalCount = res.data.totalCount;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看文章数据 分页
        changeArticleNum(page){
            this.showArticleContent(id, page);
        },

        //获取积分详情
        getIntegralDetails(){
            getIntegralDetails().then(res => {
                if(res.code ==  200){
                    this.interalData = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
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
}
</script>
<style lang="less" scoped>
    .statistics{
        margin-bottom:20px;
        .ivu-tag-blue{
            vertical-align: top;
        }
    }
</style>
<style lang="less">
    .comment_list{
        padding:10px 0;
        &:last-child{
            border:none;
        }
        border-bottom: 1px solid #e5e5e5;
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
        }
        .content{
            margin-left: 42px;
            line-height: 27px;
             color:#000;
        }
    }
    .freeNumberHint{
        color: red;
    }
    .alert_item{
        line-height: 24px;
    }
</style>
