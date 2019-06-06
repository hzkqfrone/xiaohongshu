<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    消息管理
                </p>
                <Row>
                    <Button type="success" @click="modalShow = true;form = {};"><Icon type="md-add"></Icon> 添加</Button>
                </Row>
                <Modal
                    v-model="modalShow"
                    title="添加"
                    :mask-closable="false"
                    :loading="loading">
                    <Form :label-width="$store.state.app.isFromMobile?0:80" :label-position="$store.state.app.isFromMobile?'top':'right'" ref="params" :model="params" :rules="rules">
                        <FormItem label="类型:" prop="type" required>
                            <RadioGroup v-model="params.type">
                                <Radio v-for="(item, index) in typeList" v-if="item.value>0" :key="index" :label="item.value" :value="item.value">{{item.label}}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="接收角色:">
                            <CheckboxGroup v-model="params.target_id">
                                <Checkbox v-for="(item,index) in roleList" :label="item.id" :key="index">{{item.name}}</Checkbox>
                                <div class="moreSelect_c small" style="color: #f2a654;">可多选，不选择则是全部接收</div>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="小窗口提示:">
                            <Checkbox v-model="params.is_alert" :true-value="1">是</Checkbox>
                        </FormItem>
                        <FormItem label="标题:" prop="title" required>
                            <Input v-model="params.title" placeholder="" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="内容:" prop="content" required>
                            <Input v-model="params.content" type="textarea" placeholder="" style="width: 300px"/>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="modalShow=false;init();">取消</Button>
                        <Button type="primary" @click="asyncOK()">确定</Button>
                    </div>
                </Modal>

                <Row class="margin-top-10 searchable-table-con1">
                    <Table border :loading="showLoading" :columns="columnsData" :data="resData"></Table>
                </Row>

                <template>
                    <Page :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                </template>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {getNotice, addNotice, delNotice, getRole, getNoticeTypeList} from '@/libs/api';
    export default {
        name: 'searchable-table',
        data () {
            return {
                modalShow: false,
                loading: true,
                roleList:[],
                params:{},
                columnsData: [
                    {
                        key: 'id',
                        title: 'ID',
                        minWidth: 50,
                    },
                    {
                        key: 'title',
                        title: '标题',
                        minWidth: 100
                    },
                    {
                        key: 'type',
                        title: '类型',
                        minWidth: 100
                    },
                    {   title: '内容',
                        key: 'content',
                        minWidth: 100,
                        render: (h, params) => {
                            if(params.row.content){
                                return h('Poptip', {
                                    props: {
                                        trigger: 'hover',
                                        title: '',
                                        placement: 'bottom'
                                    },
                                }, [
                                    h('Tag', params.row.content),
                                    h('div', {
                                        slot: 'content',
                                        style: {
                                            whiteSapce:'normal'   
                                        }
                                    },params.row.content )
                                ]);
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        key: 'is_alert',
                        title: '小窗口提示',
                        minWidth: 50,
                    },
                    {
                        title: '创建人',
                        key: 'sender_name',
                        minWidth: 80
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        minWidth: 80
                    }
                ],
                rules:{
                    type: [
                        {required: true, type:'number', message: '请选择消息类型', trigger: 'change'},
                    ],
                    title: [
                        {required: true, message: '标题不能为空', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '内容不能为空', trigger: 'blur'},
                    ],
                },
                resData:[],
                totalCount: 0,
                addRole: false,  //添加
                showLoading: false,
                typeList: [],    //消息类型列表
            }; 
        },
        methods: {
            init () {
                this.showLoading = true;
                getNotice(this.params).then(res => {
                    this.showLoading = false;
                    if (res.code == 200) {
                        this.resData = res.data.list;
                        this.totalCount = Number(res.data.totalCount);
                    } else {
                        this.$Notice.error({title:res.data.message});
                    }
                });
            },

            //改变页数
            changeNum (page){
                this.params.page = page;
                this.init();
            },

            //改变显示数
            changeSize (size){
                this.params.per_page = size;
                this.init();
            },

            //提交
            asyncOK () {
                this.$refs.params.validate((valid) => {
                    if (valid) {
                        addNotice(this.params).then(res => {
                            this.loading = false;
                            if (res.code == 200){
                                this.$Notice.success({title: res.message});
                                this.modalShow = false;
                                this.init();
                                this.params = {};
                            }else{
                                this.$Notice.error({ title: res.message});
                            }
                        });
                    }
                })
            },

            //加载消息类型列表
            geyTypeList(){
                getNoticeTypeList().then(res => {
                    if(res.code == 200){
                        this.typeList = res.data.type;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            }

        },
        mounted () {
            this.init();
            this.geyTypeList();
            //获取角色列表
            getRole().then(res => {
                if (res.code == 200) {
                    this.roleList = res.data;
                } else {
                    this.$Notice.error({title:res.message});
                }
            });

        },
    };
</script>
<style lang="less">
    .ivu-page{
        margin-top:20px;
    }
    .ivu-poptip-inner{
        max-width:600px;
        white-space: normal;
    }
</style>