<template>
<!-- //发稿状态选择 -->
    <Tabs class="margin-top-10 mediaTab" type="card" value="null" @on-click="tabSearch">
        <TabPane :label="tabs.all" name="null"></TabPane>
        <TabPane :label="tabs.not" name="0"></TabPane>
        <TabPane :label="tabs.in" name="1"></TabPane>
        <TabPane :label="tabs.finish" name="2"></TabPane>
        <TabPane :label="tabs.reject" name="-1"></TabPane>
    </Tabs>
</template>
<script>
export default {
    props:['statusNum'],
    data(){
        return {
            status:'',
            tabs:{    
                all: (h) => {  
                    return h('div', [
                        h('span', '全部'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.status.total_count
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                not: (h) => {
                    return h('div', [
                        h('span', '未处理'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.status.wait_count
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                in: (h) => {
                    return h('div', [
                        h('span', '发布中'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.status.ing_count
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                finish: (h) => {
                    return h('div', [
                        h('span', '已完成'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.status.done_count
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                reject: (h) => {
                    return h('div', [
                        h('span', '已拒稿'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.status.back_count
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                }
            }
        }
    },
    methods:{
        tabSearch(name){
            this.$emit('tabClick',name);
        }
    },
    watch:{
        statusNum:function(){
            this.status = this.statusNum;
        }
    }
}
</script>

