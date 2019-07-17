<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    {{title}}
                </p>
                <div slot="extra">
                    <Button icon="md-undo" @click="againSelect">重新选择媒体</Button>
                </div>
                <!-- 添加内容 -->
                <div class="publish">  
                    <Form :label-width="$store.state.app.isFromMobile?auto:160" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" :model="params" :rules="rules" >
                        <FormItem label="已选账号：">
                            <Tag class="selectMedia" v-for="(item, index) in tagList" :key="index">{{item.mediaName}} ￥{{item.dmhPrice}}</Tag>
                        </FormItem>
                        <Form-item label="指定用户" v-if="isAuth([1,5,6])">  
                            <Select v-model="params.member_id" filterable clearable style="width:200px">
                                <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </Form-item> 
                        <FormItem label="标题：">
                            <Input class="input" placeholder="输入标题(品牌名字)" v-model="params.title"></Input>
                        </FormItem>
                        <FormItem label="发文注意事项">
                            <Input class="input" type="textarea" :rows="6" placeholder="例如：必须出现的关键词
是否需要用博主照片
需要带的标签：
需要带的话题：
是否有品牌账号：
其他注意事项：例如:必须是要发过宝宝，育儿的母婴账号;例如必须要没有发布本品牌的账号。" 
                            v-model="params.pubAttentionInfo"></Input>
                        </FormItem>
                        <FormItem label="客户咨询建议博主回复什么">
                            <Input class="input" type="textarea" :rows="3" placeholder="1.可提交最少给5种方式以上的联系方式
2.问道价格怎么回复" 
                            v-model="params.note"></Input>
                        </FormItem>
                        <FormItem label="发布总篇数：">
                            <span>{{tagList.length}}</span>
                        </FormItem>
                        <FormItem label="完成日期：">
                            <DatePicker type="datetime" :value="params.finishTime" :options="options" placeholder="只能选择当前时间的两天之后的时间" style="width: 250px" @on-change="changeDate"></DatePicker>
                            <div class="remark">只能选择当前时间的两天之后的时间</div>
                        </FormItem>
                        <div v-if="params.content && params.content.length>0">
                            <Alert type="error" class="alert">
                                <p>1.一个笔记文字不能超过900字(小红书不能超过1000字，需要留100字给博主加表情符号)(小红书不能超过1000字，需要留100字给博主加表情符号)(小红书不能超过1000字，需要留100字给博主加表情符号)(小红书不能超过1000字，需要留100字给博主加表情符号)  一个笔记图片最多9张，4-5张最佳。</p>
                                <p>2.图文+内容提交 根据提交发布总篇数 显示需要提交几个图文</p>
                                <p>3.切记一个笔记，对应一个图文提交对话框，标题，图片，内容，都请按照一个一一对应提交发布，标题，图片，内容，都请按照一个一一对应提交发布</p>
                            </Alert>
                            <FormItem v-for="(item, index) in params.content" :label="tagList[index].mediaName" :key="index" class="image_text">
                                <div @click="clickUpload(index)" class="uploadBtn" @mouseenter="action=befroUploadTime('api/v1/publish/article/upload-word')">
                                    <Upload
                                        :show-upload-list='false'
                                        :action="action"
                                        :format="['doc','docx']"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :on-progress="progress"
                                        :on-exceeded-size="exceededSize"
                                        :on-format-error="handleFormatError">
                                        <Button icon="ios-cloud-upload-outline">word上传</Button>
                                    </Upload>
                                </div>
                                <div class="emoji">
                                    <Poptip placement="bottom" transfer trigger="hover">
                                        <a href="javascript:;" style="color:#ff2741"><Icon type="md-happy" />小红薯表情</a>
                                        <div class="api" slot="content" >
                                            <div class="emoji_wrap">
                                                <div class="xiaohongshu_img_icon">
                                                    <ul class="clearfix">
                                                        <li v-for="(item, eindex) in emojiImg" :key="eindex" @click="clickEmImg(item.label, eindex, index)">
                                                            <img :src="`//ci.xiaohongshu.com/xy_emo_${item.label}.png?v=2`" class="shubaobao-expression" width="18" heihgt="18">
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="emoji_list">
                                                    <i v-for="(item, eindex) in emojiArr" :key="eindex" @click="clickEm(eindex, index)">{{item}}</i>
                                                </div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                                <editor :details="params.content[index]" :id="'editor'+index" ref="textarea" class="textarea"></editor>
                            </FormItem>
                        </div>
                    </Form>
                    <div class="footerBtn">
                        <Button size="large" icon="md-undo" @click="againSelect">重新选择媒体</Button>
                        <Button size="large" type="primary" :loading="isDisabled" icon="md-checkmark" @click="add_manuscript">确定提交任务</Button>           
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
        <div class="footer-wrapper" v-if="!isEdit">
            <Button shape="circle">余额：{{Number(yu)-Number(amount)}}</Button>
            <Button type="info">总计：{{amount || 0}}</Button>
        </div>
    </div>
</template>

<script>
    import { url, beyondSize, getUserList, userAuthority, uploadApiEncrypt, ImgEmoji } from '@/mixins/mixin';
    import { publish } from '@/libs/api';
    import editor from '@/views/my-components/editor/editor';       //富文本
    import Cookies from 'js-cookie';
    export default {
        mixins:[beyondSize, getUserList, userAuthority, uploadApiEncrypt, ImgEmoji],
        data(){
            return {
                title: '小红薯选号发布',
                moreTag: [],
                isDisabled: false,
                action: '',
                rules: {
                    title: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ]
                },
                params: {},
                uploadCurrent: -1,         //上传下标
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() + 86400000*2;
                    }
                },
                isEdit: false,            //是否编辑
            }
        },
        props:['tagList','yu', 'amount', 'editId'],
        methods:{
            //重新选择
            againSelect(){
                this.$emit('addDetails',this.tagList);
            },
        

            //完成日期
            changeDate(date){
                if((new Date(date).getTime() - new Date().getTime()) / 1000 /60 /60 < 42){
                    this.$Notice.warning({title: '只能选择当前时间的两天之后的时间'});
                    return 
                }
                this.params.finishTime = date;
            },  

            //上传之前
            clickUpload(index){
                this.uploadCurrent = index;
            },

            //上传中
            progress(event){
                this.$store.commit('setProgressStatus', true);
            },

            //上传成功
            uploadSuccess(res, file){
                if(res.code == 200){
                    this.$set(this.params.content, this.uploadCurrent, res.data.content);
                }else{
                    this.$Notice.warning({title: res.message});
                }
                this.$store.commit('setProgressStatus', false);
            },

            //提交
            add_manuscript(){
                if(!this.params.title){
                    this.$Notice.warning({title:'请填写标题'});
                    return
                }else if(!this.params.finishTime){
                    this.$Notice.warning({title:'请选择完成日期'});
                    return
                }
                this.$refs.textarea.forEach((v, index) => {
                    this.params.content[index] = v.$refs.ueditor.editor.body.innerHTML;
                });
                this.isDisabled = true;
                publish(this.params).then(res => {
                    this.isDisabled = false;  
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.$router.push({
                            path: '/article/list'
                        })
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({ title: '服务器异常' });
                })
            },

            //编辑时获取数据
            getEditInfo(){
                console.log(this.tagList)
               this.params = this.tagList[0];
                this.params.content = [this.tagList[0].content];
                this.params.medias = [this.params.mediaId];
                setTimeout(() => {
                    this.$refs.textarea.forEach((v, index) => {
                        v.$refs.ueditor.editor.body.innerHTML = this.params.content[index];
                    });
                }, 500);
            },

            //选择emoji 表情
            clickEm(eindex, index){
                this.$refs.textarea[index].inserthtmls(this.emojiArr[eindex])
            },

            //选择emoji图片
            clickEmImg(name, eindex, index){
                let img = `<img src="//ci.xiaohongshu.com/xy_emo_${name}.png?v=2" class="shubaobao-expression" width="18" heihgt="18">`;
                this.$refs.textarea[index].inserthtmls(img)
            },
                          
        },
        mounted() {
            //根据权限加载指定用户列表
            if(this.isAuth([1, 5, 6])){
                this.loadUserList();
            }
            
            //上传文档接口
            this.action = this.encrypt(`api/v1/publish/article/upload-word`);
            //发布篇数 内容 数组
            if(this.tagList && this.tagList.length > 0){
                this.params.medias = [];
                this.params.orderNum = this.tagList.length;
                this.tagList.forEach(v => {
                    this.params.medias.push(v.id);
                })
                var arry = new Array(this.tagList.length);
                this.$set(this.params, 'content', arry)
            }

            //是否编辑定制发布
            if(this.editId){
                this.getEditInfo();
                this.isEdit = true;
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
        .prompt{
            background:#f96868;
            p{
                color:@white;
            }
        }
        .selectMedia.ivu-tag.ivu-tag-default.ivu-tag-checked{
            border-color:@green;
            border-radius:5px;
            background:@white;
            .ivu-tag-text{
                color: @green;
            }
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
        .highlight{
            background:#edf5fc;
            padding: 10px 15px;
            h4{
                line-height: 40px;
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
    .footer-wrapper{
        display: inline-block;
        position: fixed;
        bottom:10px;
        z-index:999;
    }
    .image_text{
        position: relative;
    }
    .uploadBtn{
        display: inline-block;
    }
    .textarea{
        margin-top:10px;
    }
</style>
<style lang="less">
    @import "../../../styles/emoji.less";
</style>
