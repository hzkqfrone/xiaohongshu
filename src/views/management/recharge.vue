<template>
    <div class="manuscript">
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        费用充值
                    </p>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="用户名">
                                <Input v-model="params.title" placeholder="请输入用户名" style="width: 200px" @on-change="init();params.page=1" />
                            </FormItem>
                        </Form>
                    </Row>
                </Card>
                <Card class="articleWrapper">
                    <Row class="searchable-table-con1">
                        <Table stripe border :loading="showLoading" :columns="columnsData" :data="resData"></Table>
                    </Row>
                    <template>
                        <Page :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 充值 -->
        <Modal
            v-model="rechargeModal"
            :mask-closable="false"
            title="充值">
            <Form :label-width="$store.state.app.isFromMobile?auto:120" :label-position="$store.state.app.isFromMobile?'top':'right'" class="backLinkModal" :model="reParams" ref="reParams" :rules="rules" >
                <FormItem label="充值资源发布">
                    <Input v-model="reParams.source_money" type="number"><span slot="append">元</span></Input>
                </FormItem>
                <FormItem label="充值搜索下拉">
                    <Input v-model="reParams.down_money" type="number"><span slot="append">元</span></Input>
                </FormItem>
                <FormItem label="充值关键词排名">
                    <Input v-model="reParams.case_money" type="number"><span slot="append">元</span></Input>
                </FormItem>
                <FormItem label="充值种草营销">
                    <Input v-model="reParams.seeding_money" type="number"><span slot="append">元</span></Input>
                </FormItem>
                <FormItem label="销售单据ID" prop="receipt_id">
                    <Input v-model="reParams.receipt_id" placeholder="请输入销售单据ID"/>
                </FormItem>
                <FormItem label="合同类型" prop="agreement_type">
                    <RadioGroup v-model="reParams.agreement_type">
                        <Radio :label="2">新签</Radio>
                        <Radio :label="1">续费</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注说明">
                    <Input type="textarea" v-model="reParams.remark" placeholder="请输入备注说明"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="rechargeModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="rechargeBtn">确定</Button>
            </div>
        </Modal>

        <!-- 充值明细 -->
        <Modal
            width="800"
            v-model="reLogModal"
            title="充值明细">
            <Table stripe border :loading="reLoading" :columns="reCol" :data="reInfoData"></Table>
            <div slot="footer">
                <Button @click="reLogModal=false">取消</Button>
                <Button type="primary" @click="reLogModal=false">确定</Button>
            </div>
        </Modal>
   
    </div>
</template>
<script>
    import {rechargeList, recharge, rechargeDetail} from '@/libs/api';
    export default {
        data(){
            return {
                params: {},
                reParams: {},
                rechargeModal: false,                 //充值modal
                reLogModal: false,                    //充值明细modal
                reLoading: false,                     //充值明细 loading
                showLoading: false,
                resData: [],
                credit_type: [],
                columnsData: [  
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 80, 
                    },
                    {
                        key: '',
                        title: '搜索下拉总费用',
                        minWidth: 60, 
                        render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props:{
                                        type: 'border'
                                    }
                                }, params.row.frozen_down),
                                h('a',{
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeRechargeInfo(Object.keys(this.credit_type)[0], params.row.id);
                                        }
                                    }
                                }, '充值明细')
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '资源发布总费用',
                        minWidth: 60, 
                        render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props:{
                                        type: 'border'
                                    }
                                }, params.row.frozen_source),
                                h('a',{
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeRechargeInfo(Object.keys(this.credit_type)[1], params.row.id);
                                        }
                                    }
                                }, '充值明细')
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '关键词排名总费用',
                        minWidth: 60, 
                        render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props:{
                                        type: 'border'
                                    }
                                }, params.row.frozen_case),
                                h('a',{
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeRechargeInfo(Object.keys(this.credit_type)[2], params.row.id);
                                        }
                                    }
                                }, '充值明细')
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '种草营销总费用',
                        minWidth: 60, 
                        render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props:{
                                        type: 'border'
                                    }
                                }, params.row.frozen_seeding),
                                h('a',{
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeRechargeInfo(Object.keys(this.credit_type)[3], params.row.id);
                                        }
                                    }
                                }, '充值明细')
                            ])
                        }
                    },
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 50, 
                    },
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 50, 
                    },
                    {
                        key: '',
                        title: '操作',
                        minWidth: 70, 
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'ios-card'
                                },
                                on: {
                                    click: () =>{
                                        this.reParams = {};
                                        this.rechargeModal = true;
                                    }
                                }
                            }, '充值')
                        }
                    },
                ],
                reData: [],
                reCol: [                    //充值明细
                    {
                        key: 'num',
                        title: '充值费用',
                        minWidth: 60, 
                    },
                    {
                        key: 'created_at',
                        title: '充值时间',
                        minWidth: 80, 
                    },
                    {
                        key: 'remark',
                        title: '备注',
                        minWidth: 80, 
                    },
                    {
                        key: 'manager_name',
                        title: '充值人',
                        minWidth: 60, 
                    },
                    {
                        key: 'old_num',
                        title: '充值前',
                        minWidth: 60, 
                    },
                    {
                        key: 'new_num',
                        title: '充值后',
                        minWidth: 60, 
                    },
                ],
                reInfoData: [],
                totalCount: 0,            //总条数
                rules:{
                    receipt_id: [
                        {required: true, message: '请输入销售单据ID', trigger: 'blur'},
                    ],
                    agreement_type: [
                        {required: true, type:'number', message: '请选择合同类型', trigger: 'change'},
                    ]
                },
                btnLoading: false,              //确定充值loading
            }
        },
        created() {
            this.init();
        },
        methods: {
            //加载用户列表
            init(){
                rechargeList(this.params).then(res => {
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.credit_type = res.data.credit_type;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //充值
            rechargeBtn(){
                this.$refs.reParams.validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        recharge(this.reParams).then(res => {
                            this.btnLoading = false;
                            if(res.code == 200){
                                this.$Notice.success({ title: res.message });
                                this.init();
                                this.rechargeModal = false;
                            }else{
                                this.$Notice.error({ title: res.message });
                            }
                        })
                    }
                })
            },

            //查看充值明细
            seeRechargeInfo(type, id){
                this.reLogModal = true;
                this.reLoading = true;
                let data = {
                    credit_group: type,
                    member_id: id
                }
                rechargeDetail(data).then(res => {
                    this.reLoading = false;
                    if(res.code == 200){
                        this.reInfoData = res.data;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
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
    }
</script>
