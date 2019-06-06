<template>
    <!-- 日期选择 -->
    <span>
        <DatePicker  @on-change="changeTime" :value="createTime" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" split-panels placeholder="请选择时间" style="width: 250px"></DatePicker>
        <ButtonGroup>
            <Button @click="timeChoose(1)">今天</Button>
            <Button @click="timeChoose(2)">昨天</Button>
            <Button @click="timeChoose(3)">所有</Button>
        </ButtonGroup>
    </span>
</template>

<script>
import util from '@/libs/util.js';
export default {
    props:['value'],
    data(){
        return {
            createTime:[],
            form:{
                createTimeStart:'',
                createTimeEnd:''
            }
        }
    },
    mounted() {
        if(this.value){
            this.createTime = this.value;
        }
    },
    methods:{
        changeTime(date){
            if (date[1]==undefined){
                date[1] = '';
            }
            this.form.createTimeStart = date[0];
            this.form.createTimeEnd = date[1];
            this.$emit('changeTime',this.form);
        },
        timeChoose(type, data){
            if(type==1){
                var t1 = util.formatDate(new Date(),"yyyy-MM-dd 00:00:00");
                var t2 = util.formatDate(new Date(),"yyyy-MM-dd 23:59:59");
                this.createTime = [t1,t2];
                this.form.createTimeStart = t1;
                this.form.createTimeEnd = t2;
                this.$emit('changeTime',this.form);
            }
            if(type==2){
                var t1 = util.formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 00:00:00");
                var t2 = util.formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 23:59:59");
                this.createTime = [t1,t2];
                this.form.createTimeStart = t1;
                this.form.createTimeEnd = t2;
                this.$emit('changeTime',this.form);
            }
            if(type==3){
                this.createTime = '';
                this.form.createTimeStart = '';
                this.form.createTimeEnd = '';
                this.$emit('changeTime',this.form);
            }
        }
    }
}
</script>
