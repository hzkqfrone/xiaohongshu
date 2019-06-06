<template>
    <div>
        <Card>
            <p slot="title">查询下拉</p>
            <div class="button_wrap">
                <Button type="primary" icon="md-add">添加搜索词</Button>
                <Button type="error" icon="md-trash">批量删除</Button>
                <Button icon="md-arrow-round-down" class="downLoad">下载报表</Button>
            </div>
            <Table :columns="columns" :data="resData"></Table>
            <Page :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin:20px 0"></Page>
        </Card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            params: {},
            resData: [],
            totalCount: 0,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    key: '',
                    title: '编号',
                    width: 60
                },
                {
                    key: '',
                    title: '搜索词',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '状态',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '下拉词数',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '笔记数',
                    minWidth: 150
                },
                {
                    key: '',
                    title: '创建时间',
                    minWidth: 50
                },
                {
                    key: '',
                    title: '更新时间',
                    minWidth: 60
                },
                {
                    key: '',
                    title: '操作',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, '查看详情'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                }
                            }, '删除')
                        ])
                    }
                }
            ]
        }
    },
    methods: {
        //加载列表
        init(){

        },

        //搜索
        serchData(){
            this.params.page = 1;
            this.init();
        },

        //页码
        changeNum(page){
            this.params.page = page;
            this.init();
        },

        //每页条数
        changeSize(size){
            this.per_page = size;
            this.init();
        }
    },
}
</script>
<style lang="less" scoped>
    .downLoad{
        float: right;
        margin-right:20px;
    }
</style>
