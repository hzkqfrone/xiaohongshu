<template>
    <div>
        <div @keydown.enter="searchBtn" class="xiaohongshu">
            <Row :gutter="10">
                <Col>
                <Card>
                    <p slot="title">
                        小红薯所有资源
                    </p>
                    <Row :gutter="10" class="search">
                        <Row class="searchList">
                            <Col :md="2" :sm="24"><span class="title">关键词:</span></Col>
                            <Col :md="22" :sm="24">
                                <Input @on-change="searchBtn" size="large" v-model="params.search" placeholder="搜索达人昵称、签名等关键词"><Icon type="ios-search" slot="prefix" /></Input>
                            </Col>
                        </Row>
                        <!-- 客户不显示 -->
                        <Row class="searchList" v-if="isAuth([1])">
                            <Col :md="2" :sm="24"><span class="title">账号链接:</span></Col>
                            <Col :md="22" :sm="24">
                                <Input @on-change="searchBtn" size="large" v-model="params.home_url" placeholder="账号链接"><Icon type="ios-search" slot="prefix" /></Input>
                            </Col>
                        </Row>
                        <Row class="searchList">
                            <Col :md="2" :sm="24"><span class="title">粉丝量:</span></Col>
                            <Col :md="22" :sm="24">
                                <Button v-for="(item,index) in typeList.fans" @click.native="chooseFs(index,item.value)" :class="{jqColor:index==isSelect.fs}" :key="index">{{item.label}}</Button>
                                <Input class="price" v-model="params.changeFansNum" @on-change="searchBtn()"></Input>
                            </Col>
                        </Row>
                        <Row class="searchList">
                            <Col :md="2" :sm="24"><span class="title">地区:</span></Col>
                            <Col :md="22" :sm="24">
                                <Button btn-outlin-success v-for="(item,index) in typeList.region" @click.native="chooseDq(index,item.value)" :class="{dqColor:index==isSelect.dq}" :key="index">{{item.label}}</Button>
                            </Col>
                        </Row>

                        <Button v-if="isAuth([1])" type="info" icon="md-arrow-down" @click="downLoadBtn" style="margin-left:20px;">下载</Button> 
                    </Row>
                </Card>
                </Col>
                <Col class="margin-top-10">
                    <Card>
                        <Row class="earchable-table-con1">
                            <Col :md="12" :sm="24" class="tab_list">
                                <a href="javascript:;" :class="sort==1?'current':''" @click="sort=1, tabParams={}, getMediaList()">综合排序</a><span>|</span>
                                <a href="javascript:;" :class="sort==2?'current':''" @click="sort=2, tabParams={order:'fans'}, getMediaList()">粉丝量</a><span>|</span>
                                <a href="javascript:;" :class="sort==3?'current':''" @click="sort=3, tabParams={order:'hot'}, getMediaList()">博主热度</a><span>|</span>
                                <a href="javascript:;" :class="sort==4?'current':''" @click="sort=4, tabParams={favorite:1}, getMediaList()">已收藏</a><span>|</span>
                                <a href="javascript:;" :class="sort==5?'current':''" @click="sort=5, tabParams={is_contact:1}, getMediaList()"  v-if="isAuth([1])">有联系方式</a>
                            </Col>
                            <Col :md="12" :sm="24" class="total_wrap">
                                <Tag type="border" color="#2c8df2">当前共有达人{{totalCount}}位</Tag>
                                <Tag type="border" color="#2c8df2">当前可联系达人{{count.contact_count}}位</Tag>
                            </Col>
                        </Row>
                        <Row style="overflow: auto;min-height:100px">
                            <Spin size="large" fix v-show="showSpin"></Spin>
                            <!-- <show-table-head :loading="loading" :columns="columns" :data="resData" class="margin-top-10"></show-table-head> -->
                            <div class="noData" v-if="resData.length==0">暂无数据~</div>
                            <div class="xhs_list clearfix" v-for="(item, index) in resData" :key="index">
                                <div class="head">
                                    <img :src="item.head_portrait" class="head_img">
                                    <span class="sex" :class="item.gender==1?'sex_1':'sex_2'"></span>
                                </div>
                                <div class="content">
                                    <div class="top_c">
                                        <a :href="item.home_url" target="_blank" class="username">{{item.nickname}}</a>
                                        <span class="top_item location">{{item.location}}</span>
                                        <span class="top_item" :title="item.signature">{{item.signature}}</span>
                                    </div>
                                    <div class="info">
                                        <i class="xhs_icon"></i>
                                        <ul>
                                            <li>笔记 <span>{{item.notes_number}}条</span></li>
                                            <li>粉丝 <span>{{item.fans}}条</span></li>
                                            <li>点赞 <span>{{item.liked}}</span></li>
                                            <li>收藏 <span>{{item.collected}}</span></li>
                                            <li>关注 <span>{{item.follows}}</span></li>
                                        </ul>
                                    </div>
                                    <div class="tag_wrap" v-if="isAuth([1])">
                                        <span class="success" v-if="item.is_enter">已入驻</span>
                                        <span class="error" v-else>未入驻</span>
                                    </div>
                                </div>
                                <div class="hint">
                                    <div class="time_w">
                                        <span>添加时间: {{item.created_at}}</span>
                                        <span>更新时间: {{item.updated_at}}</span>
                                    </div>
                                    <div class="email"><span v-if="isAuth([1])">{{item.contact}}</span></div>
                                    <div class="collect">
                                        <Button type="info" v-if="item.favorite==1" @click="collect(item.id)">已收藏</Button>
                                        <Button type="warning" v-else @click="collect(item.id)">未收藏</Button>
                                    </div>
                                </div>
                            </div>
                        </Row>
                        <template v-if="isAuth([1,4,6])">
                            <Page :current="params.page" :total="totalCount" style="margin-top:20px" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                        </template>
                        <div class="kol_more" v-if="isAuth([2,3,5]) && totalCount">
                            剩余 <b>{{totalCount - 30}}</b> 个博主等待查看
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>    
    import {customInitCate, xiaohongshuKol, kolCollect} from '@/libs/api';
    import { userAuthority, downloadingTools, url } from '@/mixins/mixin';
    
    export default {
        mixins: [userAuthority, downloadingTools],
        data(){
            return {
                isSelect:{lx:0,dq:0,jq:0, fs: 0},  //类型下标
                totalCount:0,
                typeList:{},
                showSpin: true,
                resData:[],
                count: {},
                params:{},
                ids:[],
                sort: 1,
                tabParams: {},       //tab 筛选参数
            }
        },
        mounted(){
            this.mediaInitCate();
            this.getMediaList();
        },
        methods:{
            changeNum(page){
                this.params.page = page;
                this.getMediaList();
            },

            changeSize(size){
                this.params.per_page = size;
                this.getMediaList();
            },

            //初始化栏目 
            mediaInitCate(){
                customInitCate().then(res => {
                    if(res.code == 200){
                        this.typeList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //加载小红薯列表
            getMediaList(){
                this.showSpin = true;
                let data = this.params;
                data = Object.assign(this.tabParams, data);
                xiaohongshuKol(data).then(res => {
                    this.showSpin = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = Number(res.data.totalCount);
                        this.count = {
                            contact_count: res.data.contact_count,
                            enter_count: res.data.enter_count,
                        }
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //搜索
            searchBtn(){
                this.params.page = 1;
                this.getMediaList();
            },

            //下载
            downLoadBtn(){
                var down = {export: 2};
                xiaohongshuKol(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/kol?', this.params, res);
                });
            },

            //收藏
            collect(id){
                kolCollect({id: id}).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.getMediaList();
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //地区
            chooseDq(index,val){
                this.isSelect.dq = index;
                this.params.location = val;
                this.searchBtn();
            },

            //粉丝量
            chooseFs(index, val){
                this.isSelect.fs = index;
                this.params.fans = val;
                this.searchBtn();
            }
       },
    };
</script>
<style lang="less">
    @import '../../styles/common.less';
    .search .ivu-form-item{
        display:inline-block;
    }
    .searchList{
        padding-bottom:10px;
        .price{
            width:70px;
            margin:0 5px 5px 0;
            height:32px;
        }
        button{
            margin:0 5px 5px 0;
            padding: 5px 7px;
            &.ivu-btn:hover{
                background: #e9f8fe;
                color: #2cb7f5;
                border:1px solid #e9f8fe;
            }
        }
        .ptColor,.lxColor,.dqColor,.jqColor{
            background: #e9f8fe;
            color: #2cb7f5;
            border:1px solid #e9f8fe;
        }
    }
    .xiaohongshu{
        .tab_list{
            max-width: 600px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            a{
                color:#666;
                text-align: center;
                &:hover{
                    color: #2cb7f5;
                }
                &.current{
                    color: #2cb7f5;
                }
            }
        }
        .total_wrap{
            float: right;
            margin-bottom:10px;
            text-align: right;
        }
        .noData{
            height:100px;
            line-height: 100px;
            text-align: center;
        }
        .xhs_list{
            padding:20px 0;
            border-bottom:1px solid #e5e5e5;
            min-width: 1000px;
            display: flex;
            &:first-child{
                border-top:1px solid #e5e5e5;
            }
            .head{
                float:left;
                position: relative;
                margin-right:25px;
                width:92px;
                height:92px;
                .head_img{
                    width:92px;
                    height:92px;
                    border-radius: 50%;
                }
                .sex{
                    position: absolute;
                    bottom:0;
                    right:5px;
                    width:24px;
                    height:24px;
                    background:#fe8a96 url(../../images/woman.png) center no-repeat;
                    border-radius: 50%;
                    border:2px solid #fff;
                }
                .sex_1{
                    background:#2cb7f5 url(../../images/man.png) center no-repeat;
                }
                .sex_2{
                    background:#fe8a96 url(../../images/woman.png) center no-repeat;
                }
            }
            .content{
                width: 100%;
                overflow: hidden;
                min-width: 600px;
                white-space: nowrap;
                .top_c{
                    display: flex;
                    .username{
                        font-size:16px;
                        margin-right:12px;
                        white-space: nowrap;
                    }
                    .top_item{
                        padding:0 12px;
                        border-left:1px solid #e5e5e5;
                        color: #999999;
                        white-space: nowrap;
                        overflow: hidden;
                        display: inline-block;
                        height:16px;
                        line-height: 16px;
                        margin-top:3px;
                        &.location{
                            min-width: 81px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .info{
                    padding:10px 0;
                    .xhs_icon{
                        display:block;
                        width:20px;
                        height:20px;
                        background:url(../../images/xiaohonghsu.png) center no-repeat;
                        margin-right:10px;
                        float: left;
                    }
                    ul{
                        display: flex;
                        li{
                            color:#999;
                            list-style: none;
                            span{
                                font-size:16px;
                                color:#333;
                                padding-left:5px;
                            }
                            margin-right:20px;
                        }
                    }
                }
                .tag_wrap{
                    span{
                        display: inline-block;
                        height:24px;
                        line-height: 24px;
                        text-align: center;
                        color:#fff;
                        padding:0 8px;
                        border-radius: 4px;
                        &.success{
                            background: #2cb7f5;
                        }
                        &.error{
                            background:#ff871c;
                        }
                    }
                }
            }
            .hint{
                float:right;
                text-align: right;
                min-width:425px;
                overflow: hidden;
                margin-left:20px;
                .time_w{
                    color:#999;
                    span{
                        &:first-child{
                            padding-right:15px;
                            border-right:1px solid #e5e5e5;
                        }
                        &:last-child{
                            padding-left:15px;
                        }
                    }
                }
                .email{
                    height:44px;
                    padding:10px 0;
                }
            }
        }
    }
    .kol_more{
        height:100px;
        background:url(../../images/kol.png) no-repeat center;
        text-align: center;
        line-height: 160px;
    }
</style>
