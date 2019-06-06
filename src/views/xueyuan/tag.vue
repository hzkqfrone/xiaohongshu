<template>
    <div>
        <Card class="table">
            <p slot="title">
                标签
            </p>
            <div class="button_wrap">
                <Button type="primary" icon="md-add" @click="addArticle">添加标签</Button>
            </div>
            <show-table-head :loading="showLoading" :columns="columnsData" :data="resData"></show-table-head>
        </Card>

        <!-- 添加 -->
        <Modal
            v-model="addModal"
            transfer
            :mask-closable="false"
            :title="titleText">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addModal">
                <FormItem label="标签">
                    <Input placeholder="请输入标签" v-model="addparams.title" style="width: 200px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addModal=false; addparams={}">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="addBtn">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import showTableHead from '@/views/my-components/show-table-head/table';     //表格
    import editor from '@/views/my-components/editor/editor';                    //富文本
    import {addArticleTag, getArticleTagList, delArticleTag} from '@/libs/api';
    export default {
        data(){
            return {
                showLoading: false,
                resData: [],
                titleText: '添加',           
                addModal: false,               //添加modal
                btnLoading: false,             //添加按钮 loading
                params: {},                    
                addparams: {},                 //添加参数
                columnsData: [
                    {
                        key: 'title',
                        title: '标签',
                        minWidth: 200, 
                        show: true,
                        render: (h, params) => {
                            return h('Tag', {
                                style:{
                                    height: 'auto'
                                }
                            }, params.row.title)
                        }
                    },
                    {
                        key: 'created_at',
                        title: '创建日期',
                        minWidth: 200, 
                        show: true,
                    },
                    {
                        key: '',
                        title: '操作',
                        minWidth: 200, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-create'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true,
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.del(params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props:{
                                            type: 'error',
                                            size: 'small',
                                            icon: 'md-trash'
                                        },
                                    },'删除')
                                ]),
                            ])
                        }
                    },
                ],
            }
        },
        created() {
            this.init();
        },
        methods: {
            //加载列表
            init(){
                this.showLoading = true;
                getArticleTagList().then(res => {
                    this.showLoading = false;
                    if(res.code == 200){
                        this.resData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //添加文章
            addArticle(){
                this.titleText = '添加';
                this.addModal = true;
            },

            //编辑文章
            edit(data){
                this.titleText = '编辑';
                this.addparams = data;
                this.addModal = true;
            },

            //确定提交
            addBtn(){
                if(!this.addparams.title){
                    this.$Notice.warning({title: '请填写标签名'});
                    return 
                }
                this.btnLoading = true;
                addArticleTag(this.addparams).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.addModal = false;
                        this.addparams = {};
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //删除
            del(id){
                delArticleTag({id: id}).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },
        },
        components: {
            showTableHead,
            editor
        }
    }
</script>
<style lang="less" scoped>
    .articleTag{
        height: auto;
    }
</style>
