<template>
    <div>
        <Table stripe :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize" class="pageTemplate"></Page>
    </div>
</template>
<script>
    import { getScreenAccountList } from '@/libs/api';
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
                        minWidth: 60,
                        show: true
                    },
                    {
                        key: 'link',
                        title: '博主账号 / 链接',
                        minWidth: 100,
                        show: true,
                        render: (h, params) =>{
                            if(params.row.link){
                                return h('a', {
                                    attrs: {
                                        href: params.row.link,
                                        target: '_blank'
                                    }
                                }, params.row.nickname)
                            }else{
                                return h('span', params.row.nickname);
                            }
                        }
                    },
                    {
                        key: '',
                        title: '曝光数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) =>{
                            return h('div', [
                                h('p', `评论总数: `),
                                h('p', `阅读量: `)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '相关数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) =>{
                            return h('div', [
                                h('p', `笔记: ${params.row.note}`),
                                h('p', `粉丝: ${params.row.fans}`),
                                h('p', `收藏点赞: ${params.row.collect}`)
                            ])
                        }
                    },
                    {
                        key: 'sign_time',
                        title: '注册日期',
                        minWidth: 100,
                        show: true
                    },
                    {
                        key: '',
                        title: '关联手机号',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: () =>{
                                        this.previewData = params.row;
                                        this.previewInfoModal = true;
                                    }
                                }
                            }, params.row.mobile)
                        }
                    },
                    {
                        key: '',
                        title: '查看文章详情',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: ()=> {
                                        this.articleInfoTitle = params.row.nickname;
                                        this.articleInfoModal = true;
                                    }
                                }
                            }, '文章详情')
                        }
                    },
                ],
            }
        },
        mounted() {
            this.params.member_id = this.member_id;
            this.init();
        },
        methods: {
            //博主数量明细
            init(){
                this.tabLoading = true;
                getScreenAccountList(this.params).then(res => {
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