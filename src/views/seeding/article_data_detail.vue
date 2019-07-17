<template>
    <div>
        <div>
            <Card style="margin-bottom:20px">
                <p slot="title">
                    文章数据
                </p>
                <Row>
                    <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                        <FormItem label="标题">
                            <Input v-model="params.title" clearable placeholder="请输入标题" style="width: 200px" @on-change="serchData" />
                        </FormItem>
                        <FormItem label="链接">
                            <Input v-model="params.link" clearable placeholder="请输入链接" style="width: 200px" @on-change="serchData" />
                        </FormItem>
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
                        <FormItem label="评论:">
                            <Select v-model="params.has_comment" clearable style="width:200px" @on-change="serchData">
                                <Option :value="1">有评论</Option>
                                <Option :value="0">无评论</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="总评论条数:">
                            <Input class="section" type="number" v-model="params.change_comment" clearable style="width:200px" @on-change="serchData"></Input>
                        </FormItem>
                        <FormItem label="回链日期">
                            <date-picker @changeTime="selectCreateTime"></date-picker>
                        </FormItem>
                    </Form>
                    <div class="button_wrap">
                        <Button icon="md-arrow-round-down" @click="downLoadBtn" v-if="isAuth([1,5,6])">下载</Button>
                        <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
                    </div>
                </Row>
            </Card>
            <Card>
                <Row class="searchable-table-con1">
                    <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                </Row>
            </Card>

            <Modal title="截图" v-model="imgModal">
                <img :src="imgName" v-if="imgModal" style="width: 100%">
            </Modal>

        </div>
    </div>
</template>
<script>
    import { seedingArticleData, seedingAritcle, seedingCustomList } from '@/libs/api';
    import { url, userAuthority, getUserList, downloadingTools } from '@/mixins/mixin';
    import datePicker from '@/views/my-components/date-picker/date-picker';
    export default {
        mixins: [userAuthority, getUserList, downloadingTools],
        data(){
            return{
                tabLoading: false,
                resData: [],
                totalCount: 0,
                marketData: [],              //营销顾问 
                saleData: [],                //销售
                params: {},          
                imgModal: false,             //查看大图 modal
                imgName: '',                 //查看大图 url
                customerList: [],            //用户列表
                columnsData: [
                    {
                        key: 'order_title',
                        title: '定制标题',
                        minWidth: 80, 
                    },
                    {
                        key: 'title',
                        title: '文章标题',
                        minWidth: 80, 
                    },
                    {
                        key: 'link',
                        title: '链接',
                        minWidth: 80, 
                    },
                    {
                        key: 'username',
                        title: '用户',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: 'online_pic',
                        title: '是否收录',
                        minWidth: 60, 
                        render: (h, params) => {
                            let color = "green";
                            if(!params.row.online_pic) color = 'red';
                            return h('span', {
                                style:{
                                    color: color
                                }
                            }, params.row.online_pic ? '是': '否')
                        }
                    },
                    {
                        key: '',
                        title: '收藏 / 点赞 / 评论',
                        minWidth: 100, 
                        render: (h, params) => {
                            return h('div', [
                                 h('p',[
                                    h('span','收藏:  '),
                                    h('span', params.row.star)
                                ]),
                                h('p',[
                                    h('span','点赞:  '),
                                    h('span', params.row.like)
                                ]),
                                h('p',[
                                    h('span','评论:  '),
                                    h('span', params.row.comment)
                                ]),
                            ])
                        } 
                    },
                    {
                        key: '',
                        title: '博主信息',
                        minWidth: 100, 
                        render: (h, params) => {
                            return h('div', [
                                 h('p',[
                                    // h('span','账号名称:  '),
                                    h('span', params.row.blogger)
                                ]),
                            ])
                        } 
                    },
                    {
                        key: '',
                        title: '博主相关数据',
                        minWidth: 100, 
                        render: (h, params) => {
                            return h('div', [
                                 h('p',[
                                    // h('span','账号名称:  '),  笔记 粉丝 点赞收藏
                                    h('span', params.row.blogger)
                                ]),
                                h('p', `笔记：${params.row.notes}`),
                                h('p', `粉丝：${params.row.fans}`),
                                h('p', `收藏与点赞：${params.row.collected}`)
                            ])
                        } 
                    },
                    
                    {
                        key: 'online_time',
                        title: '回链日期',
                        minWidth: 60, 
                    },
                ],
            }
        },
        mounted() {
            this.init();
            this.getCustomList();
            this.loadSaleList();
            this.loadMarketList();
        },
        methods: {
            //加载列表
            init(){
                this.tabLoading = true;
                seedingArticleData(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },
            
            //回链日期
            selectCreateTime(date){
                this.params.finish_start = date.createTimeStart;
                this.params.finish_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //列表下载
            downLoadBtn(type){
                var down = {export: 2};
                getSeedingPubList(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding?', this.params, res);
                });
            },


            //数据详情下载
            downLoadDetail(){
                var down = {export: 2, id: this.detailId};
                seedingAritcle(down).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/seeding/seeding-article?', down, res);
                });
            },

            // 加载用户列表
            getCustomList(){
                seedingCustomList().then(res => {
                    if(res.code == 200){
                        this.customerList = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //搜索
            serchData(){
                this.params.page = 1;
                this.init();
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
            datePicker
        }
    }
</script>
<style lang="less" scoped>
    .detailModal{
        h3{
            display: inline-block;
        }
        .downLoadDetail{
            display: inline-block;
            margin-left:30px;
        }
    }
</style>
