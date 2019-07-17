<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    霸屏发布
                </p>
                <div slot="extra">
                    <Button icon="md-undo" @click="againSelect">取消</Button>
                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
                <!-- 添加内容-->
                <div class="publish">  
                    <Form :label-width="$store.state.app.isFromMobile?auto:170" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" :model="params" :rules="rules" >
                        <FormItem label="标题：">
                            <Input class="input" placeholder="输入正常标题" v-model="params.title"></Input>
                            <span><i style="color:red">*</i> &nbsp;发布到小红书的标题</span>
                        </FormItem>
                        <FormItem label=" ">
                            <Row>
                                <Col :md="12" :sm="24">
                                    <Alert type="error" class="alert">
                                        <p>注意： 一个素材最多提交9个照片，批量上传的图片根据上传的图片随机平均分布到每个素材订单，建议一个文章对应3-6个图片。</p>  
                                        <p>例如：订单数量是5，上传20个图片，平均每个素材是4个图片。</p> 
                                    </Alert>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="图片批量上传：">
                            <div>   
                                <div class="screen_upload" v-for="(item, index) in uploadList" :key="item.url"  v-dragging="{ item: item, list: uploadList, group: 'item' }">
                                    <div class="demo-upload-list">
                                        <template v-if="item.status === 'finished' && item.url">
                                            <img :src="item.url">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                        </template>
                                    </div>
                                    <div class="upload-list-right" v-if="item.status === 'finished' && item.url">
                                        <Input type="text" class="img_tag" placeholder="输入图片标签" v-model="item.tag.name" @on-change="handleImgTag(index, item.tag.name);item.tag.name?item.tag.location='1':item.tag.location=''"/>
                                        <Select style="width:200px" placeholder="选择标签位置" v-model="item.tag.location" v-if="item.tag.name">
                                            <Option value="1">上1</Option>
                                            <Option value="2">上2</Option>
                                            <Option value="3">上3</Option>
                                            <Option value="4">中1</Option>
                                            <Option value="5">中2</Option>
                                            <Option value="6">中3</Option>
                                            <Option value="7">下1</Option>
                                            <Option value="8">下2</Option>
                                            <Option value="9">下3</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div @mouseenter="action=befroUploadTime('api/v1/file/images')" v-show="params.images.length<9" class="screen_upload_btn">
                                    <Upload
                                        ref="upload"
                                        :show-upload-list="false"
                                        :on-success="handleSuccess"
                                        :default-file-list="defaultList"
                                        :format="['jpg','jpeg','png','gif']"
                                        :max-size="5120"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="exceededSize"
                                        :data="upLoadData"
                                        multiple
                                        type="drag"
                                        :action="action"
                                        name="image"
                                        style="display: inline-block;width:58px;">
                                        <div style="width: 58px;height:58px;line-height: 58px;">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </div>
                                    </Upload>
                                </div>
                                <div class="demo-upload-list">
                                    <img src="../img/tag.jpg">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(require('../img/tag.jpg'))"></Icon>
                                    </div>
                                </div>
                                <span class="sample">图片标签位置示例图</span>
                                <Modal :footer-hide="true" v-model="visible">
                                    <img :src="imgName" v-if="visible" style="width: 100%">
                                </Modal>
                            </div>
                        </FormItem>
                        <div>
                            <FormItem label="图文内容" class="image_text">
                                <div class="uploadBtn" @mouseenter="docAction=befroUploadTime('api/v1/publish/article/upload-word')">
                                    <Upload
                                        ref="content"
                                        :action="docAction"
                                        :format="['doc','docx']"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :on-exceeded-size="exceededSize"
                                        :on-progress="progress"
                                        :on-format-error="handleFormatError">
                                        <Button icon="ios-cloud-upload-outline">word上传</Button>
                                    </Upload>
                                </div>
                                <div class="emoji">
                                    <Poptip placement="bottom" transfer trigger="hover">
                                        <a href="javascript:;" style="color:#ff2741"><Icon type="md-happy" />小红薯表情</a>
                                        <div class="api" slot="content">
                                            <div class="emoji_wrap">
                                                <div class="xiaohongshu_img_icon">
                                                    <ul class="clearfix">
                                                        <li v-for="(item, eindex) in emojiImg" :key="eindex" @click="clickEmImg(item.label)">
                                                            <img :src="`//ci.xiaohongshu.com/xy_emo_${item.label}.png?v=2`" class="shubaobao-expression" width="18" heihgt="18">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="emoji_list">
                                                    <i v-for="(item, eindex) in emojiArr" :key="eindex" @click="clickEm(eindex)">{{item}}</i>
                                                </div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                                <editor :details="params.content" id="editor" ref="textarea"></editor>
                            </FormItem>
                        </div>
                        <FormItem label="需要@的账号：">
                            <Input class="input" placeholder="需要@的账号" v-model="params.call_user"></Input>
                        </FormItem>
                        <FormItem label="话题：">
                            <Input class="input" placeholder="话题" v-model="params.topic_name"></Input>
                        </FormItem>
                        <FormItem label="地点：">
                            <Input class="input" placeholder="地点" v-model="params.location"></Input>
                        </FormItem>
                        <FormItem label="定时发布时间：">
                            <DatePicker type="datetime" style="width: 200px" :value="params.release_time" @on-change="selectPubTime"></DatePicker>
                        </FormItem>
                    </Form>
                    <div class="footerBtn">
                        <Button size="large" icon="md-undo" @click="againSelect">取消</Button>
                        <Button size="large" type="success" :loading="isDisabled" icon="ios-folder-open" @click="add_manuscript(0)">保存</Button>         
                        <Button size="large" type="primary" :loading="isDisabled" icon="md-checkmark" @click="add_manuscript(1)">发布</Button>           
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
        
    </div>
</template>

<script>
    import { beyondSize, userAuthority, uploadApiEncrypt, ImgEmoji } from '@/mixins/mixin';
    import { screenPubArticle, getScreenArticleDetails } from '@/libs/api';
    import editor from '@/views/my-components/editor/editor'; 
    export default {
        mixins:[beyondSize, userAuthority, uploadApiEncrypt, ImgEmoji],
        data(){
            return {
                isDisabled: false,
                rules: {
                    brandTitle: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ]
                },
                params: {
                    images: []
                },
                action:'',            //上传图片接口路径
                docAction: '',        //上传word
                upLoadData: {},
                imgName: '',
                visible: false,
                uploadList: [],
                defaultList: [],
                spinShow: false,
            }
        },
        props:['orderNum', 'editId', 'handleType'],
        methods:{
            //重新选择
            againSelect(){
                this.$emit('cancel');
            },

            //提交 发布
            add_manuscript(type){
                this.params.images = [];
                if(this.uploadList.length>0){
                    this.uploadList.forEach((v, index) => {
                        if(v.url){
                            this.params.images.push(
                                {
                                    url: v.url,
                                    tag: {
                                        name: v.tag.name,
                                        location: v.tag.location
                                    }
                                }
                            );
                        }
                    })
                }
                this.params.publish_status = type;
                if(!this.params.title){
                    this.$Notice.warning({title:'请填写标题'});
                    return
                }else if(this.params.images.length>this.params.num*9){
                    this.$Notice.warning({title:'一个素材最多提交9个照片'});
                    return
                }
                var arry = new Array(this.orderNum);
                this.$set(this.params, 'content', arry)
                this.params.content = this.$refs.textarea.$refs.ueditor.editor.body.innerHTML == "<p> </p>" ? "" : this.$refs.textarea.$refs.ueditor.editor.body.innerHTML;

                if(type == 1){
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确认无误并发布吗?',
                        onOk: () => {
                            this.pub();
                        },
                        onCancel: () => {
                            console.log('取消');
                        }
                    });
                }else {
                    this.pub();
                }
            },

            //发布 || 保存
            pub(){
                screenPubArticle(this.params).then(res => {
                    this.isDisabled = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.$emit('cancel');
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({ title: '服务器异常' });
                })
            },


            //选择emoji 表情
            clickEm(eindex){
                this.$refs.textarea.inserthtmls(this.emojiArr[eindex])
            },

            //选择emoji图片
            clickEmImg(name){
                let img = `<img src="//ci.xiaohongshu.com/xy_emo_${name}.png?v=2" class="shubaobao-expression" width="18" heihgt="18">`;
                this.$refs.textarea.inserthtmls(img)
            },

            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },

            //删除图片
            handleRemove(index){
                this.uploadList.splice(index, 1);
            },

            handleSuccess (res, file) {
                if(res.code == 200){
                    file.url = res.data.url;
                    file.name = res.data.url;
                    file.tag = {
                        location: '',
                        name: ''
                    };
                }else{
                    this.$Notice.error({ title: res.message });
                }
            },

            //上传中
            progress(event){
                this.$store.commit('setProgressStatus', true);
            },

            //上传成功
            uploadSuccess(res, file){
                this.$store.commit('setProgressStatus', false);
                if(res.code ==  200){
                    this.$set(this.params, 'content', res.data.content);
                }else{
                    this.$Notice.error({title: res.message});
                }
            },

            //获取编辑详情
            getDetail(){
                this.spinShow = true;
                getScreenArticleDetails({id: this.editId}).then(res => {
                    this.spinShow = false;
                    if(res.code == 200){
                        this.params = res.data;
                        this.editorHTML(res.data.content)
                        this.initUploadImgs();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //eidtor 编辑器 显示内容
            editorHTML(content){
                let timer = setTimeout(() => {
                    if(this.$refs.textarea.$refs.ueditor.editor.body && this.$refs.textarea.$refs.ueditor.editor.body.innerHTML){
                        this.$refs.textarea.$refs.ueditor.editor.body.innerHTML = content;
                        this.$set(this.params, 'content', content);
                    }else{
                        clearTimeout(timer);
                        this.editorHTML(content)
                    }
                }, 500);
            },

            //初始化图片列表
            initUploadImgs(){
                this.defaultList = [];
                this.params.images.forEach(v => {
                    this.defaultList.push({
                        name: v.url,
                        url: v.url,
                        tag: v.tag
                    });
                })
                this.$nextTick(() => {
                    this.uploadList = this.$refs.upload.fileList;
                })
            },

            //图片标签
            handleImgTag(index, name){
                let data = this.uploadList[index];
                data.tag.name = name;
                this.$set(this.uploadList, index, data);
            },

            //选择发布时间
            selectPubTime(date){
                this.params.release_time = date;
            },
                          
        },
        mounted() {
            //上传图片
            this.action = this.encrypt(`api/v1/file/images`);
            this.uploadList = this.$refs.upload.fileList;
            this.$nextTick(() => {
                this.getDetail();
            })
        },
        components:{
            editor
        }
    };

</script>
<style lang="less" scoped>
    @green:#46be8a;
    @white:#fff;
    .publish{
        .input{
            width:60%;
        }
        .explain{
            float:left;
        }
        .desc{
            float:left;
            line-height: 20px;
            padding-left:10px;
        }
        .addContent{
            .ivu-btn-group{
                button{
                    background:@white;
                    &.title_btnColor:hover{
                        color:@white;
                    }
                }
                .issue{
                    color:@green;
                }
                .title{
                    color:#2b85e4;
                }
                .fb_btnColor{
                    background:@green;
                    color:@white;
                }
                .title_btnColor{
                    background:#2b85e4;
                    color:@white;
                }
            }
        }
        .footerBtn{
            text-align: right;
        }
        .alert{
            line-height: 24px;
            font-size:14px;
        }
        .remark{
            line-height: 24px;
            color:red;
        }
    }
</style>

<style lang="less">
    @import "../../../styles/emoji.less";
    .screen_upload{
        background:#f5f5f5;
        border-bottom: 1px solid #e7e7e7;
        padding: 10px 0 0 10px;
        &:hover{
            background:#ebf8ff;
            cursor: move;
        }
        .demo-upload-list{
            display: inline-block;
            border:1px solid #e5e5e5;
        }
        .upload-list-right{
            display: inline-block;
            vertical-align: top;
            margin-top:15px;
        }
        .img_tag{
            width:200px;
        }
    }
    .screen_upload_btn{
        margin-top:10px;
        display: inline-block;
        margin-right: 20px;
    }
</style>
<style lang="less" scoped>
    .sample{
        line-height: 60px;
        color:coral;
        vertical-align: text-bottom;
    }
</style>
