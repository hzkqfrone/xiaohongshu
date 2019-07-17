<template>
    <div>
        <div v-if="!showPubPage">
            <Card style="margin-bottom:20px">
                <p slot="title">
                    霸屏素材库
                </p>
                <Row>
                    <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                        <FormItem label="标题">
                            <Input v-model="params.title" clearable placeholder="请输入标题" style="width: 200px" @on-change="searchData" />
                        </FormItem>
                        <FormItem label="用户" v-if="!isAuth([2])">
                            <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="searchData();changeMember();">
                                <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="博主账号">
                            <Select v-model="params.blogger_id" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in bloggerList" :key="index" :value="item.id">{{item.nickname}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择营销顾问" v-if="!isAuth([2])">
                            <Select v-model="params.market" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in marketData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择销售" v-if="!isAuth([2])">
                            <Select v-model="params.sale" filterable clearable style="width:200px" @on-change="searchData">
                                <Option v-for="(item, index) in saleData" :key="index" :value="item.id">{{item.username}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态:">
                            <Select v-model="params.status" clearable style="width:200px" @on-change="searchData">
                                <Option :value="0">未发布</Option>
                                <Option :value="1">已发布</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="创建日期">
                            <date-picker @changeTime="selectCreateTime"></date-picker>
                        </FormItem>
                        <FormItem label="完成日期">
                            <date-picker @changeTime="selectPubTime"></date-picker>
                        </FormItem>
                    </Form>
                    <div class="button_wrap">
                        <Button icon="ios-search" type="primary" @click="searchData">搜索</Button>
                    </div>
                </Row>
            </Card>
            <Card>
                <Row class="searchable-table-con1">
                    <div class="button_wrap">
                        <Button icon="md-add" type="primary" @click="editId='';showPubPage=true">添加素材</Button>
                        <div class="publish_count">
                            <Tag type="border" color="#2c8df2">今日提交代写需求 {{publishCount.today}} 篇</Tag>
                            <Tag type="border" color="#2c8df2">昨天提交代写需求 {{publishCount.yesterday}} 篇</Tag>
                            <Tag type="border" color="#2c8df2">目前总提交代写需求 {{publishCount.total}} 篇</Tag>
                        </div>
                    </div>
                    <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                </Row>
            </Card>
        </div>

        <!-- 添加备注 showRemarks -->
        <Modal
            v-model="showRemarks"
            transfer
            :mask-closable="false"
            title="备注">
            <Form label-position="top">
                <FormItem label="备注" v-if="isAuth([1,5,6])">
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

        <!-- 预览 -->
        <Modal 
            width="600"
            transfer
            :title="previewData.title" 
            v-model="previewModal" class="previewData">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'left'">
                <FormItem label="标题："><div>{{previewData.title}}</div></FormItem>
                <FormItem label="用户："><div>{{previewData.member_name}}</div></FormItem>
                <FormItem label="博主账号："><div>{{previewData.blogger_name}}</div></FormItem>
                <FormItem label="关键词："><div><Tag v-for="(item, index) in previewData.keywords" :key="index">{{item}}</Tag></div></FormItem>
                <FormItem label="代写代发素材提交说明："><div>{{previewData.attention}}</div></FormItem>
                <FormItem label="客户咨询建议博主回复什么："><div>{{previewData.note}}</div></FormItem>
                <FormItem label="完成日期："><div>{{previewData.finish_time}}</div></FormItem>
                <FormItem label="图片：">
                    <div class="demo-upload-list" v-for="(item, index) in previewData.images" :key="index">
                        <img :src="item">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="附件：">
                    <p class="attachment" v-for="(item, index) in previewData.attachment" :key="index"><a :href="item" target="_blank"><Tag>{{item}}</Tag></a></p>
                </FormItem>
            </Form>
        </Modal>

        <!-- 查看大图 -->
        <Modal title="图片" v-model="imgModal">
            <img :src="imgName" v-if="imgModal" style="width: 100%">
        </Modal>

        <!-- 已上传的图片 -->
        <Modal title="图片" v-model="imagesModal">
            <div class="demo-upload-list" v-for="(item, index) in images" :key="index">
                <img :src="item">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
            </div>
            <div v-if="images.length == 0">
                暂无图片~
            </div>
        </Modal>

        <!-- 添加素材 编辑 -->
        <add-library v-if="showPubPage" :editId="editId" @hideAddLibrary="showPubPage=false, init()"></add-library>
    </div>
</template>
<script>
    import addLibrary from '@/views/baping/components/add_library';
    import { getScreenMaterial, screenMaterialRemark, screenMaterialRemarkLog, getScreenMaterialDetail, screenMaterialCopy,
             getScreenBloggerList, getUserInBloggerList } from '@/libs/api';
    import { url, userAuthority, getUserList } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [userAuthority, getUserList],
        data(){
            return{
                showPubPage: false,
                tabLoading: false,
                resData: [],
                publishCount: {},     //今日提交代写需求：  篇     昨天提交代写需求：  篇    目前总提交代写需 篇
                totalCount: 0,
                editId: '',             //编辑 发布 id
                marketData: [],         //营销顾问 
                saleData: [],           //销售
                params: {},          
                imgModal: false,        //查看大图 modal
                imgName: '',            //查看大图 url
                showRemarks: false,     //备注 modal
                remarkParams: {},       //备注参数
                remarkLogData: [],      //备注日志
                previewModal: false,    //预览
                previewData: {},        //预览素材 数据
                images: [],             //已上传的图片
                imagesModal: false,     //已上传的图片 modal
                bloggerList: [],        //博主账号列表
                columnsData: [
                    {
                        key: '',
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let arr = [];
                            if(params.row.status == 0){
                                arr.push(h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small',
                                        },
                                        on: {
                                            click: () => {
                                                this.editId = params.row.id;
                                                this.showPubPage = true;
                                            }
                                        }
                                    }, '编辑')
                                )
                            }else{
                                arr.push(h('span', '已发布'));
                            }
                            arr.push(h('Button',{
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.copyParams = {copy_id: params.row.id};
                                        this.copyArticle();
                                    }
                                }
                            }, '复制'))
                            return h('div', arr);
                        } 
                    },
                    {
                        key: 'member_name',
                        title: '用户',
                        minWidth: 80, 
                    },
                    {
                        key: 'blogger_name',
                        title: '博主账号',
                        minWidth: 60, 
                    },
                    {
                        key: 'title',
                        title: '素材标题',
                        minWidth: 80, 
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: ()=> {
                                        this.preview(params.row.id);
                                    }
                                }
                            }, params.row.title)
                        }
                    },
                    {
                        key: 'img_count',
                        title: '已上传图片数量',
                        minWidth: 50, 
                        render: (h, params) => {
                            return h('a',{
                                attrs:{
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.images = params.row.images;
                                        this.imagesModal = true;
                                    }
                                }
                            }, params.row.img_count)
                        }
                    },
                    {
                        key: 'created_at',
                        title: '添加日期',
                        minWidth: 80, 
                    },
                    {
                        key: 'status_name',
                        title: '状态',
                        minWidth: 80, 
                    },
                    {
                        key: '',
                        title: '备注说明',
                        minWidth: 60, 
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
            }
        },
        mounted() {
            this.init();
            this.getBaPingUserList();
            this.loadSaleList();
            this.loadMarketList();
            this.getBloggerList();
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                getScreenMaterial(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.publishCount = res.data.publish_count
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                screenMaterialRemarkLog({id: id}).then(res => {
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
                screenMaterialRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //预览
            preview(id){
                getScreenMaterialDetail(id).then(res => {
                    if(res.code == 200){
                        this.previewModal = true;
                        this.previewData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //预览 查看大图
            handleView (name) {
                this.imgName = name;
                this.imgModal = true;
            },

            //复制稿件
            copyArticle(){
                this.$Modal.confirm({
                    title: '确定要复制稿件吗?',
                    onOk: () => {
                        screenMaterialCopy(this.copyParams).then(res => {
                            if(res.code == 200){
                                this.$Notice.success({ title: res.message });
                                this.params.page = 1;
                                this.init();
                            }else{
                                this.$Notice.error({ title: res.message });
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
            },
            
            //创建日期
            selectCreateTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.searchData();
            },

            //完成日期
            selectPubTime(date){
                this.params.finish_start = date.createTimeStart;
                this.params.finish_end = date.createTimeEnd;
                this.searchData();
            },

            //筛选 -  选择用户 显示对应的 博主账号
            changeMember(){
                if(this.params.member_id){
                    getUserInBloggerList({member_id: this.params.member_id}).then(res => {
                        if(res.code == 200){
                            this.bloggerList = res.data;
                        }else{
                            this.$Notice.error({title: res.message});
                        }
                    })
                }
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
        components:{
            addLibrary,
            datePicker
        }
    }
</script>
<style lang="less" scoped>
    .attachment .ivu-tag{
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .button_wrap{
        .publish_count{
            display: inline-block;
            vertical-align: top;
            margin-left: 10px;
        }
    }
</style>
<style lang="less">
    .previewData{
        .ivu-form-item-label{
            font-weight: bold !important;
        }
    }
</style>
