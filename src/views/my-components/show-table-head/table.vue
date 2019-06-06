<template>
    <div>
        <Table border :loading="loading" :columns="cloumnsData" :data="data"  @on-selection-change="selectCol" :row-class-name="rowClassName"></Table>
    </div>
</template>
<script>
    export default {
        props:['loading','columns','data','rowClassName', 'clientTd'],
        computed:{
            cloumnsData(){
                let cloumnsArr = [];
                for(var i in this.columns){
                    let msg = this.columns[i];
                    //show = true 时在表头显示
                    if(msg.show){
                        cloumnsArr.push(msg);
                    }
                }
                return cloumnsArr;
            }
        },
        methods:{
            selectCol(data){
                this.$emit('selectTabCol',data);
            }
        },
    }
</script>