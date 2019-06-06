<template>
    <div>
        <Card>
            <p slot="title">
                违禁词查询
            </p>
            <Row :gutter="20">
                <Col :md="12" :sm="24">
                    <div class="button_wrap">
                        <Button type="primary" icon="ios-locate-outline" :loading="btnLoading" @click="detection">小红书违禁词检测</Button>
                    </div>
                    <div class="textarea_wrap">
                        <!-- <Input 
                            type="textarea" 
                            :rows="10" 
                            placeholder="输入要查询的文章，字数不能超过1000字。"
                        /> -->
                        <div class="emoji">
                            <Poptip placement="bottom" transfer trigger="hover">
                                <a href="javascript:;" style="color:#ff2741"><Icon type="md-happy" />小红薯表情</a>
                                <div class="api" slot="content">
                                    <div class="emoji_wrap">
                                        <div class="xiaohongshu_img_icon">
                                            <ul class="clearfix">
                                                <li v-for="(item, eindex) in emojiImg" :key="eindex" v-html="item" @click="clickEmImg(eindex)"></li>
                                            </ul>
                                        </div>
                                        <div class="emoji_list">
                                            <i v-for="(item, eindex) in emojiArr" :key="eindex" @click="clickEm(eindex)">{{item}}</i>
                                        </div>
                                    </div>
                                </div>
                            </Poptip>
                        </div>
                        <editor id="violate_editor" ref="textarea"></editor>
                    </div>
                </Col>
                <Col :md="12" :sm="24">
                    <h3>检测结果:</h3>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import editor from '@/views/my-components/editor/editor'; 
import { ImgEmoji } from '@/mixins/mixin';
export default {
    mixins: [ImgEmoji],
    components:{
        editor
    },
    data(){
        return {
            btnLoading: false,         //检测按钮 loading
        }
    },
    methods: {
        //违禁词检测
        detection(){
            this.btnLoading = true;
        },

        //选择emoji 表情
        clickEm(index){
            this.$refs.textarea.inserthtmls(this.emojiArr[index])
        },

        //选择emoji图片
        clickEmImg(index){
            this.$refs.textarea.inserthtmls(this.emojiImg[index])
        },
    },
}
</script>


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

