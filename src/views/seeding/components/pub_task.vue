<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    种草发布
                </p>
                <div slot="extra">
                    <Button icon="md-undo" @click="againSelect">取消</Button>
                </div>
                <!-- 添加内容-->
                <div class="publish">  
                    <Form :label-width="$store.state.app.isFromMobile?auto:170" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" :model="params" :rules="rules" >
                        <FormItem label="订单标题：">
                            <Input class="input" placeholder="输入标题" v-model="params.title"></Input>
                        </FormItem>
                        <FormItem label="代写代发素材提交说明：">
                            <Input class="input explain" type="textarea" :rows="8" placeholder="1.品牌名字；（可以多个）
2.公司介绍；
3.产品介绍；
4.参考官网，产品链接；
5.建议添加的标签；例如：合众康桥；面膜；  
6.建议添加的话题；#医美；#双眼皮修复；#合众康桥
7.在小红书是否有地点：地点的名称是：" v-model="params.attention"></Input>
                            <div class="desc">
                                <p>1.品牌名字；（可以多个）</p>
                                <p>2.公司介绍；</p>
                                <p>3.产品介绍；</p>
                                <p>4.参考官网，产品链接；</p>
                                <p>5.建议添加的标签；例如：合众康桥；面膜； </p> 
                                <p>6.建议添加的话题；#医美；#双眼皮修复；#合众康桥</p>
                                <p>7.在小红书是否有地点：地点的名称是：</p>
                            </div>

                        </FormItem>
                        <FormItem label="客户咨询建议博主回复什么：">
                            <Input class="input" type="textarea" :rows="5" placeholder="1.可提交最少给5种方式以上的联系方式
2.问道价格怎么回复" 
                            v-model="params.note"></Input>
                        </FormItem>
                        <FormItem label="订单数量：">
                            <span>{{params.num}}</span>
                        </FormItem>
                        <FormItem label="完成日期：">
                            <DatePicker type="datetime" :value="params.finish_time" :options="options" placeholder="只能选择当前时间的两天之后的时间" style="width: 250px" @on-change="changeDate"></DatePicker>
                            <div class="remark">只能选择当前时间的一天之后的时间</div>
                        </FormItem>
                        <FormItem label="期望优化的关键词：">
                            <Input class="input" type="textarea" :rows="5" v-model="keyword" placeholder="一行一个，几个订单可输入几个关键词，关键词数量只能等于订单数量。如果是同一个关键词，输入多次即可。"/>
                        </FormItem>
                        <Alert type="error" class="alert">
                            <p>注意： 一个素材最多提交9个照片，批量上传的图片根据上传的图片随机平均分布到每个素材订单，建议一个文章对应3-6个图片。</p>  
                            <p>例如：订单数量是5，上传20个图片，平均每个素材是4个图片。</p> 
                        </Alert>
                        <FormItem label="图片批量上传：">
                            <div>
                                <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
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
                                <div @mouseenter="action=befroUploadTime('api/v1/file/images')" v-show="params.images.length<params.num*9">
                                    <Upload
                                        ref="upload"
                                        :show-upload-list="false"
                                        :on-success="handleSuccess"
                                        :default-file-list="defaultList"
                                        :format="['jpg','jpeg','png','gif']"
                                        :max-size="2048"
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
                                <Modal :footer-hide="true" v-model="visible">
                                    <img :src="imgName" v-if="visible" style="width: 100%">
                                </Modal>
                            </div>
                        </FormItem>
                        <div>
                            <FormItem v-for="(item, index) in editor.content" :label="'图文内容'+(index+1)" :key="index" class="image_text">
                                <div @click="clickUpload(index)" class="uploadBtn" @mouseenter="docAction=befroUploadTime('api/v1/publish/article/upload-word')">
                                    <Upload
                                        ref="content"
                                        :action="docAction"
                                        :format="['doc','docx']"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :on-exceeded-size="exceededSize"
                                        :before-upload="befroeUpload"
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
                                                        <li v-for="(item, eindex) in emojiImg" :key="eindex" v-html="item" @click="clickEmImg(eindex, index)"></li>
                                                    </ul>
                                                </div>
                                                <div class="emoji_list">
                                                    <i v-for="(item, eindex) in emojiArr" :key="eindex" @click="clickEm(eindex, index)">{{item}}</i>
                                                </div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                                <editor :details="editor.content[index]" :id="'editor'+index" ref="textarea"></editor>
                            </FormItem>
                        </div>
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
    import { seedingPub, editSeeding, editRetrySeeding, retrySeeding } from '@/libs/api';
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
                editor: {},
                params: {
                    images: []
                },
                uploadCurrent: -1,         //上传下标
                options: {                 //只能选择当前时间的两天之后的时间
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() + 86400000;
                    }
                },
                action:'',            //上传图片接口路径
                docAction: '',        //上传word
                upLoadData: {},
                imgName: '',
                visible: false,
                keyword: '',          //关键词
                uploadList: [],
                defaultList: [],
            }
        },
        props:['orderNum', 'editId', 'handleType'],
        methods:{
            //重新选择
            againSelect(){
                this.$emit('cancel');
            },

            //完成日期
            changeDate(date){
                this.params.finish_time = date;
            },  

            //提交 发布
            add_manuscript(type){
                this.params.images = [];
                if(this.uploadList.length>0){
                    this.uploadList.forEach((v, index) => {
                        if(v.url){
                            this.params.images.push(v.url);
                        }
                    })
                }
                this.params.publish_status = type;
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
                this.params.keywords = keyword.length>0 ? keyword : [this.keyword];
                if(!this.params.title){
                    this.$Notice.warning({title:'请填写标题'});
                    return
                }else if(!this.params.finish_time){
                    this.$Notice.warning({title:'请选择完成日期'});
                    return
                }else if(this.params.images.length>this.params.num*9){
                    this.$Notice.warning({title:'一个素材最多提交9个照片'});
                    return
                }
                var arry = new Array(this.orderNum);
                this.$set(this.params, 'content', arry)
                this.$refs.textarea.forEach((v, index) => {
                    this.params.content[index] = v.$refs.ueditor.editor.body.innerHTML == "<p> </p>" ? "" : v.$refs.ueditor.editor.body.innerHTML;
                    if(!this.params.content[index]){
                        this.params.content.splice(index, 1);
                        this.params.num -= 1;
                    }
                });
                if(!this.params.num) this.params.num = 1;
                if(type == 1){
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确认无误并发布吗?',
                        onOk: () => {
                            if(this.handleType == 1){
                                this.pub();
                            }else{
                                //重发
                                this.retryPub();
                            }
                        },
                        onCancel: () => {
                            console.log('取消');
                        }
                    });
                }else {
                    if(this.handleType == 1){
                        this.pub();
                    }else if(this.handleType == 2){
                        //重发 - 保存
                        this.retryPub();
                    }
                }
            },

            //发布 || 保存
            pub(){
                seedingPub(this.params).then(res => {
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

            //重发
            retryPub(){
                retrySeeding(this.params).then(res => {
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
            clickEm(eindex, index){
                this.$refs.textarea[index].inserthtmls(this.emojiArr[eindex])
            },

            //选择emoji图片
            clickEmImg(eindex, index){
                this.$refs.textarea[index].inserthtmls(this.emojiImg[eindex])
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
                }else{
                    this.$Notice.error({ title: res.message });
                }
            },

            //上传前
            befroeUpload(file){
                this.$nextTick(() => {
                    this.$refs.content[this.uploadCurrent].fileList[0].index = this.uploadCurrent;
                })
            },

            //上传中
            progress(event){
                this.$store.commit('setProgressStatus', true);
            },

            //上传之前
            clickUpload(index){
                this.uploadCurrent = index;
            },

            //上传成功
            uploadSuccess(res, file){
                this.$store.commit('setProgressStatus', false);
                if(res.code ==  200){
                    this.$set(this.editor.content, this.uploadCurrent, res.data.content);
                }else{
                    this.$Notice.error({title: res.message});
                }
            },

            //获取编辑详情
            getDetail(){
                editSeeding(this.editId).then(res => {
                    if(res.code == 200){
                        this.$nextTick(() => {
                            this.params = res.data;
                            var arry = new Array(res.data.num);
                            setTimeout(() => {
                                this.$set(this.editor, 'content', res.data.content);
                                this.$set(this.params, 'content', res.data.content);
                            }, 500);

                            this.initUploadImgs();
                            res.data.keywords.forEach((t, i) => {if(i > 0 && i % 10 === 0) res.data.keywords.splice(i, 0, '&#13;')});
                            res.data.keywords = res.data.keywords.join('\n');
                            this.keyword = res.data.keywords;
                        })
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //初始化图片列表
            initUploadImgs(){
                this.defaultList = [];
                this.params.images.forEach(v => {
                    this.defaultList.push({
                        name: v,
                        url: v
                    });
                })
                this.$nextTick(() => {
                    this.uploadList = this.$refs.upload.fileList;
                })
            },

            //重发获取 详情
            retryDetail(){
                editRetrySeeding({id: this.editId}).then(res => {
                    if(res.code == 200){
                        this.$nextTick(() => {
                            this.params = res.data;
                            var arry = new Array(res.data.num);
                            setTimeout(() => {
                                this.$set(this.editor, 'content', res.data.content);
                                this.$set(this.params, 'content', res.data.content);
                            }, 300);
                            res.data.keywords.forEach((t, i) => {if(i > 0 && i % 10 === 0) res.data.keywords.splice(i, 0, '&#13;')});
                            res.data.keywords = res.data.keywords.join('\n');
                            this.keyword = res.data.keywords;
                            this.initUploadImgs();
                        })
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            }
                          
        },
        mounted() {
            //上传图片
            this.action = this.encrypt(`api/v1/file/images`);
            this.uploadList = this.$refs.upload.fileList;
            var arry = new Array(this.orderNum);
            this.$set(this.editor, 'content', arry);
            if(this.handleType == 1){
                this.getDetail();
            }else if(this.handleType == 2){
                this.retryDetail();
            }
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
    .emoji{
        display: inline-block;
        margin-left:10px;
        .ivu-poptip-popper{
            width:100%;
        }
        i.ivu-icon{
            font-size:22px;
            cursor: pointer;
        }
    }

    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

</style>



<style lang="less">
    .emoji_wrap{
        .xiaohongshu_img_icon{
            .clearfix:after {
                display: block;
                clear: both;
                content: "";
                visibility: hidden;
                height: 0;
            }
            li{
                float:left;
                list-style: none;
                cursor: pointer;
                border:1px solid #fff;
                height:22px;
                &:hover{
                    border-color:red;
                }
            }
        }
        .emoji_list{
            white-space: pre-wrap;
            i{
                display: inline-block;
                font-style: normal;
                cursor: pointer;
                width:18px;
                height:18px;
                line-height: 18px;
                border:1px solid #fff;
                overflow: hidden;
                &:hover{
                    border-color:red;
                }
            }
        }
    }
    .ivu-upload-list{
        display: none;
    }
</style>


