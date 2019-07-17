<template>
    <div>
        <Card>
            <p slot="title">
                添加知识库
            </p>
            <Form 
                :label-width="$store.state.app.isFromMobile?auto:90" 
                :label-position="$store.state.app.isFromMobile?'top':'right'" 
                @keydown.native.enter.prevent ="keyDownEvent"
                class="addContent" 
                ref="params" 
                inline>
                <FormItem label="关键词搜索">
                    <Input placeholder="请输入关键词" v-model="params.title" style="width: 200px" @on-change="init();params.page=1;" />
                </FormItem>
            </Form>
        </Card>
        <Card class="table">
            <div class="button_wrap">
                <Button type="primary" icon="md-add" @click="addArticle">添加文案</Button>
                <Button type="success" icon="md-checkmark" v-if="isAuth([1,4,6])" @click="batchAudit(1)">审核通过</Button>
                <Button type="error" icon="md-close" v-if="isAuth([1,4,6])" @click="batchAudit(2)">审核不通过</Button>
            </div>
            <show-table-head :loading="showLoading" :columns="columnsData" :data="resData" @selectTabCol="selectCol"></show-table-head>
            <template>
                <Page :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
            </template>
        </Card>

        <!-- 添加 -->
        <Modal
            v-model="addModal"
            transfer
            width="1000"
            :mask-closable="false"
            :title="titleText">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addModal">
                <FormItem label="标题">
                    <Input placeholder="请输入标题" v-model="addparams.title"/>
                </FormItem>
                <FormItem label="标签">
                    <CheckboxGroup v-model="addparams.tags">
                        <Checkbox v-for="(item, index) in tagList" :key="index" :label="item.id">{{item.title}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="封面图">
                    <div class="demo-upload-list" v-if="addparams.cover">
                        <img :src="addparams.cover">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(addparams.cover)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(addparams.cover)"></Icon>
                        </div>
                    </div>
                    <div v-if="!addparams.cover" @mouseenter="action=befroUploadTime('api/v1/file/images')">
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="5120"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="exceededSize"
                            multiple
                            name="image"
                            type="drag"
                            :action="action"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </div>
                    <Modal title="封面图" v-model="imgModal">
                        <img :src="imgName" v-if="imgModal" style="max-width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label="内容">
                    <div style="display: inline-block" @mouseenter="docAction=befroUploadTime('api/v1/publish/article/upload-word')">
                        <Upload
                            :action="docAction"
                            :format="['doc','docx']"
                            :on-success="uploadDocSuccess"
                            :on-error="uploadError"
                            :on-exceeded-size="exceededSize"
                            :on-format-error="handleFormatError">
                            <Button icon="ios-cloud-upload-outline">word上传</Button>
                        </Upload>
                    </div>
                    <editor :details="addparams.content" id="editor" :order="1" ref="textarea"></editor>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancle">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="addBtn">确定</Button>
            </div>
        </Modal>

        <!-- 预览 -->
        <Modal
            v-model="detailModal"
            width='1200'
            transfer
            class="article_detail"
            title="预览">
            <div class="head">
                <h3>{{preData.title}}</h3>
                <div class="desc">
                    <span><Icon type="md-person" /> {{preData.author}}</span>
                    <span><Icon type="md-calendar" /> {{preData.created_at}}</span>
                </div>
            </div>
            <div class="content" v-html="preData.content"></div>
            <div slot="footer">
                <Button @click="detailModal=false">取消</Button>
                <Button type="primary" @click="detailModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看大图 -->
        <Modal title="封面图" v-model="showLargeImg" style="text-align:center;">
            <img :src="largeImg" v-if="showLargeImg" style="max-width: 100%">
        </Modal>
    </div>
</template>
<script>
    import showTableHead from '@/views/my-components/show-table-head/table';     //表格
    import editor from '@/views/my-components/editor/editor';                    //富文本
    import {beyondSize, uploadApiEncrypt, userAuthority} from '@/mixins/mixin';
    import {addXueyuan, getXueyuanList, auditArticle, delArticle, getArticleTagList} from '@/libs/api';
    export default {
        mixins: [beyondSize, uploadApiEncrypt, userAuthority],
        data(){
            return {
                showLoading: false,
                resData: [],
                titleText: '添加',           
                addModal: false,               //添加modal
                btnLoading: false,             //添加按钮 loading
                params: {},                    
                addparams: {},                 //添加参数
                action: this.encrypt(`api/v1/file/images`),              //上传地址
                docAction: this.encrypt(`api/v1/publish/article/upload-word`),      //word上传地址, 
                ids: [],                       //选中的列表id
                imgModal: false,               //查看大图
                imgName: '',                   //图片url
                detailModal: false,
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        show: true,
                    },
                    {
                        key: '',
                        title: '操作',
                        minWidth: 200, 
                        show: true,
                        render: (h, params) => {
                            return h('div', {
                                attrs:{
                                    class: 'operation'
                                }
                            },[
                                h('a', {
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index);
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.del(params.row.id);
                                        }
                                    }
                                }, [
                                    h('a', {
                                        style: {
                                            marginRight: '5px'
                                        }
                                    },'删除')
                                ]),
                                h('a', {
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    on: {
                                        click: () => {
                                            this.preData = params.row;
                                            this.detailModal = true;
                                        }
                                    }
                                }, '预览'),
                            ])
                        }
                    },
                    {
                        key: 'title',
                        title: '标题',
                        minWidth: 200, 
                        show: true,
                    },
                    {
                        key: 'tag_name',
                        title: '标签',
                        minWidth: 120, 
                        show: true,
                    },
                    {
                        key: 'title',
                        title: '封面图',
                        minWidth: 100, 
                        show: true,
                        render: (h, params) => {
                            return h('img',{
                                attrs: {
                                    src: params.row.cover
                                },
                                style: {
                                    maxWidth: '100px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: ()=> {
                                        this.showLargeImg = true;  
                                        this.largeImg = params.row.cover;
                                    }
                                }
                            })
                        }
                    },
                    {
                        key: 'author',
                        title: '创建人',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: 'created_at',
                        title: '创建时间',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: 'audit',
                        title: '审核状态',
                        minWidth: 80, 
                        show: true,
                    },
                ],
                params: {},            //搜索参数
                totalCount: 0,         //总数
                preData: {},           //预览
                showLargeImg: false,   //封面图
                largeImg: '',
                tagList: [],           //标签列表
            }
        },
        computed: {
            copyData(){
                let obj = {};
                return obj = JSON.parse(JSON.stringify(this.resData));
            }
        },
        created() {
            this.init();
            this.getTagList();
        },
        methods: {
            //加载列表
            init(){
                this.showLoading = true;
                getXueyuanList(this.params).then(res => {
                    this.showLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
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

            //每页条数
            changeSize(size){
                this.params.per_page = size;
                this.init();
            },

            //添加文章
            addArticle(){
                this.titleText = '添加';
                this.addModal = true;
            },

            //编辑文章
            edit(index){
                this.titleText = '编辑';
                this.addModal = true;
                this.$nextTick(() => {
                    this.addparams = this.copyData[index];
                    this.$refs.textarea.$refs.ueditor.editor.body.innerHTML = this.addparams.content;
                })
            },

            //确定提交
            addBtn(){
                this.addparams.content = this.$refs.textarea.$refs.ueditor.editor.body.innerHTML;
                if(!this.addparams.title){
                    this.$Notice.warning({ title: '请填写标题' });
                    return
                }else if(!this.addparams.content){
                    this.$Notice.warning({ title: '请填写内容' });
                }
                this.btnLoading = true;
                addXueyuan(this.addparams).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.addModal = false;
                        this.addparams = {};
                        this.$refs.textarea.$refs.ueditor.editor.body.innerHTML = "";
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({title: '服务器异常'})
                })
            },

            //取消
            cancle(){
                this.addModal = false;
                if(this.titleText == '编辑'){
                    this.addparams = '';
                    this.$refs.textarea.$refs.ueditor.editor.body.innerHTML = "";
                }
            },

            //删除
            del(id){
                delArticle(id).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //表格选中
            selectCol(data){
                this.ids = [];
                data.forEach((item) => {
                    this.ids.push(item.id);
                });
            },

            //批量审核通过
            batchAudit(type){
                if(this.ids.length == 0){
                    this.$Notice.warning({title: '请选择要审核的列表~'});
                    return
                }
                let data = {
                    ids: this.ids,
                    status: type
                }
                auditArticle(data).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //上传封面图  成功
            handleSuccess(res){
                if(res.code == 200){
                    this.$set(this.addparams, 'cover', res.data.url);
                    this.$Notice.success({title: res.message});
                }else{
                    this.$Notice.error({title: res.message});
                }
            },
            
            //查看大图
            handleView (name) {
                this.imgName = name;
                this.imgModal = true;
            },
            handleRemove (file) {
                this.addparams.cover = '';
            },

            //加载标签列表
            getTagList(){
                getArticleTagList().then(res => {
                    if(res.code == 200){
                        this.tagList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //上传word成功
            uploadDocSuccess(res){
                if(res.code == 200){
                    this.$Notice.success({title: res.message});
                    this.$set(this.addparams, 'content', res.data.content);
                }else{
                    this.$Notice.error({title: res.message});
                }
            },
            keyDownEvent(){
                
            }

        },
        components: {
            showTableHead,
            editor
        }
    }
</script>
<style lang="less" scoped>
    .table{
        margin-top:20px;
    }
</style>
<style lang="less">
    .operation{
        a{
            display: inline-block;
            margin-right:10px;
        }
    }
</style>
<style lang="less">
    .article_detail{
        .head{
            text-align: center;
            h3{
                padding-bottom:20px;
            }
            span{
                margin:0 10px;
            }
        }
        .content{
            margin:20px;
            line-height:1.8em;
        }
    }
</style>
