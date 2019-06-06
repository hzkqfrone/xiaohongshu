<template>
    <Row class="xiala_wrap">
        <Col>
            <Card>
                <Row class="top">
                    <h3 class="title">小红书引流做的好不好</h3>
                    <p class="desc">下拉词有着至关重要的作用</p>
                    <i class="icon"></i>
                </Row>
                <Row class="xiala_c info">
                    <div class="js_item">
                        <h4>快速有效提升品牌</h4>
                        <div class="js_img">
                            <i class="icon"></i>
                        </div>
                        <div class="desc">迅速提升品牌形象和企业知名度,提升转化率</div>
                    </div>
                    <div class="js_item">
                        <h4>热门词大流量词引导</h4>
                        <div class="js_img">
                            <i class="icon"></i>
                        </div>
                        <div class="desc">热门词(大流量词)/产品词+品牌词(专家)形式展现</div>
                    </div>
                    <div class="js_item">
                        <h4>先做先得</h4>
                        <div class="js_img">
                            <i class="icon"></i>
                        </div>
                        <div class="desc">上词稳定，长期维护，先做先得</div>
                    </div>
                    <div class="js_item">
                        <h4>用户更精准</h4>
                        <div class="js_img">
                            <i class="icon"></i>
                        </div>
                        <div class="desc">热门词+品牌词显示（专家词）,用户搜索更精准推荐</div>
                    </div>
                    <div class="js_item">
                        <h4>多板块展现机会</h4>
                        <div class="js_img">
                            <i class="icon"></i>
                        </div>
                        <div class="desc">更多的推荐曝光入口，多个板块展现机会</div>
                    </div>
                </Row>
                <Row class="xiala_c">
                    <h3>搜索下拉案例位置说明</h3>
                    <div class="anli">
                        <img src="../../images/xiala_anli.png">
                    </div>
                </Row>
                <Row class="xiala_c cooperative_price">
                    <h3>合作价格</h3>
                    <p class="title">如果没有开通下拉搜索：合作请联系对应销售，qq，电话，微信开通下拉合作</p>
                    <Row type="flex" justify="center">
                        <Col :md="18" :sm="24" class="content">
                            <div class="type_list">
                                <div class="head">
                                    <i class="icon"></i>
                                    <p class="desc">2万之内笔记数</p>
                                </div>
                                <div class="info">
                                    <div class="keyword">包月/一个关键词</div>
                                </div>
                            </div>
                            <div class="type_list">
                                <div class="head">
                                    <i class="icon"></i>
                                    <p class="desc">2-10万内笔记数</p>
                                </div>
                                <div class="info">
                                    <div class="keyword">包月/一个关键词</div>
                                </div>
                            </div>
                            <div class="type_list">
                                <div class="head">
                                    <i class="icon"></i>
                                    <p class="desc">10万以上笔记数</p>
                                </div>
                                <div class="info">
                                    <div class="keyword">包月/一个关键词</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Row type="flex" justify="center">
                    <Col :md="18" :sm="24" class="cooperation">
                        <h5>合作说明：</h5>
                        <p>1、从出词后第一天开始计算费用，一个词在30天为一月，不在不计算时间。</p> 
                        <p>2、合作期间不允许换词，可加词。先做先得。</p> 
                        <p>3、默认前24位计费。一般都会维护到前十。</p> 
                    </Col>
                </Row>
            </Card>
        </Col>
    </Row>
</template>
<style lang="less" scoped>
    .top{
        height:195px;
        background: url(../../images/xiala_top_bg.png) no-repeat center;
        color:#fff;
        text-align: center;
        h3{
            font-size:24px;
            padding:40px 0 15px 0;
        }
        p.desc{
            font-size:18px;
            padding-bottom: 15px;
        }
        i.icon{
            display: inline-block;
            width:40px;
            height:40px;
            background:url(../../images/xiala_top_arraw.png) no-repeat;
        }
    }
    .xiala_c{
        border-bottom:1px dashed #e5e5e5;
        padding-bottom:40px;
        h3{
            padding:50px 0 30px;
            text-align: center;
            font-size:20px;
        }
        &.info{
            display: flex;
            flex-wrap: wrap;
            padding-top:20px;
            .js_item{
                width:204px;
                height:340px;
                margin-left:20px;
                margin-top:20px;
                background:#f1f1f1;
                text-align: center;
                h4{
                    font-size:18px;
                    line-height: 64px;
                    border-bottom:1px solid #fff;
                }
                .js_img{
                    border-bottom:1px solid #fff;
                    .icon{
                        display: block;
                        width:140px;
                        height:140px;
                        background:#fff url(../../images/xiala_item_01.png) center no-repeat;
                        border-radius: 50%;
                        margin:27px 32px;
                    }
                }
                .desc{
                    text-align: center;
                    padding:15px 18px 0 18px;
                    line-height: 24px;
                }
                &:nth-child(2){
                    .js_img .icon{
                        background:#fff url(../../images/xiala_item_02.png) center no-repeat;
                    }
                }
                &:nth-child(3){
                    .js_img .icon{
                        background:#fff url(../../images/xiala_item_03.png) center no-repeat;
                    }
                }
                &:nth-child(4){
                    .js_img .icon{
                        background:#fff url(../../images/xiala_item_04.png) center no-repeat;
                    }
                }
                &:nth-child(5){
                    .js_img .icon{
                        background:#fff url(../../images/xiala_item_05.png) center no-repeat;
                    }
                }
            }
        }
        .anli{
            text-align: center;
            img{
                max-width:100%;
                display: inline-block;
            }
        }
        &.cooperative_price{
            border-bottom:none;
            text-align: center;
            .title{
                color:#666;
            }
            .content{
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                .type_list{
                    width: 204px;
                    margin: 40px 0;
                    .head{
                        background:#ff2741;
                        height:196px;
                        color:#fff;
                        padding-top:24px;
                        .icon{
                            display: block;
                            width:112px;
                            height:112px;
                            background:#fff url(../../images/price_01.png) center no-repeat;
                            border-radius: 56px;
                            margin:0 46px 15px 46px;
                        }
                        .desc{
                            font-size:18px;
                        }
                    }
                    &:nth-child(2){
                        .head .icon{
                            background:#fff url(../../images/price_02.png) center no-repeat;
                        }
                    }
                    &:nth-child(3){
                        .head .icon{
                            background:#fff url(../../images/price_03.png) center no-repeat;
                        }
                    }
                }
                .info{
                    background:#f1f1f1;
                    div{
                        border-top:1px solid #fff;
                        line-height: 64px;
                        .num{
                            font-size:18px;
                            font-weight: 500;
                        }
                        .keyword{
                            font-size:16px;
                        }
                    }
                }
            }
        }
    }
    .cooperation{
        border:1px dashed #e5e5e5;
        margin-bottom:60px;
        padding:20px;
        h5{
            line-height: 32px;
            font-size:16px;
            color:#ff2741;
        }
        p{
            line-height: 32px;
        }
    }
</style>
<style lang="less">
    .xiala_wrap{
        width:1140px;
        margin:0 auto;
        .ivu-card-body{
            padding:0;
            width:1140px;
        }
    }
    @media screen and (max-width: 1140px) {
        .xiala_wrap{
            width:100% !important;
            .ivu-card-body{
                width:100% !important;
            }
        }
    }
</style>
