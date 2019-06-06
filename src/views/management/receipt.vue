<template>
    <div class="manuscript">
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        审核通过的销售单据
                    </p>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="用户">
                                <Input v-model="params.title" placeholder="请输入用户" style="width: 200px" @on-change="init();params.page=1;"/>
                            </FormItem>
                            <FormItem label="充值时间">
                                <date-picker @changeTime="rechargeTime"></date-picker>
                            </FormItem>
                            <FormItem label="处理状态">
                                <Select v-model="params.status" clearable style="width:200px" @on-change="init();params.page=1;">
                                    <Option :value="0">未处理</Option>
                                    <Option :value="1">已处理</Option>
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
                        <div class="button_wrap">
                            <Button type="error" icon="md-close" @click="audit">审核不通过</Button>
                            <Button type="success" icon="ios-card-outline" @click="personRecharge">人工充值</Button>
                            <Button type="info" icon="ios-card-outline" @click="recharge">自动充值</Button>
                        </div>
                        <Table stripe border :loading="showLoading" :columns="columnsData" :data="resData" @on-selection-change="selection"></Table>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 人工充值 备注 -->
        <Modal
            v-model="remarkModal"
            title="备注">
            <Input type="textarea" :rows="4" placeholder="备注" v-model="remark"/>
            <div slot="footer">
                <Button @click="remarkModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="artificialReceipt">确定</Button>
            </div>
        </Modal>

        <!-- 自动充值 显示账号密码 -->
        <Modal
            v-model="userInfoModal"
            title="自动充值">
            <Form :label-width="$store.state.app.isFromMobile?auto:60" :label-position="$store.state.app.isFromMobile?'top':'right'">
                <FormItem label="账号">
                    {{rechargeUser.username}}
                </FormItem>
                <FormItem label="密码">
                    {{rechargeUser.password_hash}}
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="userInfoModal=false">取消</Button>
                <Button type="primary" @click="userInfoModal=false">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import datePicker from '@/views/my-components/date-picker/date-picker';      //日期选择
    import {getReceiptList, autoRecharge, handelRecharge, receiptAudit} from '@/libs/api';
    import {url, downloadingTools} from '@/mixins/mixin';
    export default {
        mixins: [downloadingTools],
        data(){
            return {
                params: {},
                totalCount: 0,             //总条数
                showLoading: false,
                resData: [],
                columnsData: [  
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: 'title',
                        title: '客户名称',
                        minWidth: 80, 
                    },
                    {
                        key: 'id',
                        title: '销售单据',
                        minWidth: 80, 
                    },
                    {
                        key: 'type',
                        title: '合作产品',
                        minWidth: 60, 
                    },
                    {
                        key: 'agreementType',
                        title: '合同类型',
                        minWidth: 90, 
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: params.row.agreementType == '新签'?'green':'red'
                                }
                            }, params.row.agreementType)
                        },
                    },
                    {
                        key: 'money',
                        title: '到账金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'newRealMoney',
                        title: '实收金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'recharge_money',
                        title: '充值金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'zengSongMoney',
                        title: '赠送金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'username',
                        title: '销售',
                        minWidth: 60, 
                    },
                    {
                        key: 'dealDate',
                        title: '处理时间',
                        minWidth: 60, 
                    },
                    {
                        key: 'deal',
                        title: '是否处理',
                        minWidth: 60, 
                    },
                    {
                        key: 'rebateMoney',
                        title: '咨询费',
                        minWidth: 60, 
                    },
                    {
                        key: 'toDate',
                        title: '打款时间',
                        minWidth: 60, 
                    },
                ],
                remarkModal: false,              //人工充值  备注弹窗
                remark: '',                      //备注
                ids: [],                         //选中的列表id
                btnLoading: false,               
                rechargeUser: {},
                userInfoModal: false,            //自动充值后  显示账号密码
            }
        },

        created() {
            this.init();
        },

        methods: {
            //加载单据列表
            init(){
                this.showLoading = true;
                getReceiptList(this.params).then(res => {
                    this.showLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
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
                getReceiptList(Object.assign(this.params, down)).then(res => {
                    this.downLoadwj(url + 'api/v1/member/receipt?', this.params, res);
                });
            },

            //页码
            changeNum(page) {
                this.params.page = page;
                this.init();
            },

            //每页条数
            changeSize(size){
                this.params.per_page = size;
                this.init();
            },

            //表格多选
            selection(data){
                this.ids = [];
                data.forEach(v => {
                    this.ids.push(v.id);
                });
            },

            //批量审核不通过
            audit(){
                if(this.ids.length == 0){
                    this.$Notice.warning({title: '请勾选要操作行的复选框!'});
                    return 
                }
                this.$Modal.confirm({
                    title: '确定审核不通过吗?',
                    onOk: () => {
                        receiptAudit({receipts: this.ids}).then(res => {
                            if(res.code == 200){
                                this.$Notice.success({title: res.message});
                                this.init();
                            }else{
                                this.$Notice.warning({title: res.message});
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
                
            },

            //显示人工充值弹窗
            personRecharge(){
                if(this.ids.length == 0){
                    this.$Notice.warning({title: '请勾选要操作行的复选框!'});
                    return 
                } else if(this.ids.length > 1){
                    this.$Notice.warning({title: '请选择一个复选框!'});
                    return 
                }
                this.remarkModal = true;
            },

            //确定人工充值
            artificialReceipt(){
                let data = {
                    remark: this.remark,
                    receipt_id: this.ids[0]
                }
                this.btnLoading = true;
                handelRecharge(data).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.remarkModal = false;
                        this.init();
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                })
            },

            //自动充值
            recharge(){
                if(this.ids.length == 0){
                    this.$Notice.warning({title: '请勾选要操作行的复选框!'});
                    return 
                } else if(this.ids.length > 1){
                    this.$Notice.warning({title: '请选择一个复选框!'});
                    return 
                } 
                this.$Modal.confirm({
                    title: '确定自动充值吗',
                    onOk: () => {
                        autoRecharge({receipt_id: this.ids[0]}).then(res => {
                            if(res.code == 200){
                                this.init();
                                if(res.data){
                                    this.rechargeUser = res.data;
                                    this.userInfoModal = true;
                                }else{
                                    this.$Notice.success({title: res.message});
                                }
                            }else{
                                this.$Notice.error({title: res.message});
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
            }
        },
        components:{
            datePicker
        }
    }
</script>
