<template>
    <div class="repository">
        <div>
            <Row :gutter="10">
                <Col :md="24" :lg="18">
                    <Card class="search">
                        <Input size="large" search enter-button="立即搜索" placeholder="关键词搜索" v-model="params.title" @on-change="init();params.page=1">
                            <Icon type="ios-contact" slot="prefix" />
                        </Input>
                    </Card>
                    <Card class="noData" v-if="resData.length==0">暂无数据~</Card>
                    <Card class="article_wrap" v-for="(item, index) in resData" :key="index">
                        <Spin size="large" v-if="showSpin" fix></Spin>
                        <Row class="content">
                            <Col :md="24" :lg="4">
                                <div class="head_img">
                                    <img :src="item.cover">
                                </div>
                            </Col>
                            <Col :md="24" :lg="20">
                                <h4 class="title" @click="detail(item.id)">{{item.title}}</h4>
                                <div class="desc" v-html="item.content"></div>
                                <Tag color="blue" v-if="item.tags.length>0" v-for="(tagList, index) in item.tag_name.split(',')" :key="index">{{tagList}}</Tag>
                            </Col>
                        </Row>
                        <Row class="article_b">
                            <span><Icon type="md-calendar" /> {{item.created_at}}</span>
                            <a class="r_details" href="javascript:;" @click="detail(item.id)">阅读详情<Icon type="ios-arrow-dropright-circle" /></a>
                        </Row>
                    </Card>
                    <template>
                        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                    </template>

                </Col>
                <Col :md="24" :lg="6" >
                    <Card class="addBtn" v-if="isAuth([1,5,6])">
                        <div @click="add">
                            <Icon type="ios-add-circle-outline" />
                            <span class="add">添加文案</span>
                        </div>
                    </Card>
                     <Card class="xiaohongshu">
                        <div class="head">
                            <div class="head_img"></div>
                        </div>
                        <div class="content">
                            <div class="title_w">
                                <p>品牌小红薯平台</p>
                                <span class="border"></span>
                            </div>
                            <div class="desc">
                                品牌小红薯，是全国首家垂直于小红书APP运营推广营销平台，在这里有很多关于小红书运营知识方案，能快速的帮你找到小红书推广营销策略
                            </div>
                        </div>
                    </Card>
                    <Card class="work">
                        <h4>品牌小红薯业务<span class="border"></span></h4>
                        <a href="http://www.ppxhs.com"><img src="../../images/yewu_01.png"></a>
                        <a href="javascript:;"><img src="../../images/yewu_02.png"></a>
                        <a href="http://www.ppdmh.com"><img src="../../images/yewu_03.png"></a>
                    </Card>
                    <Card class="work">
                        <h4>标签聚合<span class="border"></span></h4>
                        <span class="articleTag" :class="params.tag_id==item.id?'current':''" v-for="(item, index) in tagList" :key="index" @click="handleTagChange(item.id)">{{item.title}}</span>
                    </Card>
                </Col>
            </Row>
        </div>
        <!-- 详情 -->
        <Modal
            v-model="detailModal"
            width='1200'
            transfer
            class="article_detail"
            title="详情">
            <div class="head">
                <h3>{{detailData.title}}</h3>
                <div class="desc">
                    <span><Icon type="md-person" /> {{detailData.author}}</span>
                    <span><Icon type="md-calendar" /> {{detailData.created_at}}</span>
                </div>
            </div>
            <div class="content" v-html="detailData.content"> </div>
            <div slot="footer">
                <Button @click="detailModal=false">取消</Button>
                <Button type="primary" @click="detailModal=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>    
    import { userAuthority, src } from '@/mixins/mixin';
    import { getArticleList, getArticleDetail, getArticleTagList } from '@/libs/api';
    export default {
        mixins: [userAuthority],
        data(){
            return{
                detailModal: false,
                totalCount: 0,
                params: {},
                pageSize: 15,
                resData: [],
                showSpin: true,
                detailData: {},
                tagList: [],
                defaultImg: 'this.src="' + require('../../images/card_bg.png') + '"',
            }
        },
        created() {
            this.init();
            this.getTagList();
        },
        methods: {
            //加载列表
            init(){
                this.showSpin = true;
                getArticleList(this.params).then(res =>{
                    this.showSpin = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //添加文案
            add(){
                this.$router.push({ path: '/xueyuan/add' })
            },

            //查看详情
            detail(id){
                getArticleDetail(id).then(res => {
                    if(res.code == 200){
                        this.detailModal=true;
                        this.detailData = res.data;
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

            //每页条数
            changeSize(size){
                this.params.per_page = size;
                this.init();
            },

            //加载标签列表
            getTagList(){
                getArticleTagList().then(res => {
                    if(res.code == 200){
                        this.tagList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //选择标签
            handleTagChange(id){
                if(id == this.params.tag_id){
                    this.params.tag_id = '';
                }else{
                    this.$set(this.params, 'tag_id', id);
                }
                this.init();
            }
        },
    };
</script>
<style lang="less">
    .repository{
        .ivu-card-body{
            padding:0;
        }
        .search{
            input{
                border:none;
                height: 50px;
            }
        }
        .noData{
            height: 100px;
            line-height: 100px;
            text-align: center;
            font-size: 16px;
        }
        .article_wrap{
            margin-top:10px;
            .content{
                padding:10px;
                display: flex;
                flex-wrap: wrap;
                border-bottom:1px solid #e5e5e5;
            }
            .head_img{
                width:100%;
                text-align: center;
            }
            img{
                width:100%;
                max-width: 130px;
                padding-right:10px;
                display: inline-block;
                margin:0 auto;
            }
            h4.title{
                padding-top:10px;
                cursor: pointer;
            }
            .desc{
                color:#999;
                padding:10px 0;
                word-wrap: break-word;
            }
            .article_b{
                padding:10px;
                i{
                    margin:0 5px;
                }
                .r_details{
                    float:right;
                    color:#333;
                }
            }
        }
        .addBtn{
            height:52px;
            line-height: 52px;
            text-align: center;
            margin-bottom: 10px;
            cursor: pointer;
            i{
                font-size:20px;
            }
            span{
                color:#2c8df2;
                margin-left:30px;
            }
        }
        .xiaohongshu{
            .head{
                height:128px;
                background:url(../../images/card_bg.png) no-repeat center;
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
                position: relative;
                .head_img{
                    display: inline-blcok;
                    width:108px;
                    height:108px;
                    border-radius: 54px;
                    background:#f1f1f1;
                    margin: 0 auto;
                    position: absolute;
                    top:74px;
                    left:0;
                    right:0;
                }
            }
            .content{
                margin-top:54px;
                .title_w{
                    text-align: center;
                    font-size:16px;
                    padding:12px 0;
                    .border{
                        width:64px;
                        height:2px;
                        background:#001428;
                        display: block;
                        margin:5px auto 0;
                    }
                }
                .desc{
                    text-indent: 2em;
                    line-height: 25px;
                    padding:0 20px 20px 20px;
                }
            }
        }
        .work{
            padding:10px 20px 10px 20px;
            margin-top:10px;
            h4{
                font-size:16px;
                line-height: 54px;
                border-bottom:1px solid #e5e5e5;
                font-weight: 400;
                position: relative;
                margin-bottom:10px;
                .border{
                    position: absolute;
                    width:64px;
                    height:2px;
                    background:#2c8df2;
                    display: block;
                    bottom:0;
                    left:0;
                }
            }
            a{
                display: inline-block;
                width:100%;
                padding-top:5px;
                img{
                    width:100%;
                }
            }
        }
        .articleTag{
            height:25px;
            line-height: 25px;
            padding:0 5px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            margin:5px;
            display: inline-block;
            cursor: pointer;
            &:hover{
                color:#2c8df2;
                border-color: #2c8df2;
            }
            &.current{
                color:#2c8df2;
                border-color: #2c8df2;
            }
        }
    }
</style>
<style lang="less">
    .article_detail{
        .head{
            text-align: center;
            h3{
                padding-bottom:20px;
            }
            span{
                margin:0 10px;
            }
        }
        .content{
            margin-top:20px;
        }
    }
</style>
