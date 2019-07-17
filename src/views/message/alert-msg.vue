<template>
    <div class="msgWrapper">
        <div class="allRead" v-if="msgId.length>5"><Button type="success" long @click="closeMsg(msgId)">全部已读</Button></div>
    </div>
</template>

<script>
import {getMessageInfo, closeMessageInfo} from '@/libs/api';
import Cookies from 'js-cookie';
export default {
    name:"messageList",
    data() {
        return {
            msgId:[],
            startTime: ''
        }
    },
    methods:{
        //已读消息
        closeMsg(_id){
            let data = {ids: _id};
            closeMessageInfo(data).then(res => {
                if(res.code == 200){
                    this.$store.commit('setMessageCount', this.$store.state.app.messageCount - 1);
                    if(_id.length>1){
                        this.$Notice.destroy();
                        this.$store.commit('setMessageCount', 0);
                        this.msgId = [];
                    }
                }else{
                    this.$Notice.error({title: res.message})
                }
            })
        },

        //提示消息列表
        msgList(msg){
            let _this = this;
            this.msgId = [];
            this.$Notice.destroy();
            this.$store.commit('setMessageCount', msg.length);
            msg.forEach(val => {
                this.msgId.push(val.id);
                this.$Notice.warning({
                    title: val.content,
                    name:val.id,
                    top:50,
                    duration:0,
                    onClose:function() {
                        _this.closeMsg([this.name]);
                    },
                });
            });

            this.$nextTick(function(){
                //消息弹框样式
                document.getElementsByClassName('ivu-notice')[1].style.marginTop= msg.length<=5 ? '70px' : '110px';           
                var bgColor =  document.querySelectorAll('.ivu-notice-notice');
                var fontColor = document.querySelectorAll('.ivu-notice-title');
                var icon = document.querySelectorAll('.ivu-notice-notice-close i');
                var warning =  document.querySelectorAll('.ivu-notice-icon-warning');
                for(var i = 0;i < bgColor.length;i++){
                    bgColor[i].style.backgroundColor = '#f90';
                    fontColor[i].style.whiteSpace = 'normal';
                    fontColor[i].style.color = '#fff';
                    fontColor[i].style.marginLeft = '0';
                    icon[i].style.color="#fff";
                    warning[i].hidden = 'true';
                }
            })
        },

        getMsgInfo(){
            getMessageInfo().then(res => {
                if(res.code == 200){
                    let tag = false;
                    this.ajaxTime(true);
                    this.$store.commit('setChatNum', res.data.chat_num);
                    if(res.data.system.length>0){
                        res.data.system.forEach(val => {
                            if(this.msgId.indexOf(val.id) == -1){
                                tag = true;
                            }
                        });
                        //有新消息时
                        if(tag) this.msgList(res.data.system);
                    } 
                }else{
                    this.$Notice.error({title: res.message})
                }
            })
           
        },


        //网络状况
        ajaxTime(success){
            if (success) {
                var delay = new Date().getTime() - this.startTime.getTime();
                this.$store.commit("updateNetworkMS",delay);
            } 
        },
    },
    created() {
        this.getMsgInfo();
    },
    mounted(){
        let _this = this;
        _this.startTime = new Date();
        var temp = setInterval(() => {
            _this.startTime = new Date();
            if(!Cookies.get('user')){
                clearInterval(temp);
                return false;
            }
            this.getMsgInfo();
        }, 60000);
        
    }
}
</script>
<style lang="less" scoped>
    .allRead{
        position: fixed;
        right: 25px;
        top: 96px;
        width: 335px;
        height:30px;
        z-index: 10000;
    }
</style>
