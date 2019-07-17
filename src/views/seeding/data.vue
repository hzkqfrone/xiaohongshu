<template>
    <div class="grass_wrap">
        <div v-if="!showPub">
            <Card>
                <p slot="title">
                    小红书种草营销数据
                </p>
                <div slot="extra" v-if="!isAuth([2])">
                    选择用户： 
                     <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="params.page=1;init();getOther()">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </div>
                <!-- 客户显示 -->
                <Row class="statistics" v-if="isAuth([2]) || params.member_id">
                    <Tag type="border" color="blue">您目前总费用是: {{otherData[0]}} 元 </Tag>
                    <Tag type="border" color="blue">已消费总费用: {{otherData[1]}} 元 </Tag>
                    <Tag type="border" color="blue">余额：{{otherData[2]}} 元 </Tag>
                    <Button type="info" size="small" @click="showConsumeLog()">查看消费明细</Button>
                    <span style="color:red" v-if="otherData[2]<1">暂无余额，请及时充值</span>
                </Row>
                <!-- 内部员工显示 -->
                <Row class="statistics" v-else>
                    <Tag type="border" color="blue">目前合作客户数量为：{{otherData[0]}}</Tag>
                </Row>
                <Row class="button_wrap">
                    <Button type="primary" icon="md-add" v-if="isAuth([1])" @click="addParams={}; addModal=true">添加套餐</Button>
                    <Button type="success" icon="logo-yen" v-if="isAuth([1,5,6])" @click="rechargeModal=true">充值套餐</Button>
                </Row>
                <Row class="searchable-table-con1">
                    <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
                </Row>
                <Row>
                    <Page :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin:20px 0"></Page>
                </Row>
                <Button class="footer-nextStep" type="primary" icon="ios-redo" @click="nextStep">下一步</Button>
            </Card>
        </div>

        <!-- 添加 -->
        <Modal
            v-model="addModal"
            transfer
            :mask-closable="false"
            :title="addParams.id?'编辑':'添加'">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="backLinkModal" :model="addParams" ref="addParams" :rules="rules">
                <FormItem label="套餐类型" prop="title">
                    <Input v-model="addParams.title" placeholder="请输入套餐类型"/>
                </FormItem>
                <FormItem label="套餐价格" prop="price">
                    <InputNumber v-model="addParams.price" :min="1" placeholder="请输入套餐价格"/>
                </FormItem>
                <FormItem label="写稿关联" prop="writer_id">
                    <Select clearable filterable v-model="addParams.writer_id">
                        <Option v-for="(item, index) in customList.writer" :key="index" :value="item.id">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="发布关联" prop="publish_id">
                    <Select clearable filterable v-model="addParams.publish_id">
                        <Option v-for="(item, index) in customList.publish" :key="index" :value="item.id">{{item.mediaName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="套餐说明">
                    <Input type="textarea" :row="3" v-model="addParams.remark" placeholder="请输入套餐说明"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addModal=false">取消</Button>
                <Button type="primary" :loading="addBtnLoading" @click="sureAddBtn">保存</Button>
            </div>
        </Modal>

        <!-- 充值套餐 -->
        <Modal
            transfer
            v-model="rechargeModal"
            title="充值套餐">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="backLinkModal">
                <FormItem label="选择用户">
                    <Select clearable filterable v-model="reParams.member_id" style="width:320px">
                        <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <div v-for="(item, index) in batchCombo" :key="index">
                    <FormItem label="选择套餐">
                        <Select clearable filterable @on-change="selectCombo(index)" v-model="batchCombo[index].combo_id" style="width:320px"> 
                            <Option v-for="(item, index) in comboList" :key="index" :value="item.id">{{item.title}}</Option>
                        </Select>
                        <Icon type="md-add-circle" class="add_combo" v-if="index==batchCombo.length-1" @click="addComboRow" />
                        <Icon type="md-remove-circle" class="del_combo" v-if="index!=0" @click="delComboRow(index)" />
                    </FormItem>
                    <FormItem label="充值数量">
                        <InputNumber @on-change="changeRechargeNum" v-model="batchCombo[index].num"/>
                    </FormItem>     
                </div>
                <FormItem label="总价格">
                    <div class="totalPrice">{{comboPrice}}</div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="rechargeModal=false">取消</Button>
                <Button type="primary" :loading="rechargeLoading" @click="rechargeComboBtn">保存</Button>
            </div>
        </Modal>

        <!-- 消费明细 -->
        <Modal
            width="800"
            v-model="consumeLogModal"
            title="消费明细"> 
            <Table stripe border :loading="consumLoading" :columns="consumeCol" :data="consumeData"></Table>
            <Page :total="consumeTotal" show-total @on-change="consumeChangeNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="consumeLogModal=false">取消</Button>
                <Button type="primary" @click="consumeLogModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 添加备注 showRemarks -->
        <Modal
            v-model="showRemarks"
            transfer
            :mask-closable="false"
            width="600"
            title="备注">
            <Form label-position="top">
                <FormItem label="备注" v-if="isAuth([1,5,6]) && params.member_id">
                    <Input placeholder="备注" v-model="remarkParams.note" style="width:350px"/>
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

        <!-- 客户数据 -->
        <Modal
            width="900"
            v-model="rechargeLogModal"
            title="客户数据"> 
            <Table stripe border :loading="reLogLoading" :columns="reLogConsume" :data="reLogData"></Table>
            <div slot="footer">
                <Button @click="rechargeLogModal=false">取消</Button>
                <Button type="primary" @click="rechargeLogModal=false">确定</Button>
            </div>
        </Modal>

        <grass-pub v-if="showPub" :tagList="cartData" @reselect="reselect"></grass-pub>

    </div>
</template>

<script>
    import { userAuthority, getUserList } from '@/mixins/mixin';
    import pubBottomTag from '@/views/my-components/media/pub-bottom-tag/pub-bottom-tag';
    import grassPub from '@/views/seeding/components/pub';
    import {addSeeding, getSeedingList, packageList, seedingRecharge, comboCustomList, seedingOther, seedingConsumeLog,
            comboRemark, comboRemarkLog, comboConsumeLog} from '@/libs/api';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    let balance = 0;
    export default {
        mixins: [userAuthority, getUserList],
        data(){
            return{
                otherData: [],          //费用列表
                addParams: {},          //添加参数
                totalCount: 0,
                params: {},
                addModal: false, 
                addBtnLoading: false,   //添加保存按钮loading
                tabLoading: false,      //表格loading
                comboList: [],          //套餐列表
                comboIndex: -1,         //选择套餐 下标
                reParams: {},           //充值套餐 参数
                comboPrice: 0,          //充值套餐 总价格
                batchCombo: [{}],       //批量充值套餐
                comboPriceArr: [], 
                customList: [],         //发布关联
                showRemarks: false,     //备注 modal
                remarkParams: {},       //备注参数
                remarkLogData: [],      //备注日志
                columnsData: [
                    {
                        key: 'id',
                        title: '操作',
                        width: 60,
                        show: this.isAuth([1]),
                        render: (h,params) => {
                            let arr = [];
                            arr.push(
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on:{
                                        click: () => {
                                            let data = params.row;
                                            this.addParams = {
                                                'id': data.id,
                                                'title': data.title,
                                                'price': data.price,
                                                'writer_id': data.writer_id,
                                                'publish_id': data.publish_id,
                                                'remark': data.remark
                                            }
                                            this.addModal = true;
                                        }
                                    }
                                }, '编辑')
                            )
                            return h('div', arr)
                        } 
                    },
                    {
                        key: 'notes',
                        title: '加入购物车',
                        width: 140, 
                        show: true,
                        render: (h, params) =>{
                            this.resData[params.index].orderNum = this.resData[params.index].orderNum ? this.resData[params.index].orderNum : 0;
                            return h('div',{
                                attrs:{
                                    class: 'cart'
                                }
                            },[
                                h('Button',{
                                    props:{
                                        icon: 'md-remove',
                                        size: 'small'
                                    },
                                    on:{
                                        click: () => {
                                            if(this.resData[params.index].orderNum >= 1){
                                                this.resData[params.index].orderNum -= 1;
                                                this.$set(this.resData, params.index, this.resData[params.index]);
                                                this.cartLimit(params.index);
                                            }
                                        }
                                    }
                                }),
                                h('Input',{
                                    props:{
                                        value: this.resData[params.index].orderNum || 0,
                                        size: 'small'
                                    },
                                    on: {
                                    'on-change': (value) => {
                                        if(value.target.value>params.row.num){
                                            this.$nextTick(() =>{
                                                let data = this.resData[params.index];
                                                data.orderNum = 4
                                                this.$set(this.resData, params.index, data);
                                            })
                                        }
                                        this.cartLimit(params.index);
                                        this.resData[params.index].orderNum = Number(value.target.value);
                                        this.$set(this.resData, params.index, this.resData[params.index]);
                                    }
                                }
                                }),
                                h('Button',{  
                                    props:{
                                        icon: 'md-add',
                                        size: 'small'
                                    },
                                    on:{
                                        click: () => {
                                            if(this.resData[params.index].orderNum==params.row.num){
                                                return
                                            }else if(this.resData[params.index].orderNum>params.row.num){
                                                this.resData[params.index].orderNum = params.row.num;
                                            }
                                            this.cartLimit(params.index);
                                            this.resData[params.index].orderNum += 1;
                                            this.$set(this.resData, params.index, this.resData[params.index]);
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        key: 'title',
                        title: '订单类型',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: 'price',
                        title: '订单价格',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'remark',
                        title: '类型说明',
                        minWidth: 120, 
                        show: true,
                    },
                    {
                        key: 'frozen_num',
                        title: '总数量',
                        minWidth: 60, 
                        show: true,
                        render: (h, params) => {
                            if(!this.isAuth([2]) && !this.params.member_id){
                                return h('a', {
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    on:{
                                        click: ()=> {
                                            this.getComboConsumeLog(params.row.id);
                                        }
                                    }
                                }, params.row.frozen_num)
                            }else{
                                return h('div', params.row.frozen_num);
                            }
                        }
                    },
                    {
                        key: 'wait_num',
                        title: '未发布',
                        minWidth: 60, 
                        tag: '1',
                        show: this.isAuth([2])
                    },
                    {
                        key: 'accumulate_num',
                        title: '已发布',
                        minWidth: 60, 
                        show: true
                    },
                    {
                        key: 'ing_num',
                        title: '发布中',
                        minWidth: 60, 
                        tag: '1',
                        show: this.isAuth([2])
                    },
                    {
                        key: 'back_num',
                        title: '失败',
                        minWidth: 60, 
                        tag: '1',
                        show: this.isAuth([2])
                    },
                    {
                        key: 'done_num',
                        title: ' 发布成功',
                        minWidth: 60, 
                        tag: '1',
                        show: this.isAuth([2])
                    },
                    {
                        key: 'num',
                        title: '剩余数量',
                        minWidth: 60, 
                        show: true,
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
                                        this.remarkParams = {
                                            member_id: this.params.member_id,
                                            id: params.row.id
                                        }
                                        this.remarkLog(params.row.id);
                                    }
                                }
                            }, params.row.note || '暂无备注~')
                        }
                    },
                ],
                resData: [],
                rechargeModal: false,      //充值套餐
                rechargeLoading: false,    //充值loading
                consumeLogModal: false,    //消费明细
                consumLoading: false,
                consumeTotal: 0,
                consumeData: [],
                consumeCol: [
                    {
                        key: 'old_num',
                        title: '消费前余额',
                        minWidth: 60, 
                    },
                    {
                        key: 'new_num',
                        title: '消费后余额',
                        minWidth: 60, 
                    },
                    {
                        key: 'num',
                        title: '消费金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'created_at',
                        title: '消费时间',
                        minWidth: 80, 
                    },
                    {
                        key: 'remark',
                        title: '详情',
                        minWidth: 60, 
                    },
                ], 
                cartData: [],             //加入购物车的数据
                yu: 0,                    //余额
                amount: null,             //总费用
                mediaTagList:[],          //选中的媒体列表
                showPub: false,           //显示下一步
                rules: {
                    title: [
                        {required: true, message: '请输入套餐类型', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, type: 'number', message: '请输入套餐价格', trigger: 'blur'},
                    ],
                    writer_id: [
                        {required: true, type: 'number', message: '请选择写稿关联', trigger: 'change'},
                    ],
                    publish_id: [
                        {required: true, type: 'number', message: '请选择发布关联', trigger: 'change'},
                    ],
                },
                rechargeLogModal: false,     //充值明细 每个客户数据 modal
                reLogLoading: false,
                reLogData: [],               //充值明细 数据
                reLogConsume: [
                    {
                        key: 'member_name',
                        title: '客户名称',
                        minWidth: 60, 
                    },
                    {
                        key: 'frozen_num',
                        title: '总量',
                        minWidth: 60, 
                    },
                    {
                        key: 'wait_num',
                        title: '未发布',
                        minWidth: 60, 
                    },
                    {
                        key: 'ing_num',
                        title: '发布中',
                        minWidth: 60, 
                    },
                    {
                        key: 'done_num',
                        title: '已发成功量',
                        minWidth: 60, 
                    },
                    {
                        key: 'num',
                        title: '剩余量',
                        minWidth: 60, 
                    },
                    {
                        key: 'back_num',
                        title: '失败',
                        minWidth: 60, 
                    },
                ],
            }
        },
        mounted(){
            this.init();
            this.getOther();
            if(!this.isAuth([2])){
                this.loadUserList();
                this.getSeedingUserList();
                this.getPackageList();
                this.getCustomList();
            }
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                this.handleClient();
                getSeedingList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                        this.yu = res.data.member_money;
                        balance = res.data.member_money;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },


            //查看消费明细
            showConsumeLog(page){
                this.consumeLogModal = true;
                this.consumLoading = true;
                let data = {
                    page: page
                };
                if(this.params.member_id){
                    data.member_id = this.params.member_id;
                }
                seedingConsumeLog(data).then(res =>{
                    this.consumLoading = false;
                    if(res.code == 200){
                        this.consumeData = res.data.list;
                        this.consumeTotal = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //保存添加
            sureAddBtn(){
                this.$refs.addParams.validate((valid) => {
                    if (valid) {
                        this.addBtnLoading = true;
                        addSeeding(this.addParams).then(res => {
                            this.addBtnLoading = false;
                            if(res.code == 200){
                                this.$Notice.success({title: res.message});
                                this.init();
                                this.getPackageList();
                                this.addModal = false;
                            }else{
                                this.$Notice.error({title: res.message});
                            }
                        }).catch(error => {
                            thia.addBtnLoading = false;
                            this.$Notice.error({title: '服务器异常,请稍后再试'});
                        })
                    }
                })
            },

            //closeTag 关闭选中标签
            closeTag(id,mediaTagList){
                for(var j = 0;j < this.resData.length;j++){
                    let r_lth = this.resData[j];
                    if(r_lth.id == id){
                        this.$refs.table.objData[j]._isChecked=false;
                    }
                }
            },

            //下一步
            nextStep(){
                if(this.isAuth([1,5,6]) && !this.params.member_id){
                    this.$Notice.warning({
                        title: '请先选择用户~',
                    });
                    return
                }else if(!this.cartData || this.cartData.orderNum==0){
                    this.$Notice.warning({
                        title: '当前购物车为空~',
                    });
                    return
                }else{
                    this.showPub = true;
                }
            },

            //重新选择
            reselect(type){
                this.showPub = false;
                if(type){
                    //发布成功
                    this.init();
                }
            },

            //购物车限制  一次只能下单一个定制信息
            cartLimit(index){
                this.resData.forEach((v, i) => {
                    if(i != index && v.orderNum != 0){
                        let data = this.resData[i];
                        data.orderNum = 0;
                        this.$set(this.resData, i, data);
                        this.cartData = data;
                    }
                    this.cartData = this.resData[index];
                    if(this.params.member_id) this.cartData.member_id = this.params.member_id;
                })
            },

            //获取选择套餐列表
            getPackageList(){
                packageList().then(res => {
                    if(res.code == 200){
                        this.comboList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //选择套餐列表
            selectCombo(Index){
                if(!this.batchCombo[Index].combo_id){
                    this.comboPriceArr[Index] = '';
                }else{
                    this.comboList.forEach((v) => {
                        if(v.id == this.batchCombo[Index].combo_id) {
                            this.comboPriceArr[Index] = v.price;
                        }
                    })
                }
                this.totalPrice();
            },

            //选择套餐 充值数量
            changeRechargeNum(){
                this.totalPrice();
            },

            //充值套餐
            rechargeComboBtn(){
                if(!this.reParams.member_id){
                    this.$Notice.warning({title: '请选择用户'});
                    return 
                }
                let handle = true;
                this.batchCombo.forEach(v => {
                    if(!v.combo_id){
                        handle = false;
                    }
                    if(!v.num) v.num = 1;
                })
                if(!handle){
                    this.$Notice.warning({title: '请选择套餐'});
                    return
                }
                this.reParams.combos = this.batchCombo;
                this.rechargeLoading = true;
                seedingRecharge(this.reParams).then(res => {
                    this.rechargeLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.rechargeModal = false;
                        this.init();
                        this.reParams = {};
                        this.batchCombo =[{}];
                        this.comboPrice = 0;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //计算总价格
            totalPrice(){
                this.comboPrice = 0;
                this.comboPriceArr.forEach((v, index) => {
                    if(v && this.batchCombo[index]){
                        this.comboPrice = this.comboPrice +  v * (this.batchCombo[index].num? this.batchCombo[index].num: 1);
                    }
                })
            },

            //获取发布关联
            getCustomList(){
                comboCustomList().then(res => {
                    if(res.code == 200){
                        this.customList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            // 总消费
            getOther(){
                let data = {};
                if(this.params.member_id){
                    data.member_id = this.params.member_id;
                }
                seedingOther(data).then(res => {
                    if(res.code == 200){
                        this.otherData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //批量 充值套餐
            addComboRow(){
                this.batchCombo.push({});
            },

            //充值套餐 - 删除
            delComboRow(index){
                this.batchCombo.splice(index, 1);
                this.totalPrice();
            },

            //消费明细分页
            consumeChangeNum(page){
                this.showConsumeLog(page);
            },

            //查看备注日志
            remarkLog(){      
                comboRemarkLog(this.remarkParams).then(res => {
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
                if(!this.remarkParams.note){
                    this.showRemarks = false;
                    return
                }
                comboRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
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
            },

            //客户角色 或者 选择用户时 显示 未发布 发布中 发布成功  不可点击总量
            handleClient(){
                this.columnsData.forEach((v) =>{
                    if(v.tag){
                        if(this.params.member_id || this.isAuth([2])){
                            v.show = true;
                        }else{
                            v.show = false;
                        }
                    }
                    if(v.key == "accumulate_num"){
                        if(this.params.member_id || this.isAuth([2])){
                            v.show = false;
                        }else{
                            v.show = true;
                        }
                    }
                })
            },

            //点击总数量  查看此套餐 用户消费详情
            getComboConsumeLog(id){
                this.rechargeLogModal = true;
                this.reLogLoading = true;
                comboConsumeLog({combo_id: id}).then(res => {
                    this.reLogLoading = false;
                    if(res.code == 200){
                        this.reLogData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            }

        },
        components:{
            pubBottomTag,
            grassPub,
            showTableHead
        }
    }
</script>
<style lang="less" scoped>
    .totalPrice{
        line-height: 30px;
    }
</style>

<style lang="less">
    .grass_wrap{
        .statistics{
            margin-bottom: 10px;
        }
        .cart{
            button,.ivu-input-wrapper{
                float:left;
                border-radius:0;
            }
            .ivu-input-wrapper{
                width:60px;
                input{
                    border-radius:0;
                    text-align: center;
                }
            }
        }
        .footer-nextStep{
            display: block;
        }
    }
    .add_combo{
        font-size:24px;
        cursor: pointer;
        color:mediumseagreen;
    }
    .del_combo{
        font-size:24px;
        cursor: pointer;
        color:rgb(250, 26, 75);  
    }
    .ivu-timeline-item-content{
        line-height: 18px;
    }
</style>
