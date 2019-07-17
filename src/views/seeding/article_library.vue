<template>
    <div>
        <div v-if="!showPubArticle">
            <Card style="margin-bottom:20px">
                <p slot="title">
                    种草文章库
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
                        <FormItem label="状态:">
                            <Select v-model="params.status" clearable style="width:200px" @on-change="serchData">
                                <Option :value="0">未审核</Option>
                                <Option :value="1">审核通过</Option>
                                <Option :value="2">审核未通过</Option>
                                <Option :value="3">已发布</Option>
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
                    <div class="button_wrap">
                        <Button icon="md-paper-plane" type="primary" v-if="isAuth([1,5,6])" @click="batchPubTask">发布任务</Button>
                        <Button icon="md-close" type="error"  @click="batchAuditNotPass">批量审核不通过</Button>
                        <Button icon="md-checkmark" type="success" @click="batchAuditPass">批量审核通过</Button>
                    </div>
                    <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData" @on-selection-change="selectionChange"></Table>
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
            :mask-closable="false"
            v-model="auditModal"> 
            <div class="audit_wrap">
                <h4>{{detailData.title}}</h4>
                <div class="content" v-html="detailData.content"></div>
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
            :mask-closable="false"
            title="审核不通过原因">
            <Input type="textarea" :rows="4" placeholder="审核不通过原因" v-model="auditParams.argument"/>
            <div slot="footer">
                <Button @click="noPassModal=false">取消</Button>
                <Button type="primary" :loading="noPassLoading" @click="auditParams.audit=2; audit()">确定</Button>
            </div>
        </Modal>
        
        <!-- 发布任务 -->
        <pub-article v-if="showPubArticle" :orderNum="orderNum" :editId="editId" @cancel="showPubArticle=false, init()"></pub-article>
    </div>
</template>
<script>
    import pubArticle from '@/views/seeding/components/pub_article';
    import { getSeedingArticle, getSeedingArticleDetail, seedingArticleRemark, seedingArticleRemarkLog, seedingArticleAudit } from '@/libs/api';
    import { url, userAuthority, getUserList, downloadingTools } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [userAuthority, getUserList, downloadingTools],
        data(){
            return{
                showPubArticle: false,
                tabLoading: false,
                resData: [],
                totalCount: 0,
                editId: [],          //编辑 发布 id
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
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: '',
                        title: '操作',
                        width: 150,
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
                                            window.open(`${url}show/seeding-article.html?time=${params.row.time}&encrypt=${params.row.encrypt}`);
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
                                                    this.editId = [params.row.id];
                                                    this.showPubArticle = true;
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
                    },
                    {
                        key: 'material_title',
                        title: '素材标题',
                        minWidth: 90, 
                    },
                    {
                        key: 'title',
                        title: '正常标题',
                        minWidth: 90, 
                    },
                    {
                        key: 'combo_title',
                        title: '套餐类型',
                        minWidth: 60, 
                    },
                    {
                        key: '',
                        title: '完成时间 / 发布时间',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('p', params.row.created_at),
                                h('p', params.row.finish_time)
                            ])
                        } 
                    },
                    {
                        key: 'status_name',
                        title: '状态',
                        minWidth: 80, 
                        render: (h, params) => {
                            return h('div', params.row.status_name)
                        }
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
                getSeedingArticle(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //批量发布任务
            batchPubTask(){
                this.editId = [];
                if(this.taskList.length == 0){
                    this.$Notice.warning({title: '请至少选择一个素材~'})
                    return
                }else{
                    let handle = this.taskList[0].material_id;
                    let flg = true;
                    let status = true;
                    this.taskList.forEach((v) => {
                        this.editId.push(v.id);
                        if(handle != v.material_id){
                            flg = false;
                        }else if(v.status != 1){
                            status = false;
                        }
                    })
                    this.$nextTick(() => {
                        if(!flg){
                            this.$Notice.warning({title: '请选择同一个素材~'});
                        }else if(!status){
                            this.$Notice.warning({title: '含有未审核素材~'})
                        }else{
                            this.showPubArticle = true;
                        }
                    })
                }
            },

            //获取文章详情
            getDetail(id){
                getSeedingArticleDetail(id).then(res => {
                    if(res.code == 200){
                        this.$set(this.detailData, 'content', res.data);
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //审核
            audit(){
                this.noPassLoading = true;
                if(this.auditParams.audit == 1) delete this.auditParams.argument
                seedingArticleAudit(this.auditParams).then(res => {
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
                seedingArticleRemarkLog({id: id}).then(res => {
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
                seedingArticleRemark(this.remarkParams).then(res =>{
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
                this.taskList = data;
                data.forEach(v => {
                    this.auditParams.ids.push(v.id);
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
                getSeedingArticle(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding-article?', this.params, res);
                });
            },

            //搜索
            serchData(){
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
            datePicker
        }
    }
</script>

<style lang="less">
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
    }
</style>
