<template>
    <div class="xhs_chat">
        <Card>
            <p slot="title">红薯商务通</p>
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                <FormItem label="博主账号">
                    <Select v-model="params.blogger_id" filterable clearable style="width:200px" @on-change="searchData">
                        <Option v-for="(item, index) in bloggerList" :key="index" :value="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="消息时间">
                    <date-picker @changeTime="selectCreateTime"></date-picker>
                </FormItem>
                <FormItem label="用户">
                    <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="searchData">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否回复">
                    <Select v-model="params.is_reply" filterable clearable style="width:200px" @on-change="searchData">
                        <Option value="1">已回复</Option>
                        <Option value="0">未回复</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否有效会话">
                    <Select v-model="params.status" filterable clearable style="width:200px" @on-change="searchData">
                        <Option :value="1">是</Option>
                        <Option :value="0">否</Option>
                    </Select>
                </FormItem>
             </Form>
        </Card>
        <Card style="margin-top:20px;">
            <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
        </Card>

        <!-- 回复消息 -->
        <Drawer
            :title="taskData.name"
            :styles="styles"
            v-model="sendChatDrawer"
            :width="$store.state.app.isFromMobile?100:550"
            @on-close="closeChatBox"
        >   
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div class="screen_msg_content">
                <div class="more_chat" v-if="Math.ceil(this.msgTotalCount / 10)>this.chatPage">
                    <a href="javascript:;" @click="loadMoreChatLog" v-if="!loadMore">查看更多历史消息</a>
                    <a href="javascript:;" v-if="loadMore">加载中...</a>
                </div>
                <div class="msg_item" v-for="(item, index) in chatContent" :key="index">
                    <div class="msg_list clearfix customer_msg" v-if="item.from_blogger==0"> 
                        <p class="date">{{item.chat_time}}</p>
                        <div class="content">
                            <div class="img_wrap">
                                <img :src="item.content" @click="largeImg=item.content;showLargeImg=true;">
                            </div>
                        </div>
                    </div>
                    <div class="msg_list clearfix my_msg" v-else>
                        <p class="date">{{item.chat_time}}</p>
                        <div class="content_wrap">
                            <div class="msg_status" v-if="item.send_status!='success'">
                                <img src="./img/loading_status.gif" v-if="item.send_status == 'loading'">
                                <img src="./img/error.png" v-if="item.send_status == 'error'">
                            </div>
                            <div class="content" v-html="item.content"></div>
                            <div class="is_read" v-if="!item.is_read">{{item.status}}</div>
                            <!-- <div class="error">含有违禁词</div> -->
                        </div>
                    </div>

                </div>
            </div>
            <div class="demo-drawer-footer textareaBox">
                <div class="func">
                    <Tooltip content="表情" placement="top" class="funcHint">
                        <Icon type="md-happy" @click="isShowIcon=!isShowIcon"></Icon>
                        <div class="emojiWrap" v-show="isShowIcon">
                            <a href="javascript:;" v-for="(item, index) in emojiImg" :key="index+item.value" :title="item.value" @click="selectXhsImg(item.value)">
                                <img :src="`//ci.xiaohongshu.com/xy_emo_${item.label}.png?v=2`" class="shubaobao-expression" width="18" heihgt="18">
                            </a>
                            <!-- <p>
                                <a href="javascript:;" class="xhs_emoji" v-for="(item, index) in emojiArr" :key="index+item" v-html="item" @click="selectXhsEmoji(item)"></a>
                            </p> -->
                        </div>
                    </Tooltip>
                    <!-- <Tooltip content="图片" placement="top" class="funcHint">
                        <Upload 
                            :action="action"
                            ref="upload_img"
                            :format="['jpg','jpeg','png','gif']"
                            :max-size="51200"
                            :show-upload-list="false"
                            :on-format-error="handleFormatError"
                            :on-success="imageSuccess"
                            :on-error="uploadError"
                            name="image"
                            style="display:inline-block;">
                            <Icon type="md-image" />
                        </Upload>
                    </Tooltip> -->
                </div>
                <Poptip trigger="hover" placement="left-end" width="450" transfer word-wrap>
                    <Input 
                        type="textarea" 
                        :rows="3" 
                        class="textarea" 
                        v-model="msgContent" 
                        @on-focus="isShowIcon=false"
                        @on-keydown.enter.stop.prevent="sendMsgBtn"
                    />
                    <Button type="primary" class="sendBtn" :disabled="msgContent? false:true" @click="sendMsgBtn">发送</Button>
                    <div slot="content" class="poptip_content">
                        <p style="color:red">私信的回复的时候：</p>
                        <p>可以说专家名字例如：郭树忠 价格可以说： 4000多 问医院可以说：北京西美，艺星 </p>
                        <p>问道联系方式的可以直接说具体的微信号： 一般都是数字+字母的</p>
                        <p>或者说方便你的方式能留给我吗，我来＋你</p>
                        <p>等等类似的。</p>
                        <p>但是别回复具体的：“钱 元 微信 电话 号码 地址 医院 专家 医生”这些字眼 避免被禁言或者封号 可以谐音</p>
                    </div>
                </Poptip>
            </div>
        </Drawer>

        <!-- 查看聊天大图 -->
        <Modal title="图片" v-model="showLargeImg" style="text-align:center;">
            <img :src="largeImg" v-if="showLargeImg" style="max-width: 100%">
        </Modal>

        <!-- 添加备注 showRemarks -->
        <Modal
            v-model="showRemarks"
            transfer
            :mask-closable="false"
            title="备注">
            <Form label-position="top">
                <FormItem label="备注">
                    <Input placeholder="备注" v-model="remarkParams.remark"/>
                </FormItem>
                <FormItem label="备注日志">
                    <Timeline>
                        <TimelineItem color="green" v-for="(item, index) in remarkLogData" :key="index">
                            <p>{{item.created_at}} <span>&nbsp;&nbsp;&nbsp;{{item.member_name}}</span></p>
                            <p>{{item.data}}</p>
                        </TimelineItem>
                    </Timeline>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="showRemarks=false">取消</Button>
                <Button type="primary" @click="addRemarkBtn">确定</Button>
            </div>
        </Modal>

        <!-- 修改会话状态 有效 无效 -->
        <Modal
            v-model="taskStatusModal"
            title="修改会话状态"
            :mask-closable="false"
            transfer>
            <RadioGroup v-model="chatStatusParams.status" size="large">
                <Radio :label="1">有效会话</Radio>
                <Radio :label="0">无效会话</Radio>
            </RadioGroup>
            <div slot="footer">
                <Button @click="taskStatusModal=false">取消</Button>
                <Button type="primary" :loading="taskStatusLoading" @click="handleChangeStatus">确定</Button></Button>
            </div>
        </Modal>

        <!-- 查看文章 -->
        <Modal
            v-model="articleListModal"
            title="查看文章"
            :mask-closable="false"
            transfer>
            <Spin size="large" fix v-if="showSpin"></Spin>
            <ul class="xhs_chat_article_wrap">
                <li v-for="(item, index) in articleData" :key="item.id+index">
                    <p>{{item.title}}</p>
                    <a :href="item.link" target="_blank">{{item.link}}</a>
                </li>
            </ul>
            <Page :total="articleTotal" show-total @on-change="changeArticleNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="articleListModal=false">取消</Button>
                <Button type="primary" @click="articleListModal=false">确定</Button></Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { getScreenBloggerList, getScreenChatList, getScreenChatLog, screenReplymsg, screenChatRemark, 
        screenChatRemarkLog, screenRewriteChat, screenChatArticleList } from '@/libs/api';
import { getUserList, beyondSize, ImgEmoji, userAuthority } from '@/mixins/mixin';
import datePicker from '@/views/my-components/date-picker/date-picker';
import showTableHead from '@/views/my-components/show-table-head/table'; 
export default {
    mixins: [getUserList, beyondSize, ImgEmoji, userAuthority],
    data(){
        return{
            params: {status: 1},
            bloggerList: [],        //博主账号列表
            tabLoading: false,
            resData: [],
            totalCount: 0,         //账号列表 总条数
            action: '',            //上传图片路径
            isShowIcon: false,     //表情框
            msgContent: '',        //发送的消息内容
            chatContent: [         //消息列表
            ],       
            showLargeImg: false,
            largeImg: '',
            styles: {
                height: 'calc(100% - 140px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            msgTotalCount: 100,         //消息列表 总条数
            taskStatusModal: false,     //会话状态 modal
            chatStatusParams: {
                status: 1,              //会话状态 默认有效
            },
            taskStatusLoading: false,   //修改会话状态 提交 loading
            columnsData: [
                {
                    key: 'name',
                    title: '账号',
                    minWidth: 200, 
                    show: true
                },
                {
                    key: '',
                    title: '回复',
                    minWidth: 80,
                    show: true,
                    render: (h, params) => {
                        return h('Badge', {
                            props: {
                                dot: params.row.point ? true : false,
                            },
                        }, [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: ()=> {
                                        this.taskData = params.row;
                                        this.sponsorChat();
                                    }
                                }
                            }, '点击回复')
                        ])
                    }
                },
                {
                    key: 'last_chat_time',
                    title: '最后一次消息时间',
                    minWidth: 80,
                    show: true,
                },
                {
                    key: 'nickname',
                    title: '博主账号',
                    minWidth: 80,
                    show: true,
                    render: (h, params)=> {
                        return h('a', {
                            attrs:{
                                href: params.row.link,
                                target: '_blank'
                            },
                        }, params.row.nickname)
                    }
                },
                {
                    key: 'article',
                    title: '查看文章',
                    minWidth: 60,
                    show: true,
                    render: (h, params) => {
                        return h('a', {
                            attrs: {
                                href: 'javascript:;'
                            },
                            on: {
                                click: ()=> {
                                    this.articleParams.xhs_id = params.row.xhs_id;
                                    this.articleListModal = true;
                                    this.getArticleList();
                                }
                            }
                        }, '查看文章')
                    }
                },
                {
                    key: 'member_name',
                    title: '用户名',
                    minWidth: 60,
                    show: true,
                },
                {
                    key: 'sale_name',
                    title: '销售',
                    minWidth: 60,
                    show: !this.isAuth([2]),
                },
                {
                    key: 'sale_name',
                    title: '对话状态',
                    width: 100,
                    show: true,
                    render: (h, params) => {
                        return h('div', {
                            on: {
                                click: () => {
                                    this.chatStatusParams.id = params.row.id;
                                    this.taskStatusModal = true;
                                }
                            }
                        },[
                            h('span', {
                                style: {
                                    color: params.row.status?'green':'red'
                                }
                            }, params.row.status?'有效会话':'无效会话'),
                            h('Icon', {
                                props: {
                                    type: 'md-settings',
                                    size: 16
                                },
                                style: {
                                    color: '#2b85e4',
                                    cursor: 'pointer',
                                    verticalAlign: 'top',
                                    marginLeft: '8px'
                                }
                            })
                        ]) 
                    }
                },
                {
                    key: '',
                    title: '备注说明',
                    minWidth: 80,
                    show: true,
                    render:(h, params) => {
                        return h('a', {
                            attrs:{
                                href: 'javascript:;'
                            },
                            on:{
                                click: () =>{
                                    this.remarkLog(params.row.id);
                                }
                            }
                        }, params.row.remark || '暂无备注~')
                    }
                },
            ],
            sendChatDrawer: false,       //回复消息
            showSpin: false,
            taskData: {},                //当前会话信息
            chatPage: 1,                 //聊天记录 分页
            loadMore: false,             //聊天记录 加载更多 loading
            reaceTop: 0,                 //聊天窗口 加载更多前的 滚动条高度
            showRemarks: false,          //备注 modal
            remarkParams: {},            //备注参数
            remarkLogData: [],           //备注日志
            msgListTimer: '',            //账户列表定时器
            chatTimer: '',               //打开回复消息 定时器
            articleListModal: false,     //查看文章列表
            articleParams: {},          //查看文章 参数  xhs_id
            articleData: [],            //文章列表
            articleTotal: 0,            //文章总数
            showSpin: false,            
        }
    },
    mounted() {
        clearInterval(this.timer);
        clearInterval(this.chatTimer);
        this.msgListTimer = setInterval(() => {
            this.init(); 
        }, 60000*5);
        this.init(); 
        this.getBloggerList();
        this.getBaPingUserList();
    },
    methods: {
        //消息列表
        init(){
            this.tabLoading = true;
            getScreenChatList(this.params).then(res => {
                this.tabLoading = false;
                if(res.code == 200){
                    this.resData = res.data.list;
                    this.totalCount = res.data.totalCount;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //选择消息时间
        selectCreateTime(date){
            this.params.created_start = date.createTimeStart;
            this.params.created_end = date.createTimeEnd;
            this.searchData();
        },  

        //选择小红书图片表情
        selectXhsImg(name){
            this.msgContent = this.msgContent + name;
        },

        //选择小红书emoji
        selectXhsEmoji(name){
            this.msgContent = this.msgContent + name;
        },

        //上传图片 成功
        imageSuccess(res){
            if(res.code == 200){
                this.$Notice.success({ title: res.message });
            }else{
                this.$Notice.error({ title: res.message });
            }
        },

        //发送消息
        sendMsgBtn(){
            let message = this.msgContent;
            let index = this.chatContent.length;
            for (var i = 0; i < this.emojiImg.length; i++) {
                if (!this.msgContent) return;
                let img = `<img src="//ci.xiaohongshu.com/xy_emo_${this.emojiImg[i].label}.png?v=2" class="shubaobao-expression" width="18" heihgt="18">`;
                message = message.replace(new RegExp('\\' + this.emojiImg[i].value, 'g'), img);
            }

            this.chatContent.push({
                chat_time: this.getNowFormatDate(),
                content: message,
                send_status: 'loading'
            })
            this.isShowIcon = false;
            this.chatWindBottom();
            this.handleSendMsg(message, index);
        },

        //发送消息  接口
        handleSendMsg(message, index){
            let data = {
                task_id: this.taskData.task_id,
                content: this.msgContent,
                index: index
            }
            this.msgContent = '';
            screenReplymsg(data).then(res => {
                let str = this.chatContent[index];
                if(res.code == 200){
                    str.send_status = 'success';
                    this.$set(this.chatContent, index, str);
                    this.reaceTop = 0;
                    this.chatContent = [];
                    this.chatPage = 1;
                    this.getChatLog();
                }else{
                    str.send_status = 'error';
                    this.$set(this.chatContent, index, str);
                }
            })
        },

        //搜索
        searchData(){
            this.params.page = 1;
            this.init();
        },

        //加载博主账号列表
        getBloggerList(){
            getScreenBloggerList().then(res => {
                if(res.code == 200){
                    this.bloggerList = res.data;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //发起会话
        sponsorChat(){
            this.sendChatDrawer = true;
            this.showSpin = true;
            this.reaceTop = 0;
            this.chatContent = [];
            this.chatPage = 1;
            this.getChatLog();
            this.chatTimer = setInterval(() => {
                this.getChatLog();
                this.chatPage = 1;
            }, 60000*5)
            //清除未回复消息状态
            if(this.taskData.point == 1){
                this.$store.commit('setChatNum', this.$store.state.app.chatNoReplyNum - 1);
                this.taskData.point = 0;
            }
        },

        //关闭聊天窗口
        closeChatBox(){
            clearInterval(this.chatTimer);
        },

        //加载 会话 聊天记录列表
        getChatLog(type){
            let data = {
                task_id: this.taskData.task_id,
                page: this.chatPage
            }
            getScreenChatLog(data).then(res => {
                if(res.code == 200){
                    if(this.chatPage == 1){
                        this.chatContent = [];
                    }
                    res.data.list.forEach((v) => {
                        this.chatContent.unshift(this.emojiReplace(v));
                    })
                    this.msgTotalCount = res.data.totalCount;
                    this.loadMore = false;
                    this.chatWindBottom(type);
                    this.showSpin = false;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //点击 加载更多聊天记录
        loadMoreChatLog(){
            this.chatPage = this.chatPage + 1;
            this.loadMore = true;
            this.reaceTop = document.querySelector('.ivu-drawer-body').scrollHeight;
            this.getChatLog('more');
        },

        //聊天窗口滚动条到底部
        chatWindBottom(type){
            this.$nextTick(() => {
                if(document.querySelector('.ivu-drawer-body')){
                    var h = document.querySelector('.ivu-drawer-body');
                    if(type == 'more'){
                        h.scrollTop  = h.scrollHeight - this.reaceTop;
                    }else{
                        h.scrollTop  = h.scrollHeight+30;
                    }
                }
            })
        },

        //emoji 替换图片
        emojiReplace(data){
            this.emojiImg.forEach((v, i) => {
                let img = `<img src="//ci.xiaohongshu.com/xy_emo_${v.label}.png?v=2" class="shubaobao-expression" width="18" heihgt="18">`;
                data.content = data.content.replace(new RegExp('\\' + v.value, 'g'), img);
            })
            return data;
        },

        //发送消息 时间
        getNowFormatDate() {
            var date = new Date(),
            h = date.getHours() < 9 ? "0" + date.getHours() : date.getHours(),
            m = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes();
            var currentdate = h + ":" + m
            return currentdate;
        },

        //查看备注日志
        remarkLog(id){
            this.remarkParams = {id: id};       
            screenChatRemarkLog({id: id}).then(res => {
                if(res.code == 200){
                    this.remarkLogData = res.data;
                    this.showRemarks = true;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //添加备注
        addRemarkBtn(){
            if(!this.remarkParams.remark){
                this.showRemarks = false;
                return
            }
            screenChatRemark(this.remarkParams).then(res =>{
                if(res.code == 200){
                    this.showRemarks = false;
                    this.$Notice.success({title: res.message});
                    this.init();
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //设置为 无效会话
        changTaskStatus(id){
            this.$Modal.confirm({
                title: '确定设置为无效会话?',
                onOk: () => {
                    
                },
                onCancel: () => {
                    
                }
            });
        },

        //设置会话状态  有效1 无效0
        handleChangeStatus(){
            this.taskStatusLoading = true;
            screenRewriteChat(this.chatStatusParams).then(res => {
                this.taskStatusLoading = false;
                if(res.code == 200){
                    this.$Notice.success({title: res.message});
                    this.taskStatusModal = false;
                    this.init();
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看文章
        getArticleList(){
            this.showSpin = true;
            screenChatArticleList(this.articleParams).then(res => {
                this.showSpin = false;
                if(res.code == 200){
                    this.articleData = res.data.list;
                    this.articleTotal = res.data.totalCount;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //查看文章 分页
        changeArticleNum(page){
            this.articleParams.page = page;
            this.getArticleList();
        },

        //页码
        changeNum(page){
            this.params.page = page;
            this.init();
        },

        changeSize(size){
            this.params.per_page = size;
            this.init();
        }
    },
    destroyed(){
        clearInterval(this.msgListTimer);
        clearInterval(this.chatTimer);
    },
    components:{
        datePicker, 
        showTableHead
    }
}
</script>
<style lang="less">
    .xhs_chat_article_wrap{
        li{
            padding: 10px;
            list-style: none;
            border-bottom: 1px solid #e5e5e5;
            font-size: 14px;
            &:last-child{
                border: none;
            }
        }
    }
    .xhs_chat{
        .ivu-table-cell{
            overflow: initial;
        }
    }
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
    .screen_msg_content{
        .more_chat{
            text-align: center;
            line-height: 20px;
            a{
                text-decoration: underline;
            }
        }
        .msg_list{
            margin-bottom: 20px;
            .date{
                font-size: 12px;
                color: #b2b2b2;
            }
            .content{
                display: inline-block;
                max-width: 80%;
                word-break: break-all;
                padding: 5px 10px;
                line-height: 24px;
                border-radius: 3px;
                position: relative;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 -1px 1px 0 rgba(0, 0, 0, 0.2) inset;
                img{
                    display: inline-block;
                    vertical-align: middle;
                    margin-top: -4px;
                }
            }
            &.customer_msg{
                text-align: left;
                .content{
                    background: #e7f4ff;
                    .img_wrap{
                        max-width: 100px;
                        max-height: 150px;
                        overflow: hidden;
                        img{
                            max-width: 100px;
                            cursor: pointer;
                        }
                    }
                }
            }
            &.my_msg{
                text-align: right;
                .msg_status{
                    display: inline-block;
                    margin-right: 5px;
                }
                .content{
                    background: #f0f1f3;
                    text-align: left;
                }
                .is_read{
                    color: #999;
                }
                .error{
                    color: red;
                }
            }
        }
    }
    .ivu-poptip,.ivu-poptip-rel{
        width: 100%;
    }
    .textareaBox{
        .func{
            text-align: left;
            i{
                font-size: 20px;
                color: #666;
            }
        }
        .textarea{
            textarea{
                border: none;
                outline:none;
                resize:none
            }
            .ivu-input:focus{
                box-shadow:none !important;
            }
        }
        .emojiWrap{
            width:300px;
            height:150px;
            overflow-x: auto;
            border:1px solid #e5e5e5;
            position: absolute;
            top:-155px;
            left:0;
            background:#fff;
            padding:10px;
            box-shadow: 0 2px 10px 2px #ccd5d8;
            z-index: 100;
            a{
                padding:8px;
                &.xhs_emoji{
                    display: inline-block;
                }
            }
        }
    }
</style>
