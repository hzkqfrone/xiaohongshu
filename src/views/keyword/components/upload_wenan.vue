<template>
    <div>
        <Modal
            v-model="uploadDocModal"
            :mask-closable="false"
            width="800"
            title="上传文案">
            <Form label-position="top">
                <FormItem label="标题">
                    <Input v-model="wenanParams.title" placeholder="标题"/>
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
                    <editor :details="wenanParams.content" id="editor2" ref="textarea"></editor>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="uploadDocModal=false">取消</Button>
                <Button type="primary" @click="submitSaveBtn">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { beyondSize, uploadApiEncrypt } from '@/mixins/mixin';
    import editor from '@/views/my-components/editor/editor'; 
    import Cookies from 'js-cookie';
    import { uploadMaterial } from '@/libs/api';
    export default {
        mixins: [beyondSize, uploadApiEncrypt],
        data() {
            return {
                uploadDocModal: false,
                wenanParams: {},
                docAction: this.encrypt(`api/v1/publish/article/upload-word`),      //word上传地址,        
            }
        },
        methods: {
            //上传成功
            uploadDocSuccess(res){
                if(res.code == 200){
                    this.$Notice.success({title: res.message});
                    this.$set(this.docParam, 'content', res.data.content);
                }else{
                    this.$Notice.error({title: res.message});
                }
            },

            //保存
            submitSaveBtn(){
                this.wenanParams.material_type = 1;         //1 文案
                this.wenanParams.content = this.$refs.textarea.$refs.ueditor.editor.body.innerHTML;
                uploadMaterial(this.wenanParams).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.uploadDocModal = false;
                        this.wenanParams = {};
                        this.$refs.textarea.$refs.ueditor.editor.body.innerHTML = "";
                        this.$emit('refresh');
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //显示上传弹窗
            showUploadModal(status, id){
                this.uploadDocModal = status;
                this.wenanParams.id = id;
            },
        },
        components: {
            editor
        }
    }
</script>
