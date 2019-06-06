<template>
    <!-- 我的资源tab切换 -->
    <Tabs class="margin-top-10 mediaTab" type="card" value="1" @on-click="tabSw">
        <TabPane :label="tabs.all" name="1"></TabPane>
        <TabPane :label="tabs.pass" name="2"></TabPane>
        <TabPane :label="tabs.nopss" name="3"></TabPane>
        <TabPane :label="tabs.auditor" name="4"></TabPane>
    </Tabs>
</template>
<script>
export default {
    props:['statusNum'],
    data(){
        return {
            tabs:{
                all: (h) => {
                    return h('div', [
                        h('span', '全部资源'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.statusNum.total
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                pass: (h) => {
                    return h('div', [
                        h('span', '已通过'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.statusNum.pass
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                nopss: (h) => {
                    return h('div', [
                        h('span', '未通过'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.statusNum.noPass
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
                auditor: (h) => {
                    return h('div', [
                        h('span', '待审核'),
                        h('Badge', {
                            props: {
                                'overflow-count':99999999999,
                                count: this.statusNum.noAudit
                            },
                            style:{marginLeft:'5px'}
                        })
                    ])
                },
            },
        }
    },
    methods:{
        tabSw(name){
            let n = -2;
            switch (name) {
                case '1':
                    n = -2;
                    break;
                case '2':
                    n = 1;
                    break;
                case '3':
                    n = -1;
                    break;
                case '4':
                    n = 0;
                    break;
                default:
                    break;
            }
            this.$emit('mediaTab',n);
        }
    }
}
</script>
