<template>
    <div>
        <Card>
            <p slot="title">红薯账号管理</p>
             <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                <FormItem label="用户" v-if="!isAuth([2])">
                    <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="searchData">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="博主账号">
                    <Select v-model="params.blogger_id" filterable clearable style="width:200px" @on-change="searchData">
                        <Option v-for="(item, index) in bloggerList" :key="index" :value="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="博主链接">
                    <Input v-model="params.link" style="width:200px" placeholder="博主链接" @on-change="searchData"/>
                </FormItem>
                <FormItem label="关联手机号">
                    <Input v-model="params.mobile" style="width:200px" placeholder="关联手机号" @on-change="searchData"/>
                </FormItem>
                <FormItem label="注册日期">
                    <date-picker @changeTime="selectCreateTime"></date-picker>
                </FormItem>
             </Form>
             <div class="button_wrap">
                <Button icon="ios-search" type="primary" @click="searchData">搜索</Button>
            </div>
        </Card>
        <Card class="content">
            <div class="button_wrap">
                <Button type="primary" icon="md-add" @click="addParams={};registerData=[{}];addRegisterModal=true" v-if="isAuth([1,5,6])">添加注册信息</Button>
            </div>
            <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
        </Card>

        <!-- 添加注册信息 -->
        <Modal
            v-model="addRegisterModal"
            transfer
            :mask-closable="false"
            title="添加注册信息">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'">
                <FormItem label="选择用户">
                    <Select v-model="addParams.member_id" filterable clearable class="register_item">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <div v-for="(item, index) in registerData" :key="index">
                    <Divider orientation="left" dashed>
                        注册信息 <span v-if="index>0">({{index+1}})</span>
                    </Divider>
                    <FormItem label="性别">
                        <RadioGroup v-model="item.gender">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="生日">
                        <DatePicker type="date" placeholder="生日" class="register_item" @on-change="changeBirthday($event, index)"></DatePicker>
                    </FormItem>
                    <FormItem label="名字">
                        <Input placeholder="名字" v-model="item.nickname" class="register_item"/>
                    </FormItem>
                    <FormItem label="头像">
                        <div @mouseenter="action=befroUploadTime('api/v1/file/images')">
                            <div v-if="item.head_portrait" class="demo-upload-list">
                                <img :src="item.head_portrait">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="head_img=item.head_portrait;showHeadImg=true;"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                </div>
                            </div>
                            <Upload
                                v-else
                                ref="upload"
                                :show-upload-list="false"
                                :on-success="(value)=> handleSuccess(value, index)"
                                :format="['jpg','jpeg','png']"
                                :max-size="5120"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="exceededSize"
                                multiple
                                type="drag"
                                name="image"
                                :action="action"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </div>
                    </FormItem>
                    <FormItem label="常住地址">
                        <Input placeholder="常住地址" v-model="item.address" class="register_item"/>
                    </FormItem>
                    <FormItem label="个性签名">
                        <Input placeholder="个性签名" v-model="item.signature" class="register_item"/>
                    </FormItem>
                    <FormItem label=" ">
                        <a href="javascript:;" v-if="registerData.length==index+1" class="add_row_register" @click="newAddRegisteredBtn"><Icon size="20" color="#18b566" type="md-add-circle"/>新加注册信息</a>
                        <a href="javascript:;" v-if="registerData.length>1" class="add_row_register" @click="delRegisterBtn(index)"><Icon size="20" color="red" type="md-remove-circle"/>删除注册信息</a>
                    </FormItem> 
                </div>
            </Form>
            <div slot="footer">
                <Button @click="addRegisterModal=false">取消</Button>
                <Button type="primary" :loading="registerBtnLoading" @click="handleAddRegisterInfoBtn">确定</Button>
            </div>
        </Modal>

        <!-- 头像 大图 -->
        <Modal title="头像" v-model="showHeadImg">
            <img :src="head_img" style="width: 100%">
        </Modal>

        <!-- 预览注册信息 -->
        <Modal
            v-model="previewInfoModal"
            transfer
            :mask-closable="false"
            title="预览注册信息">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'">
                <FormItem label="用户名："><div>{{previewData.username}}</div></FormItem>
                <FormItem label="头像：">
                    <div v-if="previewData.head_portrait" class="demo-upload-list">
                        <img :src="previewData.head_portrait">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="head_img=previewData.head_portrait;showHeadImg=true;"></Icon>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="性别：">
                    <span v-if="previewData.gender==1">男</span>
                    <span v-if="previewData.gender==2">女</span>
                </FormItem>
                <FormItem label="生日："><div>{{previewData.birthday}}</div></FormItem>
                <FormItem label="名字："><div>{{previewData.nickname}}</div></FormItem>
                <FormItem label="常住地址："><div>{{previewData.address}}</div></FormItem>
                <FormItem label="个性签名："><div>{{previewData.signature}}</div></FormItem>
            </Form>
            <div slot="footer">
                <Button @click="previewInfoModal=false">取消</Button>
                <Button type="primary" @click="previewInfoModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看文章详情 -->
        <Modal
            v-model="articleInfoModal"
            transfer
            width="1100"
            :mask-closable="false"
            :title="articleInfoTitle">
            <Table stripe border :loading="articleInfoLoading" :columns="articleColumnsData" :data="articleResData"></Table>
            <Page :total="articleTotalCount" show-total @on-change="handleArticlePage" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="articleInfoModal=false">取消</Button>
                <Button type="primary" @click="articleInfoModal=false">确定</Button>
            </div>
        </Modal>

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

    </div>
</template>
<script>
    import { addBloggerInfo, getScreenAccountList, getScreenBloggerList, screenBloggerRemark, screenBloggerRemarkLog } from '@/libs/api';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    import { userAuthority, beyondSize, uploadApiEncrypt, getUserList } from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    export default {
        mixins: [userAuthority, beyondSize, uploadApiEncrypt, getUserList],
        data(){
            return {
                params: {},
                tabLoading: false,
                addRegisterModal: false,  //添加注册信息 modal
                registerBtnLoading: false,
                addParams: {},            //添加注册信息 参数
                registerData: [],       //新加注册信息
                showHeadImg: false,       //查看大图
                head_img: '',             //查看大图 头像地址
                addBloggerLoading: false,
                previewInfoModal: false,  //预览注册信息
                previewData: {},
                resData: [{}],            //账号列表
                totalCount: 0,            //账号总条数
                bloggerList: [],          //博主账号列表
                showRemarks: false,       //备注 modal
                remarkParams: {},         //备注参数
                remarkLogData: [],        //备注日志
                columnsData: [
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 60,
                        show: true
                    },
                    {
                        key: 'link',
                        title: '博主账号 / 链接',
                        minWidth: 100,
                        show: true,
                        render: (h, params) =>{
                            if(params.row.link){
                                return h('a', {
                                    attrs: {
                                        href: params.row.link,
                                        target: '_blank'
                                    }
                                }, params.row.nickname)
                            }else{
                                return h('span', params.row.nickname);
                            }
                        }
                    },
                    {
                        key: '',
                        title: '曝光数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) =>{
                            return h('div', [
                                h('p', `评论总数: ${params.row.comment}`),
                                h('p', `阅读量: ${params.row.read_num}`)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '相关数据',
                        minWidth: 120,
                        show: true,
                        render: (h, params) =>{
                            return h('div', [
                                h('p', `笔记: ${params.row.note}`),
                                h('p', `粉丝: ${params.row.fans}`),
                                h('p', `收藏点赞: ${params.row.collect}`)
                            ])
                        }
                    },
                    {
                        key: 'sign_time',
                        title: '注册日期',
                        minWidth: 100,
                        show: true
                    },
                    {
                        key: '',
                        title: '关联手机号',
                        minWidth: 100,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on:{
                                    click: () =>{
                                        this.previewData = params.row;
                                        this.previewInfoModal = true;
                                    }
                                }
                            }, params.row.mobile)
                        }
                    },
                    // {
                    //     key: '',
                    //     title: '查看文章详情',
                    //     minWidth: 100,
                    //     show: true,
                    //     render: (h, params) => {
                    //         return h('a', {
                    //             attrs: {
                    //                 href: 'javascript:;'
                    //             },
                    //             on: {
                    //                 click: ()=> {
                    //                     this.articleInfoTitle = params.row.nickname;
                    //                     this.articleInfoModal = true;
                    //                 }
                    //             }
                    //         }, '文章详情')
                    //     }
                    // },
                    {
                        key: '',
                        title: '备注说明',
                        minWidth: 100,
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
                action: this.encrypt(`api/v1/file/images`),                  //图片上传地址
                articlePage: 1,              //文章详情 分页
                articleInfoModal: false,     //文章详情 模态框
                articleInfoTitle: '',     
                articleInfoLoading: false,
                articleResData: [],          //文章详情 数据
                articleTotalCount: 0,        //文章详情 总条数
                articleColumnsData: [
                    {
                        key: '',
                        title: '标题 / 链接',
                        minWidth: 80
                    },
                    {
                        key: '',
                        title: '是否收录',
                        minWidth: 60,
                    },
                    {
                        key: '',
                        title: '关键词',
                        minWidth: 80
                    },
                    {
                        key: '',
                        title: '文章数据',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `收藏: `),
                                h('p', `点赞: `),
                                h('p', `评论: `)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '阅读量',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('p', `阅读量: `)
                            ])
                        }
                    },
                    {
                        key: '',
                        title: '查询日期',
                        minWidth: 80
                    },
                ]
            }
        },
        mounted() {
            this.init();
            this.getBaPingUserList();
            this.getBloggerList();
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                getScreenAccountList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //头像上传成功
            handleSuccess(res, index){
                if(res.code == 200){
                    this.registerData[index].head_portrait = res.data.url;
                    this.$set(this.registerData, index, this.registerData[index]);
                }else{
                    this.$Notice.error({ title: res.message });
                }
            },

            //删除头像
            handleRemove(index){
                this.registerData[index].head_portrait = '';
                this.$set(this.registerData, index, this.registerData[index]);
            },

            //注册日期日期
            selectCreateTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.searchData();
            },

            //点击 新加注册信息
            newAddRegisteredBtn(){
                this.registerData.push({});
            },

            //删除 一组注册信息
            delRegisterBtn(index){
                this.registerData.splice(index, 1);
            },

            //注册信息 - 选择生日
            changeBirthday(date, index){
                this.registerData[index].birthday = date;
            },

            //添加注册信息
            handleAddRegisterInfoBtn(){
                let flag = true;
                if(!this.addParams.member_id){
                    this.$Notice.warning({ title: '请选择用户~' });
                    return 
                }
                try {
                    this.registerData.forEach((v, index) => {
                        if(!v.gender || !v.nickname || !v.head_portrait || !v.address || !v.signature || !v.birthday){
                            flag = false;
                            this.$Notice.warning({ title: `Σ( ° △ °|||)︴ 第${index+1}个的${this.handleRegisterParams(v)}未填写`});
                            that.error();
                        }
                    })
                } catch (error) {
                    
                }
                this.addParams.blogger = this.registerData;
                if(!flag) return false;
                this.$Modal.confirm({
                    title: '确认信息填写无误吗?',
                    onOk: () => {
                        this.registerBtnLoading = true;
                        addBloggerInfo(this.addParams).then(res => {
                            this.registerBtnLoading = false;
                            if(res.code == 200){
                                this.addRegisterModal = false;
                                this.$Notice.success({ title: res.message });
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


            //注册信息 具体哪个未填写
            handleRegisterParams(data){
                let msg = '';
                if(!data.gender){
                    msg = '性别';
                }else if(!data.birthday){
                    msg = '生日';
                }else if(!data.nickname){
                    msg = '名字';
                }else if(!data.head_portrait){
                    msg = '头像';
                }else if(!data.address){
                    msg = '常住地址';
                }else if(!data.signature){
                    msg = '个性签名';
                }
                return msg;
            },
            
            //加载文章详情
            getArticleInfo(){

            },

            //文章详情 分页
            handleArticlePage(page){
                this.articlePage = page;
                this.getArticleInfo();
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

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                screenBloggerRemarkLog({id: id}).then(res => {
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
                screenBloggerRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
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
            datePicker,
            showTableHead
        }
    }
</script>
<style lang="less">
    .register_item{
        width: 300px;
    }
</style>
<style lang="less" scoped>
    .content{
        margin-top:10px;
    }
    .add_row_register{
        i{
            margin-right:8px;
            vertical-align: middle;
            margin-top:-4px;
        }
    }
</style>
