<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="noDataText"></Table>
                    <Page style="padding:10px" :total="totalCount" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                </div>
            </transition>
            <transition name="back-message-list">
                <div v-if="!showMesTitleList" class="message-view-content-con">
                    <div class="message-content-top-bar">
                        <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon type="md-return-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                        <h3 class="mes-title">{{ mes.title }}</h3>
                    </div>
                    <p class="mes-time-con"><Icon type="md-time"></Icon>&nbsp;&nbsp;{{ mes.createTime }}</p>
                    <div class="message-content-body">
                        <p class="message-content">{{ mes.content }}</p>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {getMessageList} from '@/libs/api';
export default {
    name: 'message_index',
    data () {
        const markAsreadBtn = (h, params) => {
            return h('Button', {
                props: {
                    size: 'small'
                },
                on: {
                    click: () => {
                        this.hasreadMesList.unshift(this.currentMesList.splice(params.index, 1)[0]);
                        this.$store.commit('setMessageCount', this.unreadMesList.length);
                    }
                }
            }, '标为已读');
        };
        return {
            currentMesList: [],
            unreadMesList: [],
            hasreadMesList: [],
            recyclebinList: [],
            currentMessageType: 'unread',
            showMesTitleList: true,
            unreadCount: 0,
            hasreadCount: 0,
            noDataText: '暂无未读消息',
            mes: {
                title: '',
                createTime: '',
                content: ''
            },
            mesTitleColumns: [
                {
                    title: '消息中心',
                    key: 'title',
                    align: 'left',
                    ellipsis: true,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.showMesTitleList = false;
                                    this.mes.title = params.row.notifyManager.title;
                                    this.mes.createTime = params.row.notifyManager.created_at;
                                    this.getContent(params.index);
                                }
                            }
                        }, params.row.notifyManager.title);
                    }
                },
                {
                    title: ' ',
                    key: 'content',
                    align: 'left',
                    render: (h, params) => {
                        return h('div', params.row.notifyManager.content);
                    }
                },
                {
                    title: ' ',
                    key: 'createTime',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'md-time',
                                    size: 12
                                },
                                style: {
                                    margin: '0 5px'
                                }
                            }),
                            h('span', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                }
                            }, params.row.notifyManager.created_at)
                        ]);
                    }
                }
            ],
            totalCount: 0,
            params: {},
        };
    },
    methods: {
        //加载列表
        init(){
            //获取消息列表
            getMessageList().then(res => {
                if(res.code == 200){
                    this.currentMesList = this.unreadMesList = res.data.list;
                    this.unreadCount = this.unreadMesList.length;
                    this.hasreadCount = this.hasreadMesList.length;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        backMesTitleList () {
            this.showMesTitleList = true;
        },
        setCurrentMesType (type) {
            if (this.currentMessageType !== type) {
                this.showMesTitleList = true;
            }
            this.currentMessageType = type;
            if (type === 'unread') {
                this.noDataText = '暂无未读消息';
                this.currentMesList = this.unreadMesList;
            } else if (type === 'hasread') {
                this.noDataText = '暂无已读消息';
                this.currentMesList = this.hasreadMesList;
            } else {
                this.noDataText = '回收站无消息';
                this.currentMesList = this.recyclebinList;
            }
        },
        getContent (index) {
            // you can write ajax request here to get message content
            let mesContent = '';

            this.mes.content = this.currentMesList[index].notifyManager.content;
        },

        //页码
        changeNum(page){
            this.params.page = page;
            this.init();
        },

        //每页多少条
        changeSize(size){
            this.params.per_page = size;
            this.init();
        }
    },
    mounted () {
        this.init();
    },
    watch: {
        unreadMesList (arr) {
            this.unreadCount = arr.length;
        },
        hasreadMesList (arr) {
            this.hasreadCount = arr.length;
        }
    }
};
</script>

