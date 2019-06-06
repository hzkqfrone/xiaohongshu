<template>
    <div class="footer-wrapper">
        <Button shape="circle">余额：{{yu}}</Button>
        <Tag closable color="success" v-if="mediaTagList.length!=0" v-for="(item,index) in mediaTagList" :key="index" @on-close="closeTag(item.mediaId || item.id)">{{item.mediaName}}<span>({{item.sum || item.price || item.dmhPrice}})</span></Tag>
        <Button type="info" v-if="type!='wx' && type!='wb'">总计：{{amount}}</Button>
        <Button type="primary" icon="ios-redo" @click="nextStep">下一步</Button>
    </div>
</template>
<script>
import {getArticleInfo} from '@/libs/api';
import {getWeMediaArticleInfo} from '@/libs/api';    //自媒体
import {getWechatArticleInfo} from '@/libs/api';      //微信
import {getWeiboArticleInfo} from '@/libs/api';        //微博
export default {
    props:['mediaTagList','yu','amount','type'],
    data() {
        return {
            api:{
                GETARTICLEINFO:getArticleInfo
            }
        }
    },
    methods:{
        //下一步
        nextStep(){
            this.$emit('nextStep');
        },

        //closeTag 关闭选中标签
        closeTag(id){
            for(var i = 0;i < this.mediaTagList.length;i++){
                let m_lth = this.mediaTagList[i];
                if(m_lth.mediaId == id || m_lth.id == id){
                    this.mediaTagList.splice(i,1);
                }
            }
            this.$emit('closeTags',id,this.mediaTagList);
        },

        //获取稿件详情
        getArticleInfo(data){
            this.api.GETARTICLEINFO(data).then(res => {
                if(res.code == 0){
                    this.$emit('republication',[res.data]);
                }else{
                    this.$Notice.error({
                        title: res.msg
                    });
                }
            })
        },
    },
    mounted(){
        if(this.$route.query.id && this.$route.query.id != '' && this.mediaTagList.length==0 && this.type == this.$route.query.n){
            //自媒体进入页
            if(this.$route.query.n == 'zmt'){
                this.api.GETARTICLEINFO = getWeMediaArticleInfo;
            }else if(this.$route.query.n == 'wx'){
                //微信
                this.api.GETARTICLEINFO = getWechatArticleInfo;
            }else if(this.$route.query.n == 'wb'){
                //微博
                this.api.GETARTICLEINFO = getWeiboArticleInfo;
            }else if(this.$route.query.n == 'wz'){
                
                this.api.GETARTICLEINFO = getArticleInfo;
            }
            this.getArticleInfo({id:this.$route.query.id});
        }
    }
}
</script>
<style lang="less" scoped>
    //footer
    .footer-wrapper{
        display: inline-block;
        position: fixed;
        bottom:10px;
        z-index:99;
    }
</style>
