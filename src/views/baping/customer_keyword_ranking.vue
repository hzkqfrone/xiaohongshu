<template>
    <div>
        <Card>
            <p slot="title">客户关键词排名统计</p>
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                <FormItem label="用户" v-if="!isAuth([2])">
                    <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="serchData">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择营销顾问" v-if="!isAuth([2])">
                    <Select v-model="params.market" filterable clearable style="width:200px" @on-change="serchData">
                        <Option v-for="(item, index) in marketData" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择销售" v-if="!isAuth([2])">
                    <Select v-model="params.sale" filterable clearable style="width:200px" @on-change="serchData">
                        <Option v-for="(item, index) in saleData" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="关键词">
                    <Input v-model="params.keyword" clearable placeholder="请输入关键词" style="width: 200px" @on-change="serchData" />
                </FormItem>
                <FormItem label="有无排名">
                    <Select v-model="params.has_rank" filterable clearable style="width:200px" @on-change="serchData">
                        <Option :value="0">无排名</Option>
                        <Option :value="1">有排名</Option>
                    </Select>
                </FormItem>
                <FormItem label="覆盖条数">
                    <Input type="number" v-model="params.rank_min" clearable style="width: 100px" @on-change="serchData" /> - 
                    <Input type="number" v-model="params.rank_max" clearable style="width: 100px" @on-change="serchData" />
                </FormItem>
                <FormItem label="查询日期">
                    <date-picker @changeTime="selectSearchTime"></date-picker>
                </FormItem>
            </Form>
            <div class="button_wrap">
                <Button icon="md-arrow-round-down" @click="downLoadBtn" v-if="isAuth([2])">下载</Button>
                <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
            </div>
        </Card>

        <Card style="margin-top:20px">
            <div class="button_wrap">
                <Button type="primary" icon="md-add" @click="addParams={};addKeywordModal=true;"  v-if="isAuth([1, 5, 6])">添加关键词</Button>
            </div>
            <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize" class="pageTemplate"></Page>
        </Card>

        <!-- 添加关键词 -->
        <Modal
            title="添加关键词"
            :mask-closable="false"
            v-model="addKeywordModal"> 
            <Form label-position="top">
                <FormItem label="选择用户：">
                    <Select v-model="addParams.member_id" filterable clearable style="width:200px">
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="关键词：">
                    <Input type="textarea" v-model="keyword" :rows="6" placeholder="一行一个关键词" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addKeywordModal=false">取消</Button>
                <Button type="primary" :loading="addKeywordLoading" @click="handleAddKeywordBtn">确定</Button>
            </div>
        </Modal>

        <!-- 编辑 -->
        <Modal
            title="编辑"
            :mask-closable="false"
            v-model="editModal"> 
            <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'">
                <FormItem label="用户名：">
                    <div>{{editParams.username}}</div>
                </FormItem>
                <FormItem label="关键词：">
                    <Input placeholder="关键词" v-model="editParams.keyword" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="editModal=false">取消</Button>
                <Button type="primary" @click="editModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看链接 -->
        <Modal
            title="查看链接"
            :mask-closable="false"
            v-model="linksModal"> 
            <ul>
                <li v-for="item in links" :key="item" style="padding-bottom: 10px">{{item}}</li>
            </ul>
            <div slot="footer">
                <Button @click="linksModal=false">取消</Button>
                <Button type="primary" @click="linksModal=false">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import { addScreenKeyword, getScreenKeywordList, delScreenKeyword } from '@/libs/api';
    import { getUserList, userAuthority, downloadingTools, url } from '@/mixins/mixin';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [getUserList, userAuthority, downloadingTools, url],
        data(){
            return {
                params: {},
                tabLoading: false,
                resData: [],           //数据列表
                totalCount: 0,          //数据总条数
                addKeywordModal: false, //添加关键词 模态框
                addKeywordLoading: false,
                addParams: {},          //添加关键词 参数、
                keyword: '',            //关键词
                editParams: {},         //编辑
                links: [],              //覆盖条数 查看链接
                linksModal: false,     //查看链接 modal
                columnsData: [
                    {
                        key: '',
                        title: '操作',
                        minWidth: 120,
                        show: this.isAuth([1,5,6]),
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }, 
                                    on: {
                                        click: ()=> {
                                            this.editParams = params.row;
                                            this.editModal = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteKeyword(params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    },'删除')
                                ]),
                            ])
                        }
                    },
                    {
                        key: 'keyword',
                        title: '关键词',
                        minWidth: 80,
                        show: true,
                    }, 
                    {
                        key: 'rank',
                        title: '排名位置',
                        minWidth: 60,
                        show: true,
                    }, 
                    {
                        key: 'num',
                        title: '覆盖条数',
                        minWidth: 80,
                        show: true,
                        render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: 'javascript:;'
                                },
                                on: {
                                    click: () => {
                                        this.links = params.row.links;
                                        this.linksModal = true;
                                    }
                                }
                            }, params.row.num)
                        }
                    }, 
                    {
                        key: 'search_time',
                        title: '查询时间',
                        minWidth: 80,
                        show: true,
                    }, 
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 80,
                        show: true,
                    }, 
                    {
                        key: 'sale_name',
                        title: '销售',
                        minWidth: 80,
                        show: !this.isAuth([2]),
                    }, 
                    {
                        key: 'market_name',
                        title: '营销顾问',
                        minWidth: 80,
                        show: !this.isAuth([2]),
                    }, 
                ],
                editModal: false,          //编辑 模态框
            }
        },
        mounted() {
            this.init();
            this.loadSaleList();
            this.loadMarketList();
            this.getBaPingUserList();
        },
        methods: {
            init(){
                this.tabLoading = true;
                getScreenKeywordList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //添加关键词
            handleAddKeywordBtn(){
                if(!this.keyword){
                    this.$Notice.warning({ title: '请填写关键词~' });
                    return
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
                this.addParams.keyword = keyword.length>0 ? keyword : [this.keyword];
                this.addKeywordLoading = true;
                addScreenKeyword(this.addParams).then(res => {
                    this.addKeywordLoading = false;
                    if(res.code == 200){
                        this.init();
                        this.addKeywordModal = false;
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //查询日期
            selectSearchTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.serchData();
            },

            //搜索
            serchData(){
                this.params.page = 1;
                this.init();
            },

            //下载
            downLoadBtn(){
                // 贾大师说 -> member_id 写死的 是为了跟排名数据统计的导出用一个接口， 接口里面做了限制，只有客户才可以点击这个
                this.downLoadwj(url + 'api/v1/screen/data/export?', {member_id: 0}, {code: 200});
            },

            //删除
            deleteKeyword(id){
                delScreenKeyword(id).then(res =>{
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.init();
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
            showTableHead,
            datePicker
        }
    }
</script>
<style lang="less" scoped>
    .search_wrap{
        margin-bottom: 20px;
    }
</style>
