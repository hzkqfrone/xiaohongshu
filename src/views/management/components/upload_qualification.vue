<template>
    <div>
        <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
            <template>
                <img :src="item">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                </div>
            </template>
        </div>
        <div @mouseenter="action=befroUploadTime('api/v1/member/member/upload')">
            <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','gif']"
                :max-size="5120"
                :on-format-error="handleFormatError"
                :on-exceeded-size="exceededSize"
                :data="upLoadData"
                :before-upload="befroeUpload"
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
</template>
<script>
    import { beyondSize, uploadApiEncrypt } from '@/mixins/mixin';
    import { delAttachment } from '@/libs/api';
    import Cookies from 'js-cookie';
    export default {
        mixins:[beyondSize, uploadApiEncrypt],
        props:['imgUrl', 'uid'],
        data () {
            return {
                action:'', //上传图片接口路径
                upLoadData: {},
                imgName: '',
                visible: false,
                uploadList: [],
                id: '',
            }
        },
        methods: {
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },

            //删除资质图片
            handleRemove(index){
                let data = {
                    id: this.id,
                    attachment: this.uploadList[index]
                }
                delAttachment(data).then(res => {
                    if(res.code == 200){
                        this.uploadList.splice(index, 1);
                        this.$Notice.success({ title: res.message });
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            handleSuccess (res, file) {
                if(res.code == 200){
                    this.uploadList.push(res.data.url);
                }else{
                    this.$Notice.error({ title: res.message });
                }
            },

            //上传前
            befroeUpload(){
                this.upLoadData = {
                    id: this.id,
                }
                let promise = new Promise((resolve) => {
                    this.$nextTick(function () {
                        resolve(true);
                    });
                });
                return promise;
            },

            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式有误',
                });
            },

        },
        mounted () {
            this.action = this.encrypt(`api/v1/member/member/upload`);
        },
        watch: {
            uid(o, n){
                this.id = this.uid;
                this.uploadList = this.imgUrl;
            }
        },
    }
</script>