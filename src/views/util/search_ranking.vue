<template>
    <div>
        <Card class="heade_wrap">
            <p slot="title">查询排名</p>
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" inline>
                <FormItem label="关键词">
                    <Input v-model="params.keyword" clearable placeholder="请输入关键词" style="width: 200px" @on-change="serchData" />
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="params.status" clearable style="width:200px" @on-change="serchData">
                        <Option :value="1">已查询</Option>
                        <Option :value="0">查询中</Option>
                    </Select>
                </FormItem>
            </Form>
            <div class="button_wrap">
                <Button type="primary" icon="md-add">添加查询任务</Button>
                <Button icon="md-arrow-round-down">下载报表</Button>
            </div>
        </Card>
        <Card>
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
                    title: '文章链接',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '博主账号',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '博主相关信息',
                    minWidth: 150
                },
                {
                    key: '',
                    title: '排名',
                    minWidth: 50
                },
                {
                    key: '',
                    title: '笔记数',
                    minWidth: 60
                },
                {
                    key: '',
                    title: '状态',
                    minWidth: 60
                },
                {
                    key: '',
                    title: '创建时间',
                    minWidth: 80
                },
                {
                    key: '',
                    title: '更新时间',
                    minWidth: 80
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
