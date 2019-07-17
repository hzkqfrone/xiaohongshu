<template>
    <div>
        <Table stripe :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize" class="pageTemplate"></Page>
    </div>
</template>
<script>
    import { getScreenKeywordList } from '@/libs/api';
    export default {
        props: ['member_id'],
        data(){
            return{
                tabLoading: false,
                resData: [],
                totalCount: 0,
                params: {},
                columnsData: [
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 80,
                    }, 
                    {
                        key: 'keyword',
                        title: '关键词',
                        minWidth: 80,
                    }, 
                    {
                        key: 'rank',
                        title: '排名位置',
                        minWidth: 60,
                    }, 
                    {
                        key: 'num',
                        title: '覆盖条数',
                        minWidth: 80,
                    }, 
                    {
                        key: 'search_time',
                        title: '查询时间',
                        minWidth: 80,
                    }, 
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 80,
                    }, 
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 80,
                    }, 
                ],
            }
        },
        mounted() {
            this.params.member_id = this.member_id;
            this.init();
        },
        methods: {
            //关键词明细
            init(){
                this.tabLoading = true;
                getScreenKeywordList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //页码
            changeNum(page){
                this.params.page = page;
                this.init();
            },

            //每页多少条
            changeSize(size){
                this.params.per_page = size;
                this.init();
            }
        },
        watch: {
            member_id(n, o){
                this.resData = [];
                this.params.member_id = this.member_id;
                this.init();      
            }
        },
    }
</script>