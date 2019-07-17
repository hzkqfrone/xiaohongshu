<template>
    <div>
        <Card>
            <p slot="title">排名数据管理</p>
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                <FormItem label="用户" v-if="!isAuth([2])">
                    <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="serchData()">
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
                <FormItem label="查询日期">
                    <date-picker @changeTime="selectSearchTime"></date-picker>
                </FormItem>
                <FormItem label="到期日期">
                    <date-picker @changeTime="selectExpireTime"></date-picker>
                </FormItem>
                <!-- <FormItem label="显示全部" v-if="!isAuth([2])">
                    <i-switch :true-value="1" :false-value="0" v-model="params.all" />
                </!--> 
            </Form>
            <div class="button_wrap">
                <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
            </div>
        </Card>
        <Card style="margin-top:20px;">
            <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
        </Card>

        <!-- 编辑 -->
        <Modal
            title="编辑"
            :mask-closable="false"
            v-model="editModal"> 
            <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'">
                <FormItem label="用户名：">
                    <div>{{editParams.username}}</div>
                </FormItem>
                <FormItem label="暂停计费：">
                    <i-switch :true-value="1" :false-value="0" v-model="editParams.screen_suspend" />
                </FormItem>
                <FormItem label="续费日期：">
                    <DatePicker type="date" placeholder="选择日期" :value="editParams.screen_deadline" @on-change="changeEditDate" style="width: 200px"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="editModal=false">取消</Button>
                <Button type="primary" :loading="editBtnLoading" @click="editBtnClick">确定</Button>
            </div>
        </Modal>

        <!-- 查看历史 -->
        <Modal
            title="历史排名"
            :mask-closable="false"
            class="history_rank"
            v-model="historyRankingModal"> 
            <Timeline>
                <Spin v-if="showSpin" fix></Spin>
                <TimelineItem color="green" v-for="item in historyRankData" :key="item.date+item.total_rank">
                    <p>
                        {{item.date}}
                        <span class="historyRank">&nbsp;&nbsp;&nbsp;{{item.total_rank}}</span>
                        <Icon 
                            type="md-arrow-round-down" 
                            class="rankDownLoad" 
                            title="下载" 
                            @click="rankDownLoadBtn(item)" 
                        />
                    </p>
                </TimelineItem>
            </Timeline>
            <div slot="footer">
                <Button @click="historyRankingModal=false">取消</Button>
                <Button type="primary" @click="historyRankingModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 关键词明细 -->
        <Modal
            width="1000"
            title="关键词明细"
            :mask-closable="false"
            v-model="keywordDetailsModal"> 
            <keyword-details v-if="keywordDetailsModal" :member_id="memberId"></keyword-details>
            <div slot="footer">
                <Button @click="keywordDetailsModal=false">取消</Button>
                <Button type="primary" @click="keywordDetailsModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 博主数量明细 -->
        <Modal
            width="1000"
            title="博主数量明细"
            :mask-closable="false"
            v-model="bloggerDetailsModal"> 
            <blogger-details v-if="bloggerDetailsModal" :member_id="memberId"></blogger-details>
            <div slot="footer">
                <Button @click="bloggerDetailsModal=false">取消</Button>
                <Button type="primary" @click="bloggerDetailsModal=false">确定</Button>
            </div>
        </Modal>

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

    </div>
</template>
<script>
    import { rankingDataList, screenDataRemark, screenDataRemarkLog, screenDataRankLog, screenDataReset, screenDataEdit,
         sendWechtMessage, screenCutomerList } from '@/libs/api';
    import { getUserList, userAuthority, downloadingTools, url } from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    import datePicker from '@/views/my-components/date-picker/date-picker';  
    import keywordDetails from '@/views/baping/components/ranking_data/keyword_details';
    import bloggerDetails from '@/views/baping/components/ranking_data/blogger_details';
    export default {
        mixins: [getUserList, userAuthority, downloadingTools, url],
        data(){
            return {
                params: {},
                tabLoading: false,
                resData: [],                    //数据列表
                totalCount: 0,                  //数据总条数
                editModal: false,               //编辑 模态框
                editBtnLoading: false,          //确定编辑 btn loading
                historyRankingModal: false,     //历史排名 模态框
                showSpin: false,
                historyRankData: [],            //历史排名
                keywordDetailsModal: false,     //关键词明细 modal
                bloggerDetailsModal: false,     //博主数量明细
                memberId: '',                   //用户id
                showRemarks: false,             //备注 modal
                remarkParams: {},               //备注参数
                remarkLogData: [],              //备注日志
                editParams: {screen_suspend: 0},                 //编辑 参数
                customerList: [],               //用户列表
                columnsData: [
                    {
                        key: '',
                        title: '操作',
                        width: 140,
                        show: this.isAuth([1, 5, 6]),
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 5px 5px 0'
                                    },
                                    on: {
                                        click: () => {
                                            this.heavyCheck(params.row.id);
                                        }
                                    }
                                }, '重查'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.downLoad(params.row.id);
                                        }
                                    }
                                }, '导出'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: ()=> {
                                            this.editParams = {
                                                member_id: params.row.id,
                                                username: params.row.username,
                                                screen_suspend: params.row.screen_suspend,
                                            }
                                            this.editModal = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Tag', {
                                    props:{
                                        color: params.row.is_done=='1'? 'blue': 'default'
                                    }
                                }, params.row.is_done=='1'? '查询完成' : '正在查询')
                            ])
                        }
                    },
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 60,
                        show: true
                    },
                    {
                        key: 'keywords_count',
                        title: '关键词数量',
                        minWidth: 60,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.memberId = params.row.id;
                                        this.keywordDetailsModal = true;
                                    }
                                }
                            }, params.row.keywords_count)
                        }
                    },
                    {
                        key: 'blogger_count',
                        title: '博主数量',
                        minWidth: 60,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: () => {
                                        this.memberId = params.row.id;
                                        this.bloggerDetailsModal = true;
                                    }
                                }
                            }, params.row.blogger_count)
                        }
                    },
                    {
                        key: 'rank',
                        title: '排名总数',
                        minWidth: 60,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: ()=> {
                                        this.memberId = params.row.id;
                                        this.getHistoryRankData(params.row.id);
                                    }
                                }
                            }, params.row.rank)
                        }
                    },
                    {
                        key: '',
                        title: '今 / 昨 排名量',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `今: ${params.row.today}`),
                                h('p', `昨: ${params.row.yesterday}`)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '曝光总数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) =>{
                            return h('div', [
                                h('p', `评论总数: ${params.row.comment}`),
                                h('p', `阅读量: ${params.row.read_num}`)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '相关总数据',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `笔记: ${params.row.note}`),
                                h('p', `粉丝: ${params.row.fans}`),
                                h('p', `点赞收藏: ${params.row.collect}`)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '查询日期 / 到期日期',
                        minWidth: 80,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `${params.row.screen_start}`),
                                h('p', `${params.row.screen_deadline}`)
                            ])
                        }
                    },
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 60,
                        show: !this.isAuth([2]),
                    },
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 60,
                        show: !this.isAuth([2]),
                    },
                    {
                        key: 'screen_remark',
                        title: '备注说明',
                        minWidth: 80,
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
                            }, params.row.screen_remark || '暂无备注~')
                        }
                    },
                    {
                        key: 'market_name',
                        title: '返表',
                        width: 70,
                        show: this.isAuth([1,5,6]),
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    type: params.row.is_send==0?'primary':'warning'
                                },
                                on: {
                                    click: ()=>{
                                        this.sendWechatData(params.row.id);
                                    }
                                }
                            }, params.row.is_send==0?'返表':'已返表')
                        }
                    },
                ]
            }
        },
        mounted() {
            this.init();
            this.getCutomerList();
            this.loadSaleList();
            this.loadMarketList();
        },
        methods: {
            init(){
                this.tabLoading = true;
                rankingDataList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //查询日期
            selectSearchTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.serchData();
            },

            //到期日期
            selectExpireTime(date){
                this.params.deadline_start = date.createTimeStart;
                this.params.deadline_end = date.createTimeEnd;
                this.serchData();
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
            },

            //历史排名数量详情
            getHistoryRankData(id){
                this.historyRankingModal = true;
                this.showSpin = true;
                screenDataRankLog({member_id: id}).then(res => {
                    this.showSpin = false;
                    if(res.code == 200){
                        this.historyRankData = res.data;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //历史排名  下载
            rankDownLoadBtn(data){
                let params = {
                    member_id: this.memberId,
                    export_date: data.date
                }
                this.downLoadwj(url + 'api/v1/screen/data/export?', params, {code: 200});
            },

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                screenDataRemarkLog({id: id}).then(res => {
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
                screenDataRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //重查
            heavyCheck(id){
                this.$Modal.confirm({
                    title: '确定要重查吗?',
                    onOk: () => {
                        this.sureHeavyCheck(id);
                    },
                    onCancel: () => {}
                });
            },

            //确定 重查 
            sureHeavyCheck(id){
                screenDataReset({member_id: id}).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //导出
            downLoad(id){
                this.downLoadwj(url + 'api/v1/screen/data/export?', {member_id: id}, {code: 200});
            },

            //选择续费日期
            changeEditDate(date){
                this.editParams.screen_deadline = date;
            },

            //编辑
            editBtnClick(){
                this.editBtnLoading = true;
                screenDataEdit(this.editParams).then(res => {
                    this.editBtnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.editModal = false;
                        this.editParams = {};
                        this.init();
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //返表 -  给微信发送通知数据
            sendWechatData(id){
                let data = {
                    member_id: id
                }
                sendWechtMessage(data).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.init();
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //加载用户列表
            getCutomerList(){
                screenCutomerList().then(res => {
                    if(res.code == 200){
                        this.customerList = res.data;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            }
        },
        components: {
            showTableHead,
            datePicker,
            keywordDetails,
            bloggerDetails
        }
    }
</script>
<style lang="less">
    .historyRank{
        color: red;
        width: 60px;
        display: inline-block;
    }
    .rankDownLoad{
        color: #2d8cf0;
        font-size: 18px;
        vertical-align: top;
        cursor: pointer;
    }
    .history_rank{
        .ivu-modal-body{
            height: 500px;
            overflow: auto;
        }
    }
</style>
