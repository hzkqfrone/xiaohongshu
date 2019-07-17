<template>
    <Row class="setting_wrap">
        <Col :md="18" :sm="24">
            <Card>
                <p slot="title">个人信息</p>
                <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'">
                    <FormItem label="姓名">
                        <Input class="input" placeholder="姓名" v-model="params.nickname"></Input>
                    </FormItem>
                    <FormItem label="QQ">
                        <Input class="input" placeholder="qq" v-model="params.qq"></Input>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input class="input" placeholder="邮箱" v-model="params.email"></Input>
                    </FormItem>
                    <FormItem label="手机号">
                        <Input class="input" placeholder="手机号" v-model="params.mobile"></Input>
                    </FormItem>
                    <FormItem label="行业">
                        <Input class="input" placeholder="行业" v-model="params.trade"></Input>
                    </FormItem>
                    <FormItem label="绑定微信">
                        <div>
                            <img class="qrcode" v-if="ticket" :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`" />
                            <ul class="wechat_list">
                                <li v-for="(list, index) in params.wechat" :key="index+list.id">
                                    <span class="name">{{list.nickname}}</span>
                                    <Button type="error" size="small" @click="handleUnbindWechat(index)">解绑</Button>
                                </li>
                            </ul>
                        </div>
                    </FormItem>
                </Form>
                <Button type="success" :loading="memberLoading" @click="changeMemberInfoBtn">提交</Button>
            </Card>
        </Col>
        <Col :md="18" :sm="24" class="change_password">
            <Card>
                <p slot="title">修改密码</p>
                <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'">
                    <FormItem label="旧密码">
                        <Input class="input" type="password" placeholder="旧密码" v-model="pw.original_pass"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input class="input" type="password" placeholder="密码" v-model="pw.new_pass"></Input>
                    </FormItem>
                     <FormItem label="确认密码">
                        <Input class="input" type="password" placeholder="确认密码" v-model="pw.repeat_pass"></Input>
                    </FormItem>
                </Form>
                <Button type="success" :loading="passwordLoading" @click="changePasswordBtn">提交</Button>
            </Card>
        </Col>
    </Row>
</template>
<script>
import { getMemberInfo, updatedMemberInfo, updatedPassword, getQrcode, isBindWechat, unbindWechat } from '@/libs/api';
import { ImgEmoji } from '@/mixins/mixin';
export default {
    data(){
        return{
            params: {},               //个人信息
            pw: {},
            memberLoading: false,
            passwordLoading: false,
            ticket: '',               //二维码
            timer: '',                //定时器
        }
    },
    mounted() {
        this.getUserInfo();
        this.getQrcode();
    },
    methods: {
        //获取个人信息
        getUserInfo(){
            getMemberInfo().then(res => {
                if(res.code == 200){
                    this.params = res.data;
                    this.bindWechat();
                    this.timer = setInterval(() => {
                        this.bindWechat();
                    }, 5000);
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //修改个人信息
        changeMemberInfoBtn(){
            this.memberLoading = true;
            updatedMemberInfo(this.params).then(res => {
                this.memberLoading = false;
                if(res.code == 200){
                    this.$Notice.success({ title: res.message });
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },  

        //修改密码
        changePasswordBtn(){
            if(!this.pw.original_pass){
                this.$Notice.warning({ title: '请输入旧密码~' });
                return
            }else if(!this.pw.new_pass){
                this.$Notice.warning({ title: '请输入新密码~' });
                return
            }else if(!this.pw.repeat_pass){
                this.$Notice.warning({ title: '请输入确认密码~' });
                return
            }else if(this.pw.new_pass != this.pw.repeat_pass){
                this.$Notice.warning({ title: '两次密码输入不一致~' });
                return
            }
            this.passwordLoading = true;
            updatedPassword(this.pw).then(res => {
                this.passwordLoading = false;
                if(res.code == 200){
                    this.$Notice.success({ 
                        title: res.message,
                        duration: 2,
                        onClose: ()=> {
                            this.$store.commit('logout', this);
                            this.$router.push('/login');
                        }
                    });
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //获取二维码
        getQrcode(){
            getQrcode().then(res => {
                if(res.code == 200){
                    this.ticket = res.data.ticket;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //轮询请求 是否绑定了微信二维码
        bindWechat(){
            let data = {
                ticket: this.ticket
            }
            isBindWechat(data).then(res => {
                if(res.code == 200){
                    if(res.data.length != this.params.wechat.length){
                        this.$Notice.success({ title: res.message });
                        clearInterval(this.timer);
                        this.getUserInfo();
                    }
                }else{
                    clearInterval(this.timer);
                    this.$Notice.error({ title: res.message });
                }
            })    
        },

        //解除绑定 微信账号
        handleUnbindWechat(index){
            let data = {
                id: this.params.wechat[index].id
            }
            unbindWechat(data).then(res => {
                if(res.code == 200){
                    this.$Notice.success({ title: res.message });
                    this.params.wechat.splice(index, 1);
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        }
    },
    destroyed(){
        clearInterval(this.timer);
    },
}
</script>
<style lang="less">
    .setting_wrap{
        input{
            width: 60%;
        }
        .change_password{
            margin-top: 20px;
        }
        button{
            margin-left: 20px;
        }
        .qrcode{
            width: 200px;
            height: 200px;
            vertical-align: top;
        }
        .wechat_list{
            display: inline-block;
            margin-left: 20px;
            li{
                span.name{
                    display: inline-block;
                    width: 200px;
                }
                list-style: none;
                padding: 10px;
                border-bottom: 1px solid #e5e5e5;
                &:hover{
                    background: #d1e9ff;
                }
            }
        }
    }
</style>
