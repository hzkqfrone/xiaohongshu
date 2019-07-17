<template>
    <div class="manuscript">
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        用户列表
                    </p>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" inline>
                            <FormItem label="用户名称">
                                <Input v-model="params.username" placeholder="请输入用户名称" style="width: 200px" @on-change="search" />
                            </FormItem>
                            <FormItem label="行业">
                                <Input v-model="params.trade" placeholder="请输入行业" style="width: 200px" @on-change="search" />
                            </FormItem>
                            <FormItem label="所属营销顾问" v-if="isAuth([1,6])">
                                <Select v-model="params.market" filterable clearable @on-change="search" style="width: 200px">
                                    <Option v-for="(item, index) in marketList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="所属销售" v-if="isAuth([1,4])">
                                <Select v-model="params.sale" filterable clearable @on-change="search" style="width: 200px">
                                    <Option v-for="(item, index) in saleList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="角色" v-if="isAuth([1,4,6])">
                                <Select v-model="params.role" filterable clearable  @on-change="search" style="width: 200px">
                                    <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="合作产品">
                                <Select v-model="params.chain" clearable  @on-change="search" style="width: 200px">
                                    <Option v-if="item.value>-1" v-for="(item, index) in cooperationTypeData" :key="index" :value="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </Row>
                </Card>
                <Card class="articleWrapper">
                    <Row class="button_wrap">
                        <Button type="primary" icon="md-add" v-if="isAuth([1])" @click="addModal=true, addParams={}">添加用户</Button>
                        <div class="member_count">
                            <Tag type="border" color="#2c8df2">资源发布客户数量 {{chain[0]}}</Tag>
                            <Tag type="border" color="#2c8df2">搜索下拉客户数量 {{chain[1]}}</Tag>
                            <Tag type="border" color="#2c8df2">关键词客户数量 {{chain[2]}}</Tag>
                            <Tag type="border" color="#2c8df2">种草笔记客户数量 {{chain[3]}}</Tag>
                            <Tag type="border" color="#2c8df2">红薯霸屏王合作客户数量 {{chain[4]}}</Tag>
                        </div>
                    </Row>
                    <Row class="searchable-table-con1">
                        <show-table-head :loading="showLoading" :columns="columnsData" :data="resData"></show-table-head>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 添加 -->
        <Modal
            v-model="addModal"
            :mask-closable="false"
            title="添加">
            <Form :label-width="$store.state.app.isFromMobile?auto:130" :label-position="$store.state.app.isFromMobile?'top':'right'" :model="addParams" ref="addParams" :rules="rules" class="backLinkModal">
                <FormItem label="用户名称及为开户名" prop="username">
                    <Input v-model="addParams.username" placeholder="请输入用户名称"/>
                </FormItem>
                <FormItem label="姓名" prop="nickname">
                    <Input v-model="addParams.nickname" placeholder="请输入姓名"/>
                </FormItem>
                <FormItem label="密码" prop="password_hash">
                    <Input type="password" v-model="addParams.password_hash" placeholder="请输入密码"/>
                </FormItem>
                <FormItem label="电话">
                    <Input v-model="addParams.mobile" placeholder="请输入电话"/>
                </FormItem>
                <FormItem label="微信">
                    <Input v-model="addParams.wechat" placeholder="请输入微信"/>
                </FormItem>
                <FormItem label="QQ">
                    <Input v-model="addParams.qq" placeholder="请输入QQ"/>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="addParams.email" placeholder="请输入邮箱"/>
                </FormItem>
                <FormItem label="行业">
                    <Input v-model="addParams.trade" placeholder="请输入行业"/>
                </FormItem>
                <FormItem label="对应销售">
                    <Select v-model="addParams.sale" clearable>
                        <Option v-for="(item, index) in saleList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="对应营销顾问">
                    <Select v-model="addParams.market" clearable>
                        <Option v-for="(item, index) in marketList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择角色" prop="role">
                    <Select v-model="addParams.role" clearable>
                        <Option v-for="(item, index) in roleList" :key="index" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="addUserData">确定</Button>
            </div>
        </Modal>


        <!-- 上传 -->
        <Modal
            v-model="uploadModal"
            :mask-closable="false"
            title="上传资质">
            <Alert type="warning">请上传 医疗机构执业许可证、 医疗机构执业许可证副本、 营业执照</Alert>
            <upload-img :uid="uid" :imgUrl="imgUrl"></upload-img>
        </Modal>
   
    </div>
</template>
<script>
    import { getUserList, addUser, getRole, getMarketList, getSaleList, delUser, getUserInfo, getCooperationType } from '@/libs/api';
    import { beyondSize, userAuthority } from '@/mixins/mixin';
    import uploadImg from '@/views/management/components/upload_qualification';
    import showTableHead from '@/views/my-components/show-table-head/table';            //表格
    export default {
        mixins: [ beyondSize, userAuthority ],
        data(){
            return {
                params: {},
                addParams: {},
                addModal: false,                //添加用户modal
                showLoading: false,
                resData: [],
                chain: [],                      //合作产品客户数量
                totalCount: 0,                  //总条数
                imgUrl: [],                     //资质图
                columnsData: [  
                    {
                        key: 'username',
                        title: '用户名称',
                        minWidth: 80, 
                        show: true
                    },
                    {
                        key: 'trade',
                        title: '行业',
                        minWidth: 50, 
                        show: true
                    },
                    {
                        key: 'chain',
                        title: '合作产品',
                        minWidth: 60, 
                        show: true
                    },
                    {
                        key: '',
                        title: '资源发布总费用 / 余额',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.frozen_source),
                                h('p', {style: {color:'red'}}, params.row.source_money)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '搜索下拉总费用 / 余额',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.frozen_down),
                                h('p', {style: {color:'red'}}, params.row.down_money)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '关键词排名总费用 / 余额',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.frozen_case),
                                h('p', {style: {color:'red'}}, params.row.case_money)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '种草营销总费用 / 余额',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.frozen_seeding),
                                h('p', {style: {color:'red'}}, params.row.seeding_money)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '霸屏王',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.screen)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '总积分 / 余额',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {style: {color:'green'}}, params.row.frozen_integral),
                                h('p', {style: {color:'red'}}, params.row.integral)
                            ])
                        }
                    },
                    {
                        key: 'last_time',
                        title: '最后登陆日期',
                        minWidth: 60, 
                        show: true
                    },
                    {
                        key: 'role_name',
                        title: '角色',
                        minWidth: 50, 
                        show: true
                    },
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 50, 
                        show: true
                    },
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 50, 
                        show: true
                    },
                    {
                        key: '',
                        title: '资质上传',
                        minWidth: 80, 
                        show: true,
                        render: (h, params) => {
                            let arr = [];
                            if(params.row.attachment.length>0){
                                arr.push(
                                    h('p', '已上传'),
                                    h('p', [
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    this.uploadModal = true;
                                                    this.uid = params.row.id;
                                                    this.imgUrl = params.row.attachment;
                                                }
                                            }
                                        }, '预览')
                                    ])
                                )
                            }else{
                                arr.push(
                                    h('a', {
                                        style: {
                                            display:'inline-block',
                                            float:'left',
                                            marginRight: '8px',
                                        },
                                        on: {
                                            click: () => {
                                                this.uploadModal = true;
                                                this.uid = params.row.id;
                                                this.imgUrl = params.row.attachment;
                                            }
                                        }
                                    }, '未上传')
                                )
                            }
                            return h('div', arr);
                        }
                    },
                    {
                        key: '',
                        title: '操作',
                        minWidth: 120, 
                        show: this.isAuth([1, 5, 6]),
                        render: (h, params) => {
                            let arr = [];
                            arr.push(
                                h('Button', {
                                        props: {
                                            size: 'small',
                                            icon: 'md-create',
                                            type: 'primary'
                                        },
                                        style:{
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.row.id);
                                            }
                                        }
                                    }, '编辑')
                            )
                            if(this.isAuth([1])){
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除此用户吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.del(params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon:'md-trash',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            }
                            return h('div', arr);
                        }
                    },
                ],
                rules:{
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                    ],
                    password_hash: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    nickname: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    role: [
                        {required: true, type:'number', message: '请选择角色', trigger: 'change'}
                    ]
                },
                action: '',           //上传资质地址
                uploadData: {},       //上传参数
                roleList: [],         //角色列表
                btnLoading: false,    //添加按钮loading
                uploadModal: false,   //上传资质弹窗
                uploadList: [],       //图片
                saleList: [],         //销售列表
                marketList: [],       //营销顾问列表
                uid: '',
                cooperationTypeData: [],  //合作产品
            }
        },
        mounted() {
            this.init();
            this.getRoleLit();
            this.getHomologous();
            this.loadCooperationType();
        },
        methods: {
            //加载用户列表
            init(){
                getUserList(this.params).then(res => {
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.chain = res.data.chain;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //添加用户
            addUserData(){
                this.btnLoading = true;
                addUser(this.addParams).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.addModal = false;
                        this.init();
                        this.getHomologous();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({title: '服务器异常'});
                    this.btnLoading = false;
                })
            },

            //加载角色列表
            getRoleLit(){
                getRole().then(res => {
                    if(res.code == 200){
                        this.roleList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //获取营销顾问列表  销售列表
            getHomologous(){
                getMarketList().then(res => {
                    if(res.code == 200){
                        this.marketList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
                getSaleList().then(res => {
                    if(res.code == 200){
                        this.saleList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //搜索
            search(){
                this.params.page = 1;
                this.init();
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
            },

            //删除用户
            del(id){
                delUser(id).then(res => {
                    if(res.code == 200){
                        this.init();
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //编辑时 获取用户详情
            edit(id){
                getUserInfo(id).then(res => {
                    if(res.code == 200){
                        this.addModal = true;
                        this.addParams = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //加载合作类型
            loadCooperationType(){
                getCooperationType().then(res => {
                    if(res.code == 200){
                        this.cooperationTypeData = res.data.chain;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            }
        },
        components: {
            uploadImg,
            showTableHead
        }
    }
</script>
<style lang="less" scoped>
    .member_count{
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
    }
</style>
