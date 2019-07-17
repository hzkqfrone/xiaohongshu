<template>
    <div class="manuscript">
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        费用充值明细
                    </p>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="用户名">
                                <Input placeholder="用户名" v-model="params.title" clearable @on-change="init();params.page=1;" />
                            </FormItem>
                            <FormItem label="充值日期">
                                <date-picker @changeTime="rechargeTime"></date-picker>
                            </FormItem>
                            <FormItem label="营销顾问">
                                <Select v-model="params.market" filterable clearable style="width:200px" @on-change="init();params.page=1;">
                                    <Option v-for="(item, index) in marketList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <div>
                                <Button type="info" icon="md-arrow-round-down" @click="downLoadBtn">下载</Button>
                            </div>
                        </Form>
                    </Row>
                </Card>
                <Card class="articleWrapper">
                    <Row class="searchable-table-con1">
                        <Table stripe border :loading="showLoading" :columns="columnsData" :data="resData"></Table>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                    </template>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import datePicker from '@/views/my-components/date-picker/date-picker';      //日期选择
    import {url, downloadingTools} from '@/mixins/mixin';
    import {rechargeInfoList, getMarketList} from '@/libs/api';
    export default {
        mixins: [downloadingTools],
        data(){
            return {
                params: {},
                totalCount: 0,             //总条数
                showLoading: false,
                resData: [],
                marketList: [],            //营销顾问列表
                columnsData: [  
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 80, 
                    },
                    {
                        key: 'credit_group',
                        title: '充值产品',
                        minWidth: 80, 
                    },
                    {
                        key: 'num',
                        title: '充值金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'remark',
                        title: '备注说明',
                        minWidth: 90, 
                    },
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 60, 
                    },
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 60, 
                    },
                    {
                        key: 'created_at',
                        title: '充值时间',
                        minWidth: 80, 
                    },
                    {
                        key: 'created_at',
                        title: '打款时间',
                        minWidth: 80, 
                    },
                    {
                        key: 'manager_name',
                        title: '充值人',
                        minWidth: 60, 
                    },
                ],
            }
        },
        created() {
            this.init();
            this.getHomologous();
        },
        methods: {
            //加载费用充值明细
            init(){
                this.showLoading = true;
                rechargeInfoList(this.params).then(res => {
                    this.showLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //加载营销顾问列表
            getHomologous(){
                getMarketList().then(res => {
                    if(res.code == 200){
                        this.marketList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //充值时间
            rechargeTime(date){
                this.params.recharge_start = date.createTimeStart;
                this.params.recharge_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //下载
            downLoadBtn(){
                var down = {export: 2};
                rechargeInfoList(Object.assign(this.params, down)).then(res => {
                    this.downLoadwj(url + 'api/v1/member/receipt/recharge-details?', this.params, res);
                });
            },

            //页码
            changeNum(page){
                this.params.page = page;
                this.init();
            },

            //每页条数
            changeSize(size){
                this.params.per_page = size;
                this.init();
            }
        },
        components: {
            datePicker
        }
    }
</script>
