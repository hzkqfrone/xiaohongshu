<template>
    <div>
        <Card>
            <Row>
                <Col :md="12" :sm="24">
                    <div class="welcome">
                        <p><Icon type="ios-paper-plane-outline" class="icon" />欢迎<span class="nickname">{{userName}}</span>登陆品牌小红薯管理后台</p>
                        <div class="desc">
                            品牌小红薯，是全国首家垂直于小红书APP运营推广营销平台，在这里有很多关于小红书运营知识方案，能快速的帮你找到小红书推广营销策略。
                        </div>
                    </div>
                </Col>
                <Col :md="12" :sm="24">
                    <div class="wechat_wrap">
                        <img src="../../images/qr_code.jpg" class="qr_code">
                        <div class="desc">
                            品牌小红薯官方微信，扫码关注并且绑定账号可获取更多关于小红薯推广信息。
                        </div>
                    </div>
                </Col>
            </Row>
            <h3 class="title">快捷导航</h3>
            <div class="use_info">
                <ul class="clearfix">
                    <li><router-link to="/baping/bp_introduce">红薯霸屏王</router-link></li>
                    <li><router-link to="/seeding/introduce">小红薯种草营销</router-link></li>
                    <li><router-link to="/xiala/data">小红薯搜索下拉</router-link></li>
                    <li><router-link to="/keyword/introduce">小红薯笔记排名</router-link></li>
                    <li><router-link to="/xueyuan/list">小红薯学院</router-link></li>
                    <li><router-link to="/util/blogger_account">小红薯工具</router-link></li>
                </ul>
            </div>
        </Card>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
    data(){
        return {
            userName: ''
        }
    },
    mounted(){
        this.userName = Cookies.get('user');
    }
}
</script>
<style lang="less" scoped>
    @media screen and (max-device-width: 1025px) {
        li{
            width: 48%!important;
        }
        h3{
            text-align: center;
            font-size: 15px!important;
            font-weight: bold;
            margin-bottom: 20px;
            letter-spacing: 2px;
            &.title {
                position: relative;
                color: #333;
                text-align: center;
            }
            &.title:before {
                content: "";
                position: absolute;
                width: 100px!important;
                height: 1px;
                top: 50%;
                background-color: #e1e1e1;
                left: 5%!important;
            }
            &.title:after {
                content: "";
                position: absolute;
                width: 100px!important;
                height: 1px;
                top: 50%;
                background-color: #e1e1e1;
                right: 5%!important;
            }
        }
    }
    .welcome{
        margin: 20px;
        .icon{
            font-size: 30px;
            vertical-align: middle;
            margin-top: -4px;
            margin-right: 5px;
        }
        p{
            letter-spacing: 2px;
            font-size: 17px;
            padding: 10px 0 5px 0;
            .nickname{
                font-size: 18px;
                color: #ef6f6f;
            }
        }
        .desc{
            line-height: 22px;
            color: #666;
            letter-spacing: 1px;
        }
    }
    .wechat_wrap{
        margin: 20px;
        width: 300px;
        background: #f5f5f5;
        float: right;
        .qr_code{
            width: 100px;
            height: 100px;
            display: inline-block;
            margin: 7px 0 2px 10px;
        }
        .desc{
            width: 174px;
            color: #666;
            margin-top: 6px;
            letter-spacing: 2px;
            font-size: 12px;
            padding: 10px;
            display: inline-block;
            vertical-align: top;
        }
    }
    h3{
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
        margin-top: 40px;
        &.title {
            position: relative;
            color: #333;
            text-align: center;
            letter-spacing: 2px;
        }
        &.title:before {
            content: "";
            position: absolute;
            width: 25%;
            height: 1px;
            top: 50%;
            background-color: #e1e1e1;
            left: 20%;
        }
        &.title:after {
            content: "";
            position: absolute;
            width: 25%;
            height: 1px;
            top: 50%;
            background-color: #e1e1e1;
            right: 20%;
        }
    }
    .use_info{
        text-align: center;
        ul{
            width: 100%;
            display: inline-block;
            li{
                width: 14.5%;
                list-style: none;
                float: left;
                margin-right: 1%;
                margin-left: 1%;
                font-size: 14px;
                color: #666;
                line-height: 30px;
                cursor: pointer;
                letter-spacing: 2px;
                margin-bottom: 2%;
                &:hover{
                    color: red;
                    border: 1px solid red;
                }
                height: 80px;
                line-height: 80px;
                text-align: center;
                border: 1px solid #e5e5e5;
            }
        }
    }
</style>
