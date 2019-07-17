<template>
    <div>
        <div v-if="!showPublish" class="custom_xiaohongshuPub">
            <Row :gutter="10">
                <Col>
                <Card>
                    <p slot="title">
                        小红薯定制发布
                    </p>
                    <Row :gutter="10"  style="margin-bottom:20px;" class="search">
                        <Col span="24">
                            <div class="searchWrapper">
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">小红薯名称:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Input @on-change="xiaohongshuPubList(1)" v-model="searchCondition.mediaName" placeholder="请输入需要查询的小红薯"></Input>
                                    </Col>
                                </Row>
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">常见分类:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Button btn-outlin-success size="small" shape="circle" v-for="(item,index) in typeList.pubType" @click.native="chooseLx(index,item.value)" :class="{lxColor:index==isSelect.lx}" :key="index">{{item.label}}</Button>
                                    </Col>
                                </Row>
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">地方资源:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Button btn-outlin-success size="small" shape="circle" v-for="(item,index) in typeList.region" @click.native="chooseDq(index,item.value)" :class="{dqColor:index==isSelect.dq}" :key="index">{{item.label}}</Button>
                                    </Col>
                                </Row>
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">图文价格:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Button size="small" shape="circle" v-for="(item,index) in typeList.articlePrice" @click.native="chooseJq(index,item.value)" :class="{jqColor:index==isSelect.jq}" :key="index">{{item.label}}</Button>
                                        <Input size="small" class="price" v-model="searchCondition.minPrice"></Input> - 
                                        <Input size="small" class="price" v-model="searchCondition.maxPrice"></Input>
                                    </Col>
                                </Row>
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">粉丝数量:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Button size="small" shape="circle" v-for="(item,index) in typeList.fans" @click.native="chooseFs(index,item.value)" :class="{jqColor:index==isSelect.fs}" :key="index">{{item.label}}</Button>
                                        <Input size="small" class="price" v-model="searchCondition.minFans"></Input> - 
                                        <Input size="small" class="price" v-model="searchCondition.maxFans"></Input>
                                    </Col>
                                </Row>
                                <Row class="searchList" v-if="!isAuth([2])">
                                    <Col :md="2" :sm="24"><span class="title">&nbsp;</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Button type="info" icon="md-arrow-round-down" @click="downLoadBtn">下载</Button>
                                        <Button type="info" icon="ios-search" @click="xiaohongshuPubList(1)">搜素</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card style="margin-top:10px;">
                    <Tabs @on-click="clickTab">
                        <TabPane label="全部" name="0"></TabPane>
                        <TabPane label="收藏" name="1"></TabPane>
                    </Tabs>
                    <Row>
                        <Col :md="24" :lg="12">
                            <Alert type="error" class="alert">
                                <p>可以一个定制信息下单多个</p>
                                <p>一次只能下单一个定制信息，不能批量下单多个不同定制信息</p>                                                            </p>
                            </Alert>
                        </Col>
                        <Col :md="24" :lg="12" class="customBtn">
                            <Button type="info" @click="customDemand=true">没有自己想要的定制发布需求，点击提交定制需求</Button>
                        </Col>
                    </Row>
                    <Row :gutter="10">
                        <Row class="margin-top-10 searchable-table-con1">
                            <Table ref="table" border :loading="loading" :columns="columnsData" :data="resData" @on-select="selectRow" @on-select-cancel="selectRow" @on-select-all="selectRow" @on-selection-change="selectRow"></Table>
                        </Row>
                        <template>
                            <Page :total="totalCount" :current="searchCondition.page" class="we-media-page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                        </template>
                    </Row>
                </Card>
                </Col>
            </Row>
            <pub-bottom-tag :mediaTagList="mediaTagList" :yu="yu" :amount="amount" type='custom' @closeTags="closeTag" @nextStep="nextStep"></pub-bottom-tag>
        </div>
        <!-- 下一步-> 小红薯媒体稿件添加 -->
        <custom-publish v-if="showPublish" @addDetails="showAddDetails" :tagList='cartData' :editMedia='editMedia' :yu="yu" :amount="amount"></custom-publish>
        <Spin size="large" fix v-if="spinShow"></Spin>

        <!-- 定制需求 -->
        <Modal
            v-model="customDemand"
            title="定制需求">
            <Form :label-width="90" class="userInfo">
                <FormItem label="定制需求">
                    <Input type="textarea" placeholder="请输入定制需求" v-model="demandParams.demand"></Input>
                </FormItem>
                <FormItem label="备注说明">
                    <Input type="text" placeholder="请输入备注" v-model="demandParams.remark"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="customDemand=false">取消</Button>
                <Button :loading="customLoading" type="primary" @click="custom_demand">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>    
    import customPublish from '@/views/my-components/article/custom-publish';   //稿件发布
    import {customInitCate, customPubList, collectArticle, addcustomDemand} from '@/libs/api';
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import pubBottomTag from '@/views/my-components/media/pub-bottom-tag/pub-bottom-tag';
    import { downloadingTools, userAuthority } from '@/mixins/mixin';
    let _this = '';
    let balance = 0;
    export default {
        mixins:[downloadingTools, userAuthority],
        data(){
            return {
                isSelect:{lx:0,dq:0,jq:0, fs: 0},  //类型下标
                yu:0,                              //余额
                amount:0,
                mediaTagList:[],                   //选中的媒体列表
                editMedia:[],
                articleId:'',                      //编辑要传id
                showPublish:false,
                spinShow:true,
                totalCount:0,
                loading:false,
                isLoading:false,
                typeList:{},
                columnsData: [
                    {
                        key: 'notes',
                        title: '加入购物车',
                        width: 140, 
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
                        key: 'mediaName',
                        title: '定制信息',
                        minWidth: 100, 
                    },
                    {
                        key: 'remarks',
                        title: '备注说明',
                        minWidth: 100, 
                    },
                    {title: '投放报价',key: 'dmhPrice',minWidth:100,},
                    {
                        title: '收藏',
                        key:'shou',
                        width:80,
                        render: (h, params) => {
                    		return h('a', {
                                on: {
                                    'click': () => {
                                        _this.collect(params.index);
                                    }
                                }
                            }, params.row.favorite? '取消' : '收藏')
                    	}
                    }
                ],
                resData:[],
                searchCondition:{ 
                    page:1,
                    per_page:10,
                },
                collects:{},             //收藏{type:type,mid:id}
                customDemand: false,     //定制需求modal
                demandParams: {},        //定制需求参数
                customLoading: false,    //定制需求按钮
                cartData: {},            //加入购物车的信息
           }
       },
       mounted(){
           _this = this;
           this.mediaInitCate();
           this.xiaohongshuPubList();
       },
       methods:{
            changeNum(page){
                this.searchCondition.page = page;
                this.xiaohongshuPubList();
            },
            changeSize(size){
                this.searchCondition.per_page = size;
                this.xiaohongshuPubList();
            },
            //初始化栏目 
            mediaInitCate(){
                customInitCate().then(res => {
                    this.spinShow = false;
                    var price = {price:[{value:'',label:'请选择'},{value:'1',label:'1-100'},{value:'4',label:'101-200'},{value:'5',label:'200以上'}]}
                    if(res.code == 200){
                        this.typeList = Object.assign(res.data,price);
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },
            
            //小红薯媒体列表
            xiaohongshuPubList(type){
                if(type) this.searchCondition.page = 1;
                this.loading = true;
                customPubList(this.searchCondition).then(res => {
                    this.loading = false;
                    if(res.code == 200){
                        this.yu = res.data.member_money;
                        balance = res.data.member_money;
                        this.totalCount = Number(res.data.totalCount);
                        this.resData = res.data.list;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            // 查找媒体 收藏媒体  tab切换
            clickTab(name){
                this.searchCondition.favorite = name;
                this.xiaohongshuPubList();
            },

            //下载
            downLoadBtn(){
                var down = { export: 2 };
                customPubList(Object.assign(this.searchCondition, down)).then(res => {
                    this.downLoadwj(util.siteUrl+'api/v1/publish/red-book/custom-list?', this.searchCondition, res);
                });
            },
            
            //选中媒体
            selectRow(selection,row,all){
                this.mediaTagList = selection;
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
                if(this.isAuth([2]) && this.yu < this.amount){
                    this.$Notice.warning({ title: '余额不足~' });
                    return 
                }else if(this.cartData && this.cartData.orderNum>0){
                    this.showPublish = true;
                }else{
                    this.$Notice.warning({
                        title: '请选择定制信息',
                    });
                }
            },

            //重新选择小红薯
            showAddDetails(data){
                this.showPublish = false;
            },

            //收藏
            collect(index){
                let _resData = this.resData[index];
                var data = {
                    id: _resData.id,
                    type: 1
                }
                collectArticle(data).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.xiaohongshuPubList();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            chooseLx(index,val){  
                this.isSelect.lx = index;
                this.searchCondition.pubType = val;
                this.xiaohongshuPubList(1);
            },
            chooseDq(index,val){
                this.isSelect.dq = index;
                this.searchCondition.region = val;
                this.xiaohongshuPubList(1);
            },
            chooseJq(index,val){
                this.isSelect.jq = index;
                this.searchCondition.articlePrice = val;
                this.xiaohongshuPubList(1);
            },
            chooseFs(index, val){
                this.isSelect.fs = index;
                this.searchCondition.fans = val;
                this.xiaohongshuPubList(1);
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
                })
                this.customAmount();
            },
            
            //计算余额 和 总计
            customAmount(){
                this.$nextTick(() => {
                    this.yu = balance;
                    this.amount = this.cartData.dmhPrice * this.cartData.orderNum;
                    this.yu = this.yu - this.amount;
                })
            },

            //提交定制需求
            custom_demand(){
                if(!this.demandParams.demand){
                    this.$Notice.warning({title: '请填写定制需求'});
                    return
                }
                this.customLoading = true;
                addcustomDemand(this.demandParams).then(res => {
                    this.customLoading = false;
                    if(res.code == 200){ 
                        this.customDemand = false;
                        this.$Notice.success({title: res.message});
                        this.demandParams = {};
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                })
            }
       },
       components:{
           pubBottomTag,
           customPublish
       }
    };
</script>
<style lang="less">
    .custom_xiaohongshuPub{
        .searchList{
            padding-bottom:10px;
            .price{
                width:100px;
            }
            button{
                margin:0 5px 5px 0;
            }
            .ptColor,.lxColor,.dqColor,.jqColor{
                background:#2baee9;
                color:#fff;
            }
        }
        .we-media-page{
            margin-top:20px;
            padding-bottom:20px;
        }
        .ivu-poptip-inner{
            max-width:500px;
        }
        .headWrap{
            display:flex;
            align-items:center;
            position: relative;
            .level{
                position: absolute;
                top:10px;
                left:0;
                width:15px;
                height:15px;
            }
        }
        .sex_1{
            display: inline-block;
            width:16px;
            height:16px;
            margin-left:5px;
            background: url(../../images/man.png);
        }
        .sex_2{
            display: inline-block;
            width:16px;
            height:16px;
            margin-left:5px;
            background: url(../../images/woman.png);
        }
        .alert{
            line-height: 24px;
        }
        .customBtn{
            text-align: right;
            vertical-align: bottom;
            button{
                margin:20px;
            }
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
    }
</style>