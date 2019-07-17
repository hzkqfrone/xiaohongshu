<template>
    <div>
        <Card>
            <p slot="title">
                违禁词查询
            </p>
            <Alert type="warning">使用说明：点击检测一次扣10积分。</Alert>
            <Row class="statistics">
                <Tag type="border" color="blue">当前总积分: {{interalData.frozen_integral}}  </Tag>
                <Tag type="border" color="blue">剩余积分: {{interalData.integral}}  </Tag>
                <Button type="info" size="small" @click="page=1;showConsumeLog()">扣除积分明细</Button>
            </Row>
            <Row :gutter="20">
                <Col :md="12" :sm="24">
                    <div class="button_wrap">
                        <Button type="primary" icon="ios-locate-outline" :loading="btnLoading" @click="detection">{{btnLoading?'检测中':'小红书违禁词检测'}}</Button>
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
                        <editor id="violate_editor" ref="textarea"></editor>
                    </div>
                </Col>
                <Col :md="12" :sm="24">
                    <h3>检测结果:</h3>
                    <div class="result_content" v-html="result.content"></div>
                </Col>
            </Row>
            <div class="analyze" v-if="result.content">
                <h3>检测结果分析:</h3>
                <ul class="desc">
                    <li>
                        <p>1.文章总字数：{{result.word_len}} , 禁词字数：{{result.violate_len}} , 占比{{result.rate}}%</p>
                        <p v-if="result.rate>30">目前禁词比例已超过{{result.rate}}% 建议修改文案或删除禁词，以免影响到文章发布或者禁词过多导致不收录。</p>
                    </li>
                    <li>
                        <p>2.建议如果不能删除禁词的可以加入一些小红薯表情稀释禁词占比。</p>
                        <p>例如：加入表情的案例：  医院； 手😊术  类似这样</p>
                    </li>
                    <li>
                        <p>3.小红书每天都有不同的违禁词审核机制，所有的违禁词都不是百分百的，目前出现的违禁词只是供给参考使用。</p>
                    </li>
                </ul>
            </div>
        </Card>
        
        <!-- 扣除积分明细 -->
        <Modal
            width="800"
            v-model="consumeLogModal"
            title="扣除积分明细"> 
            <Table stripe border :loading="consumLoading" :columns="consumeCol" :data="consumeData"></Table>
            <Page :total="consumeTotal" show-total @on-change="consumeChangeNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="consumeLogModal=false">取消</Button>
                <Button type="primary" @click="consumeLogModal=false">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
import editor from '@/views/my-components/editor/editor'; 
import { ImgEmoji } from '@/mixins/mixin';
import { check_forbidden_text, textIntegralConsumeLog, getIntegralDetails } from '@/libs/api';
export default {
    mixins: [ImgEmoji],
    components:{
        editor
    },
    data(){
        return {
            btnLoading: false,         //检测按钮 loading
            result: {},
            consumeLogModal: false,
            consumLoading: false,
            consumeTotal: 0,
            page: 1,
            interalData: {},           //积分详情
            consumeData: [],
            consumeCol: [
                {
                    key: 'created_at',
                    title: '日期',
                    minWidth: 80
                },
                {
                    key: 'old_num',
                    title: '扣除前',
                    minWidth: 80
                },
                {
                    key: 'new_num',
                    title: '扣除后',
                    minWidth: 80
                },
                {
                    key: 'num',
                    title: '扣除积分',
                    minWidth: 80
                },
                {
                    key: 'remark',
                    title: '备注',
                    minWidth: 80
                },
            ],
        }
    },
    mounted() {
        this.getIntegralDetails();
    },
    methods: {
        //违禁词检测
        detection(){
            let content = this.$refs.textarea.$refs.ueditor.editor.body.innerHTML == "<p> </p>" ? "" : this.$refs.textarea.$refs.ueditor.editor.body.innerHTML;
            if(!content){
                this.$Notice.warning({title: '内容不能为空'});
                return 
            }
            this.btnLoading = true;
            check_forbidden_text({ content: content }).then(res => {
                this.btnLoading = false;
                if(res.code == 200){
                    this.result = res.data;
                    this.getIntegralDetails();
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看消费明细
        showConsumeLog(){
            this.consumeLogModal = true;
            this.consumLoading = true;
            textIntegralConsumeLog({page: this.page}).then(res => {
                this.consumLoading = false;
                if(res.code == 200){
                    this.consumeData = res.data.list;
                    this.consumeTotal = res.data.totalCount;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //消费明细 分页
        consumeChangeNum(page){
            this.page = page;
            this.showConsumeLog();
        },

        //获取积分详情
        getIntegralDetails(){
            getIntegralDetails().then(res => {
                if(res.code ==  200){
                    this.interalData = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //选择emoji 表情
        clickEm(index){
            this.$refs.textarea.inserthtmls(this.emojiArr[index])
        },

        //选择emoji图片
        clickEmImg(name){
            let img = `<img src="//ci.xiaohongshu.com/xy_emo_${name}.png?v=2" class="shubaobao-expression" width="18" heihgt="18">`;
            this.$refs.textarea.inserthtmls(img)
        },
    },
}
</script>

<style lang="less" scoped>
    .statistics{
        margin-bottom:20px;
    }
</style>
<style lang="less">
    @import "../../styles/emoji.less";
    .analyze{
        padding:20px;
        h3{
            margin-bottom:20px;
        }
        li{
            list-style: none;
            line-height: 28px;
        }
    }
    .result_content{
        margin-top:20px;
        line-height: 24px;
        font-size:15px;
    }
</style>

