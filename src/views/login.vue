<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-wrap clearfix">
            <div class="login-con">
                <Card :bordered="false">
                    <div>
                        <Tabs :abValue="tabValue">
                            <TabPane label="账号登录" name="zh"></TabPane>
                            <!-- <TabPane label="短信登录" name="code"></TabPane> -->
                        </Tabs>
                    </div>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules" v-if="tabValue == 'zh'">
                            <FormItem prop="username">
                                <div class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend">
                                    <div class="ivu-input-group-prepend">
                                        <Icon type="md-person" :size="16"/>
                                    </div> 
                                    <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> 
                                    <input autocomplete="off" spellcheck="false" type="text" v-model="form.username" placeholder="请输入用户名" class="ivu-input" ref="username">
                                </div>
                            </FormItem>
                            <FormItem prop="password">
                                <div class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend">
                                    <div class="ivu-input-group-prepend">
                                        <Icon type="md-lock" :size="16"/>
                                    </div> 
                                    <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i> 
                                    <input autocomplete="off" spellcheck="false" type="password" v-model="form.password" placeholder="请输入密码" class="ivu-input" ref="password">
                                </div>
                            </FormItem>
                            <FormItem>
                                <Button :loading="loading" @click="handleSubmit" type="primary" long>
                                    <span v-if="!loading">账号登录</span>
                                    <span v-else>登录中...</span>
                                </Button>
                            </FormItem>
                        </Form>
                        <p class="login-tip">
                            <!-- <a href="javascript:;" @click="forgetP">忘记密码</a> -->
                        </p>
                    </div>
                </Card>
            </div>
                    
        </div>
        <div class="copyright">北京品牌小红薯科技发展有限公司 版权所有©2018</div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import {getUserLogin} from '@/libs/api';
import util from '@/libs/util';
export default {
    data () {
        return {
            form: {
                username: '',
                password: ''
            },
            loading:false,
            loadingDX:false,
            tabValue:'zh',
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
        };
    },
    mounted(){
        setTimeout(() => {
            document.querySelectorAll('object')[0].style.zIndex="0";
        }, 20);
    },
    methods: {
        handleSubmit() {
            if(this.tabValue != 'zh') return false;
            this.$refs.loginForm.validate((valid) => {
                if(this.$refs.username.value!='' && this.$refs.password.value!=''){
                    valid = true;
                    this.form.username = this.$refs.username.value;
                    this.form.password = this.$refs.password.value;
                } 
                if (valid) {
                    this.loading = true;
                    this.form.group = "pc";
                    getUserLogin(this.form).then(res => {
                        this.loading = false;
                        if(res.code == 200){
                            this.loginSuccess(res.data);
                        }else{
                            this.$Notice.warning({title:res.message});
                        }
                    }).catch(error => {
                        this.$Notice.error({title:error});
                    })
                }
            })
        },

        //登录成功
        loginSuccess(msg){
            // if(msg.roleList.indexOf('超级管理员')>-1){
            //     localStorage.WMGX_auth = 'wadmin';
            // }else if(msg.roleList.indexOf('销售')>-1){
            //     localStorage.WMGX_auth = 'xs';
            // }
            localStorage.loginData = JSON.stringify(msg.member);
            Cookies.set('uuid', msg.uid);
            Cookies.set('session',msg.access_token);
            Cookies.set('user', msg.member.username);
            this.$router.push({
                name: 'home_index'
            });
            // 调用方法，动态生成路由
            util.initRouter(this);
        },
    }
};
</script>
<style lang="less" scoped>
    .login-code{
        width:210px;
        float:left;
    }
    .textLoginCode{
        margin-left:10px;
    }
    .copyright {
        color:#fff; 
        display:block;
        width:100%;
        text-align:center;
        margin:50px 0;
    }
    .recommend{
        text-align:right;
        line-height:24px;
        color:darkorange;
    }
</style>

