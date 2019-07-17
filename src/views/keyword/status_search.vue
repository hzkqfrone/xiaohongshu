<template>
    <div>
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        关键词合作情况查询
                    </p>
                    <div>
                        <Input placeholder="搜索关键词" class="keyword_search" v-model="params.keyword" @on-change="init();params.page=1"/>
                    </div>
                    <div class="button_wrap" v-if="!isAuth([2])">
                        <Button type="primary" @click="showAddKeywordModal(1)">新增关键词</Button>
                        <Button type="primary" v-if="isAuth([1,5,6])" @click="showAddKeywordModal(0)">添加暂停关键词</Button>
                    </div>
                    <show-table-head :loading="loading" :columns="columnsData" :data="resData"></show-table-head>
                    <Page :total="totalCount" :current="params.page" class="pageTemplate" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                </Card>
            </Col>
        </Row>

        <!-- 新增关键词 暂停关键词 -->
        <Modal
            v-model="keywordModal"
            :mask-closable="false"
            :title="isTitle">
            <Input type="textarea" :rows="6" placeholder="输入关键词" v-model="keyword"/>
            <div slot="footer">
                <Button @click="keywordModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="handleAddKeyword">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { addKeywordSearch, KeywordSearchList, deleteKeywordSearch } from '@/libs/api';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    import { userAuthority } from '@/mixins/mixin';
    export default {
        mixins: [userAuthority],
        data(){
            return{
                params: {},
                loading: false,
                isTitle: '新增关键词',
                resData: [],
                columnsData: [
                    {
                        key: 'word',
                        title: '关键词',
                        minWidth: 80,
                        show: true,
                    },
                    {
                        key: 'note',
                        title: '笔记数量',
                        minWidth: 80,
                        show: true,
                    },
                    {
                        key: 'price',
                        title: '报价说明',
                        minWidth: 80,
                        show: true
                    },
                    {
                        key: 'remark',
                        title: '备注说明',
                        minWidth: 80,
                        show: true
                    },
                    {
                        key: 'search_time',
                        title: '查询日期',
                        minWidth: 80,
                        show: true
                    },
                    {
                        key: '',
                        title: '操作',
                        width: 80,
                        show: this.isAuth([1,5,6]),
                        render: (h, params) => {
                            return h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除此数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.del(params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'md-trash',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                        }
                    },
                ],
                totalCount: 0,
                keywordModal: false,
                addParams: {},
                keyword: '',  
                btnLoading: false,          //添加按钮loading    
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            //加载查询列表
            init(){
                this.loading = true;
                KeywordSearchList(this.params).then(res => {
                    this.loading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //显示添加关键词 模态框   type==1 新增  type==2 暂停
            showAddKeywordModal(type){
                this.keyword = '';
                this.addParams = {
                    status: type
                }
                this.keywordModal = true;
                switch (type) {
                    case 1:
                        this.isTitle = "新增关键词";
                        break;
                    default:
                        this.isTitle = "添加暂停关键词";
                        break;
                }
            },

            //添加关键词
            handleAddKeyword(){
                let keywordArr = this.keyword.indexOf('\n');
                let keyword = [];
                if(keywordArr > 0){
                    for(var i = 0;i < keywordArr ;i++){
                        var text_array=this.keyword.split("\n");
                    }
                    for(var j = 0;j < text_array.length;j++){
                        keyword.push(text_array[j])
                    }
                }
                this.addParams.keyword = keyword.length>0 ? keyword : [this.keyword];
                if(!this.addParams.keyword){
                    this.$Notice.warning({title: '请输入关键词'});
                    return
                }
                this.btnLoading = true;
                addKeywordSearch(this.addParams).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.keywordModal = false;
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //删除
            del(id){
                deleteKeywordSearch({id: id}).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
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
        components:{
            showTableHead
        }
    }
</script>


<style lang="less" scoped>
    .keyword_search{
        width:300px;
        margin-bottom:20px;
        margin-left:10px;
    }
</style>
