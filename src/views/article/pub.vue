<template>
    <div>
        <div v-if="!showPublish" class="xiaohongshuPub">
            <Row :gutter="10">
                <Col>
                <Card>
                    <p slot="title">
                        选号发布
                    </p>
                    <Row :gutter="10"  style="margin-bottom:20px;" class="search">
                        <Col span="24">
                            <div class="searchWrapper">
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">小红薯名称:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Input @on-change="xiaohongshuPubList(1)" clearable v-model="searchCondition.mediaName" placeholder="请输入需要查询的小红薯"></Input>
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
                                <Row class="searchList">
                                    <Col :md="2" :sm="24"><span class="title">其他筛选:</span></Col>
                                    <Col :md="22" :sm="24">
                                        <Form :label-width="$store.state.app.isFromMobile?auto:60" inline :label-position="$store.state.app.isFromMobile?'top':'right'">
                                            <Form-item label="粉丝性别">
                                                <Select v-model="searchCondition.gender " clearable style="width:200px" @on-change="xiaohongshuPubList(1)">
                                                    <Option v-for="(item, index) in typeList.gender" v-if="item.value>0" :key="index" :value="item.value">{{item.label}}</Option>
                                                </Select>
                                            </Form-item>
                                            <Form-item label="等级">
                                                <Select v-model="searchCondition.grade" clearable style="width:200px" @on-change="xiaohongshuPubList(1)">
                                                    <Option v-for="(item, index) in typeList.grade" v-if="item.value>0" :key="index" :value="item.value">{{item.label}}</Option>
                                                </Select>
                                            </Form-item>
                                            <Form-item label="价格更新">
                                                <Select v-model="searchCondition.priceUpdateTime" clearable style="width:200px" @on-change="xiaohongshuPubList(1)">
                                                    <Option v-for="(item, index) in typeList.priceUpdateTime " v-if="item.value>0" :key="index" :value="item.value">{{item.label}}</Option>
                                                </Select>
                                            </Form-item>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row class="searchList" v-if="!isAuth([2])">
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
                        <TabPane label="查找媒体" name="0"></TabPane>
                        <TabPane label="收藏媒体" name="1"></TabPane>
                    </Tabs>
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
            <pub-bottom-tag :mediaTagList="mediaTagList" :yu="yu" :amount="amount" type='wb' @closeTags="closeTag" @nextStep="nextStep"></pub-bottom-tag>
        </div>
        <!-- 下一步-> 小红薯媒体稿件添加 -->
        <xiaohognshu-publish v-if="showPublish" @addDetails="showAddDetails" :tagList='mediaTagList' :yu="yu" :amount="amount" :editId="articleId"></xiaohognshu-publish>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>    
    import {xiaohonghsuInitCate, xiaohongshuMediaInfo, collectArticle, editGetArticle} from '@/libs/api';
    import { downloadingTools, userAuthority } from '@/mixins/mixin';
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import pubBottomTag from '@/views/my-components/media/pub-bottom-tag/pub-bottom-tag';
    import xiaohognshuPublish from '@/views/my-components/article/publish';   //稿件发布
    let balance = 0;
    export default {
        mixins:[downloadingTools, userAuthority],
        data(){
            return {
                isSelect: {lx:0,dq:0,jq:0, fs: 0},  //类型下标
                yu: 0,      //余额
                amount: 0,
                mediaTagList: [],  //选中的媒体列表
                articleId: '',  //编辑要传id
                showPublish: false,
                spinShow: true,
                totalCount: 0,
                loading: false,
                typeList: {},
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '媒体信息',
                        key: 'mediaName',
                        width: 280,
                        show: true,
                        render:function(h,params){
                            var leavel =  '',     //等级
                                region = '',      //地区
                                gender = '',      //性别
                                qianming = '';    //签名
                            if(params.row.gradeImg) leavel = h('img',{
                                attrs:{
                                    src: params.row.gradeImg,
                                    class: 'level'
                                }
                            })
                            if(params.row.region) region = h('Tag', params.row.region)
                            if(params.row.gender) gender = h('i',{
                                        attrs:{
                                            class: `sex_${params.row.gender}`
                                        }
                                    })
                            if(params.row.qianming) qianming = h('p', {
                                    style:{
                                        color:'#bdbdbd'
                                    }
                                }, params.row.qianming)

                            return h('div',{
                                attrs:{
                                    href:params.row.url,
                                    target:'_blank',
                                    class: 'headWrap'
                                }
                            },[
                                leavel,
                                h('img',{
                                    attrs:{
                                        src: params.row.touxiang
                                    },
                                    style:{
                                        width:'80px',
                                        height:'80px',
                                        flexShrink:'0',
                                        borderRadius:'50%',
                                        margin:'10px 0'
                                    }
                                }),
                                h('div',{
                                    style:{
                                        marginLeft:'5px'
                                    }
                                },[
                                    h('div',[
                                        h('a',{
                                            attrs:{
                                                href:params.row.userLink,
                                                target:'_blank'
                                            },
                                            style:{
                                                color: '#333',
                                                fontSize: '14px'
                                            }
                                        },params.row.mediaName),
                                        gender
                                    ]),
                                    region,
                                    qianming,
                                    h('a',{
                                        attrs:{
                                            href: params.row.url,
                                            target: '_blank'
                                        },
                                        style:{
                                            display: 'block'
                                        }
                                    },'主页地址')
                                ]),
                            ])
                        }
                    },
                    {title: '相关数据',key: 'fansNum',minWidth:130,
                        render: (h,params) => {
                            return h('div',[
                                h('p',`粉丝数: ${params.row.fansNum}`),
                                h('p',`笔记数: ${params.row.noteNum}`),
                                h('p',`总收藏数与点赞: ${params.row.collectNum}`),
                            ]);
                        }
                    },
                    {title: '最近十篇',key: 'fansNum',minWidth:130,
                        render: (h,params) => {
                            return h('div',[
                                h('p',`平均点赞: ${params.row.likes}`),
                                h('p',`平均评论: ${params.row.comments}`),
                                h('p',`平均收藏: ${params.row.collects}`),
                            ]);
                        }
                    },
                    {title: '分类',key: 'type_list',minWidth:80},
                    {title: '备注',key: 'remarks',minWidth:60},
                    {title: '投放报价',key: 'dmhPrice',minWidth:130},
                    {
                        title: '收藏',
                        key:'shou',
                        width:80,
                        render: (h, params) => {
                    		return h('a', {
                                on: {
                                    'click': () => {
                                        this.collect(params.index);
                                    }
                                }
                            }, params.row.favorite==1? '取消' : '收藏')
                    	}
                    }
                ],
                resData:[],
                searchCondition:{ 
                    page:1,
                    per_page:10,
                },
           }
       },
       mounted(){
           this.mediaInitCate();
           this.xiaohongshuPubList();
           if(this.$route.query.id){
               this.articleId = this.$route.query.id;
               this.getArticle();
           }
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
                xiaohonghsuInitCate().then(res => {
                    this.spinShow = false;
                    var price = {price:[{value:'',label:'请选择'},{value:'1',label:'1-100'},{value:'4',label:'101-200'},{value:'5',label:'200以上'}]}
                    if(res.code == 200){
                        this.typeList = Object.assign(res.data, price);
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //小红薯媒体列表
            xiaohongshuPubList(type){
                if(type) this.searchCondition.page = 1;
                this.loading = true;
                xiaohongshuMediaInfo(this.searchCondition).then(res => {
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
                xiaohongshuMediaInfo(Object.assign(this.searchCondition,down)).then( res => {
                    this.downLoadwj(util.siteUrl+'api/v1/publish/red-book/choose-list?', this.searchCondition,res);
                });
            },

            //选中媒体
            //价格为大门户价格
            selectRow(selection,row,all){
                if(this.$route.query.id) return 
                this.mediaTagList = selection;
                this.customAmount();
            },

            //closeTag 关闭选中标签
            closeTag(id,mediaTagList){
                for(var j = 0;j < this.resData.length;j++){
                    let r_lth = this.resData[j];
                    if(r_lth.id == id){
                        this.$refs.table.objData[j]._isChecked=false;
                    }
                }
                this.customAmount();
            },

            //下一步
            nextStep(){
                if(this.mediaTagList.length == 0){
                    this.$Notice.warning({ title: '请选择小红薯媒体~' }); 
                    return
                }else if(this.articleId && this.mediaTagList.length>1){
                    this.$Notice.warning({ title: '再发布时只能选中一个媒体哦~' }); 
                    return
                }else if(this.isAuth([2]) && this.yu < this.amount){
                    this.$Notice.warning({ title: '余额不足~' });
                    return 
                }
                this.showPublish = true;
            },

            //重新选择小红薯
            showAddDetails(data){
                this.showPublish = false;
                this.$nextTick(function () {
                    if(data){
                        this.mediaTagList = data;
                        for(var j = 0;j < data.length;j++){
                            for(var i = 0;i < this.resData.length;i++){
                                var _i = i;
                                let r_lth = this.resData[i];
                                if(r_lth.id == data[j].mediaId || r_lth.id == data[j].id){
                                    this.$refs.table.objData[_i]._isChecked = true;
                                }else{
                                    this.$refs.table.objData[_i]._isChecked = false;
                                }
                            }
                        }
                    }
                })
            },

            //收藏
            collect(index){
                let _resData = this.resData[index];
                var data = {
                    id: _resData.id,
                    type: 0
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

            //计算余额 和 总计
            customAmount(){
                this.$nextTick(() => {
                    this.yu = balance;
                    this.amount = 0;
                    this.mediaTagList.forEach(v =>{
                        this.amount = Number(v.dmhPrice) + Number(this.amount);
                    })
                })
            },

            //编辑时 获取数据
            getArticle(){
                editGetArticle(this.articleId).then(res => {
                    if(res.code == 200){
                        this.mediaTagList = [res.data];
                        this.customAmount();
                    }else{
                        this.articleId = '';
                        this.$Notice.error({title: res.message});
                        if(res.code == 404){
                            this.$router.push({
                                path: '/article/list'
                            })
                        }
                    }
                })
            }
       },
       components:{
           pubBottomTag,
           xiaohognshuPublish
       }
    };
</script>
<style lang="less">
    .xiaohongshuPub{
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
    }
</style>