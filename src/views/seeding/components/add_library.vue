<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    添加素材
                </p>
                <div slot="extra">
                    <Button icon="md-undo" @click="cancel">取消</Button>
                </div>
                <!-- 添加内容-->
                <div class="publish">  
                    <Form :label-width="$store.state.app.isFromMobile?auto:170" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" :model="params" :rules="rules" >
                        <FormItem label="标题：">
                            <Input class="input" placeholder="输入标题" v-model="params.title"></Input>
                        </FormItem>
                        <Form-item label="选择用户" v-if="!isAuth[2]">  
                            <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="handelChangeMember">
                                <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </Form-item> 
                        <FormItem label="选择套餐" v-if="params.member_id">
                            <Select clearable filterable v-model="params.combo_id" style="width:200px"> 
                                <Option v-for="(item, index) in userCombo" :key="index" :label="item.title" :value="item.id">
                                    <span>{{item.title}}</span>
                                    <span style="float:right;color:red">{{item.num}}</span>
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="代写数量：">
                            <InputNumber class="input" :min="1" placeholder="输入代写数量" v-model="params.num" style="width:100px"></InputNumber>
                        </FormItem>
                        <FormItem label="代发素材提交说明：">
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
                        <FormItem label="完成日期：">
                            <DatePicker type="datetime" :value="params.finish_time" :options="options" placeholder="只能选择当前时间的一天之后的时间" style="width: 250px" @on-change="changeDate"></DatePicker>
                            <div class="remark">只能选择当前时间的一天之后的时间</div>
                        </FormItem>
                        <FormItem label="期望优化的关键词：">
                            <Input class="input" type="textarea" :rows="5" v-model="keyword" placeholder="一行一个，几个订单可输入几个关键词，关键词数量只能等于订单数量。如果是同一个关键词，输入多次即可。"/>
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
                                <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="demo-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                    </template>
                                </div>
                                <div @mouseenter="action=befroUploadTime('api/v1/file/images')">
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
                                <Modal :footer-hide="true" v-model="visible">
                                    <img :src="imgName" v-if="visible" style="width: 100%">
                                </Modal>
                            </div>
                        </FormItem>
                        <FormItem label="上传附件：">
                            <div v-for="(item, index) in params.attachment" :key="index">
                                <Tag type="border" closable color="primary" @on-close="delFile(index)">
                                    <a :href="item" target="_blank" class="attchment">{{item}}</a>
                                </Tag>
                            </div>
                            <div class="uploadBtn" @mouseenter="action=befroUploadTime('api/v1/file/files')">
                                <Upload
                                    ref="accessory"
                                    :show-upload-list="false"
                                    :action="action"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :on-exceeded-size="exceededSize"
                                    :on-progress="progress"
                                    :data="upLoadData"
                                    multiple
                                    name="file"
                                    :on-format-error="handleFormatError">
                                    <Button icon="ios-cloud-upload-outline" :loading="uploadFileLoading">上传附件</Button>
                                </Upload>
                            </div>
                        </FormItem>
                    </Form>
                    <div class="footerBtn">
                        <Button size="large" icon="md-undo" @click="cancel">取消</Button>
                        <Button size="large" type="success" :loading="isDisabled" icon="ios-folder-open" @click="add_manuscript(0)">保存</Button>   
                        <Button size="large" type="primary" :loading="isDisabled" icon="md-checkmark" @click="add_manuscript(1)" v-if="!isAuth[2]">提交</Button>           
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { beyondSize, userAuthority, uploadApiEncrypt, getUserList } from '@/mixins/mixin';
    import { seedingAddMaterial, getSeedingMaterialDetail, selectUserCombo } from '@/libs/api';
import addLibrary from '@/views/seeding/components/add_library';
    export default {
        mixins:[beyondSize, userAuthority, uploadApiEncrypt, getUserList],
        data(){
            return {
                isDisabled: false,
                rules: {
                    brandTitle: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ]
                },
                params: {
                    images: [],
                    attachment: [],
                    num: 1
                },
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
                uploadList: [],       //图片
                defaultList: [],
                accessoryList: [],    //附件
                defaultAccessoryList: [],
                uploadFileLoading: false,
                userCombo: [],        //用户套餐
            }
        },
        props:['editId'],
        methods:{
            //取消
            cancel(){
                this.$emit('hideAddLibrary');
            },

            //完成日期
            changeDate(date){
                this.params.finish_time = date;
            },  

            //提交
            add_manuscript(type){
                this.params.images = [];
                if(this.uploadList.length>0){
                    this.uploadList.forEach((v, index) => {
                        if(v.url) this.params.images.push(v.url);
                    })
                }
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
                this.isDisabled = true;
                this.params.publish_status = type;
                this.addLibraryApi();
            },

            //提交 保存 接口
            addLibraryApi(){
                seedingAddMaterial(this.params).then(res => {
                    this.isDisabled = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.$emit('hideAddLibrary');
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({ title: '服务器异常' });
                })
            },

            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },

            //删除图片
            handleRemove(index){
                this.uploadList.splice(index, 1);
            },
            
            //批量上传图片  上传成功
            handleSuccess (res, file) {
                if(res.code == 200){
                    file.url = res.data.url;
                    file.name = res.data.url;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            },

            //上传中
            progress(event){
                this.uploadFileLoading = true;
            },

            //上传成功
            uploadSuccess(res, file){
                this.uploadFileLoading = false;
                if(res.code ==  200){
                    let data = this.params.attachment;
                    data.push(res.data.url);
                    this.$set(this.params, 'attachment', data);
                }else{
                    this.$Notice.error({title: res.message});
                }
            },
            
            //删除附件
            delFile(index){
                this.params.attachment.splice(index, 1);
            },

            //编辑 - 加载详情
            getDetail(){
                getSeedingMaterialDetail(this.editId).then(res => {
                    if(res.code == 200){
                        this.params = res.data;
                        res.data.keywords.forEach((t, i) => {if(i > 0 && i % 10 === 0) res.data.keywords.splice(i, 0, '&#13;')});
                        res.data.keywords = res.data.keywords.join('\n');
                        this.keyword = res.data.keywords;
                        this.initUploadImgs();
                        this.$nextTick(() => {
                            this.handelChangeMember();
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

            //选择用户 显示对应的套餐和剩余量
            handelChangeMember(){
                if(this.params.member_id){
                    selectUserCombo({member_id: this.params.member_id}).then(res => {
                        if(res.code == 200){
                            this.userCombo = res.data;
                        }else{
                            this.$Notice.error({title: res.message});
                        }
                    })
                }
            }
        },
        mounted() {
            //上传图片
            this.action = this.encrypt(`api/v1/file/images`);
            this.docAction = this.encrypt(`api/v1/publish/article/upload-word`);
            this.uploadList = this.$refs.upload.fileList;
            this.getSeedingUserList();
            if(this.editId){
                this.getDetail();
            }
        },
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
            button{
                margin:0 5px;
            }
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
    .attchment{
        color: #ff8200;
        &:hover{
            color: #ff8200;
        }
    }

</style>

