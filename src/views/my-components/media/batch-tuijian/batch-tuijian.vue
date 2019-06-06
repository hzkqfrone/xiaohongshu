<template>
    <div class="batchWrapper">
        <Button v-if="searchQx" type="info" icon="checkmark-round" @click="batchTui(4)">批量推荐</Button>
        <Button v-if="searchQx" type="info" icon="close-round" @click="batchTui(5)">批量不推荐</Button>
        <Button v-if="searchQx && (type=='wz' || type=='zmt' || type =='xhs')" type="error" icon="checkmark-round" @click="batchPass">批量审核通过</Button>
        <Button v-if="searchQx" type="error" icon="close-round" @click="batchTui(-1)">批量审核不通过</Button>
        <Button v-if="addMenuBtn" type="success" icon="checkmark-round" @click="batchTui(1)">批量启用</Button>
        <Button v-if="addMenuBtn" type="success" icon="close-round" @click="batchTui(0)">批量不启用</Button>
        <Button v-if="searchQx && type!='xhs' && type!='custom'" type="warning" icon="settings"  @click="priceManage">价格管理</Button>
        <Button v-if="syncMedia" type="warning" icon="android-sync" @click="syncNewMedia">同步新增媒体</Button>
        <Modal
            class="priceManage"
            v-model="priceModal"
            title="价格管理"
            width="1000">
            <Form :label-width="90" inline v-for="(item,index) in priceArr.price" :key="index">
                    <FormItem label="起始金额">
                        <InputNumber :min="1" v-model="item.start" style="width:90px"></InputNumber >
                    </FormItem>
                    <FormItem label="截止金额">
                        <InputNumber :min="1" v-model="item.end" style="width:90px"></InputNumber >
                    </FormItem>
                    <FormItem label="添加收费金额" style="margin-left:20px;">
                        <ul>
                            <li>
                                <span v-if="index == 0">会员V1增加金额</span>
                                <InputNumber :min="1" v-model="item.m1" style="width:90px"></InputNumber >
                            </li>
                            <li>
                                <span v-if="index == 0">会员V2增加金额</span>
                                <InputNumber :min="1" v-model="item.m2" style="width:90px"></InputNumber >
                            </li>
                        </ul>
                    </FormItem>
                    <a href="javascript:;" class="add" @click="addRow" v-if="index == priceArr.price.length-1"><Icon type="plus-circled"></Icon></a>
                    <a href="javascript:;" class="del" @click="delRow(index)" v-if="index!=0"><Icon type="android-cancel"></Icon></a>
                </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="submit">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {tuijianWeibo, tuijianWechat, tuijianWeMedia, tuijianMedia, batchPrice, xiaohongshuAudit, customAudit} from '@/libs/api';
export default {
    data(){
        return {
            api:tuijianMedia,
            priceModal:false,
            priceArr:{
                price:[{start:0,end:50,m1:0,m2:0}]
            },
            start:0,
            end:50
        }
    },
    props:['ids','searchQx','addMenuBtn','type','syncMedia'],
    methods:{
        //批量推荐
        batchTui(t){
            if(this.ids.length>0){
                this.api({checkIds:this.ids.join(','),t:t}).then(res=>{
                    if (res.code === 0) {
                        this.$Notice.success({
                            title: res.msg,
                        });
                        this.$emit('mediaListCallback');
                    } else {
                        this.$Notice.error({title: res.msg,});
                    }
                });
            }else{
                this.$Notice.warning({'title':'请勾选选择框'});
            }
        },
        //批量审核通过
        batchPass(){
            this.$emit('batchPassClick');
        },
        //价格管理
        priceManage(){
            this.priceModal = true;
        },
        //取消
        cancel(){
            this.priceArr.price=[{start:0,end:50,m1:0,m2:0}];
            this.start = 0;
            this.end = 50;
            this.priceModal = false;
        },
        //提交价格管理
        submit(){
            batchPrice(this.priceArr).then(res =>{
                if(code == 0){
                    this.$Notice.success({title: res.msg,});
                    this.start = 0;
                    this.end = 50;
                }else{
                    this.$Notice.error({title: res.msg,});
                }
            })
        },
        //同步新增媒体
        syncNewMedia(){
            
        },
        //增加一行
        addRow(){
            this.start += 50;
            this.end += 50;
            this.priceArr.price.push({start:this.start,end:this.end,m1:0,m2:0})
        },
        //删除一行
        delRow(i){
            this.priceArr.price.splice(i,1);
        }
    },
    mounted(){
        if(this.type == "zmt"){
            this.api = tuijianWeMedia;
        }else if(this.type == 'wx'){
            this.api = tuijianWechat;
        }else if(this.type == 'wz'){
            this.api = tuijianMedia;
        }else if(this.type == 'wb'){
            this.api = tuijianWeibo;
        }else if(this.type == 'xhs'){
            this.api = xiaohongshuAudit;
        }else if(this.type == 'custom'){
            this.api = customAudit;
        }
    }
}
</script>
<style lang="less" scoped>
    .batchWrapper{
        display:inline;
    }
    .priceManage{
        form:first-child{
            padding-top:20px;
        }
        ul>li{
            list-style-type:none;
            float: left;
            padding-right:15px;
            position: relative;
            span{
                color:darkorange;
                position: absolute;
                top:-26px;
            }
        }
        a.add{
            font-size:20px;
            margin-right:5px;
        }
        a.del{
            font-size:22px;
        }
    }
</style>

