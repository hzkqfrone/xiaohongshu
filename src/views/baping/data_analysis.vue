<template>
    <div>
        <Card>
            <p slot="title">种草数据分析</p>
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
            </Form>
            <div class="button_wrap">
                <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
            </div>
        </Card>
        <Card style="margin-top:20px;">
            <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
        </Card>

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
    import { rankingDataList, screenDataRemark, screenDataRemarkLog } from '@/libs/api';
    import { getUserList, userAuthority } from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    import datePicker from '@/views/my-components/date-picker/date-picker';  
    export default {
        mixins: [getUserList, userAuthority],
        data(){
            return {
                params: {},
                tabLoading: false,
                resData: [],                    //数据列表
                totalCount: 0,                  //数据总条数
                showSpin: false,
                showRemarks: false,             //备注 modal
                remarkParams: {},               //备注参数
                remarkLogData: [],              //备注日志
                columnsData: [
                    {
                        key: 'username',
                        title: '客户名称',
                        minWidth: 60,
                        show: true
                    },
                    {
                        key: 'keywords_count',
                        title: '发布笔记数据',
                        minWidth: 60,
                        show: true,
                    },
                    {
                        key: 'rank',
                        title: '前20名覆盖量',
                        minWidth: 60,
                        show: true,
                    },
                    {
                        key: '',
                        title: '相关数据',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `点赞: ${params.row.today}`),
                                h('p', `收藏: ${params.row.yesterday}`),
                                h('p', `评论: ${params.row.yesterday}`)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '客户详情信息',
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
                ]
            }
        },
        mounted() {
            this.init();
            this.getBaPingUserList();
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
        },
        components: {
            showTableHead,
            datePicker,
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
</style>
