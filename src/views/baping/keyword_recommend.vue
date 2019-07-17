<template>
    <div>
        <Card>
            <p slot="title">霸屏关键词推荐</p>
            <Form :label-width="$store.state.app.isFromMobile?auto:60" :label-position="$store.state.app.isFromMobile?'top':'right'" inline >
                <FormItem label="关键词">
                    <Input class="input" filterable placeholder="输入关键词" v-model="params.keyword"></Input>
                </FormItem>
                <FormItem label="地区">
                    <Select v-model="province" filterable style="width:200px" @on-change="changeProvince">
                        <Option v-for="item in provinceData" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <Select v-model="regional" filterable style="width:200px" @on-change="changeRegional">
                        <Option v-for="item in regionalData" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div class="button_wrap">
                <Button icon="ios-search" type="primary" @click="searchBtn">搜索</Button>
                <Button icon="md-arrow-round-down" @click="downLoad">下载</Button>
            </div>
        </Card>
        <Card style="margin-top:20px;">
            <div class="button_wrap" v-if="isAuth([1])">
                <Button icon="md-add" type="primary" @click="keyword='';addKeywordModal=true;">添加关键词</Button>
                <Button icon="md-trash" type="error" @click="batchDelBtn">批量删除关键词</Button>
            </div>
            <Table stripe border :loading="tabLoading" :columns="columnsData" :data="resData" @on-selection-change="selectionChange"></Table>
            <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
        </Card>

        <!-- 添加关键词 -->
        <Modal
            v-model="addKeywordModal"
            transfer
            :mask-closable="false"
            title="添加关键词">
            <Input class="input" type="textarea" :rows="5" v-model="keyword" placeholder="【地区】关键词
添加关键词,一行一个"/>
            <div slot="footer">
                <Button @click="addKeywordModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="addKeywordBtn">确定</Button>
            </div>
        </Modal>

        <!-- 编辑关键词 -->
        <Modal
            v-model="editKeywordModal"
            transfer
            :mask-closable="false"
            title="编辑关键词">
            <Input v-model="editParams.keyword" style="width:300px"/>
            <div slot="footer">
                <Button @click="editKeywordModal=false">取消</Button>
                <Button type="primary" :loading="editBtnLoading" @click="editKeywordBtn">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import { userAuthority, downloadingTools, url } from '@/mixins/mixin';
    import { getScreenKeywordlibList, screenAddKeywordlib, delScreenKeywordlib, editScreenKeywordlib, getCity } from '@/libs/api';
    export default {
        mixins: [userAuthority, downloadingTools, url],
        data(){
            return {
                params: {},
                regionData: [],
                tabLoading: false,
                resData: [],
                totalCount: 0,
                addKeywordModal: false,       //添加关键词 modal
                btnLoading: false,
                keyword: '',                  //关键词
                ids: [],                      //已选中的 数据id
                province: '',
                regional: '',
                provinceData: [],             //省
                regionalData: [],             //市
                editKeywordModal: false,      //编辑关键词 modal
                editParams: {},
                editBtnLoading: false,
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: '',
                        title: '操作',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'success'
                                    },
                                    on: {
                                        click: () => {
                                            this.editParams = JSON.parse(JSON.stringify(params.row));
                                            this.editKeywordModal = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    style: {
                                        marginLeft: '8px'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.ids = [params.row.id];
                                            this.delKeyword();
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    },'删除')
                                ])
                            ])
                        }
                    },
                    {
                        key: 'keyword',
                        title: '关键词',
                        minWidth: 200
                    },
                ],
            }
        },
        mounted() {
            this.getCityList();
        },
        methods: {
            //加载关键词列表
            init(){
                this.tabLoading = true;
                getScreenKeywordlibList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //多选
            selectionChange(data){
                this.ids = [];
                this.taskList = data;
                data.forEach(v => {
                    this.ids.push(v.id);
                })
            },

            //添加关键词
            addKeywordBtn(){
                this.btnLoading = true;
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
                let data = {
                    keyword: keyword.length>0 ? keyword : [this.keyword]
                }
                screenAddKeywordlib(data).then(res => {
                    this.btnLoading = false;
                    if(res.code == 200){
                        this.init();
                        this.addKeywordModal = false;
                        this.$Notice.success({ title: res.message });
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //编辑关键词
            editKeywordBtn(){   
                if(!this.editParams.keyword){
                    this.$Notice.warning({ title: '请填写关键词~' });
                    return 
                }
                this.editBtnLoading = true;
                editScreenKeywordlib(this.editParams).then(res => {
                    this.editBtnLoading = false;
                    if(res.code == 200){
                        this.editKeywordModal = false;
                        this.$Notice.success({ title: res.message });
                        this.init();
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },  

            //批量删除
            batchDelBtn(){
                if(this.ids.length==0){
                    this.$Notice.warning({ title: '请选择要删除的关键词~' });
                    return 
                }
                this.$Modal.confirm({
                    title: '确定要删除选中的关键词吗?',
                    onOk: () => {
                        this.delKeyword();
                    },
                    onCancel: () => {

                    }
                });
            },

            //删除
            delKeyword(){
                delScreenKeywordlib({ids: this.ids}).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({ title: res.message });
                        this.init();
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //选择省
            changeProvince(){
                this.getCityList(this.province, 'province');
                this.regional = '';
            },
            
            //选择市
            changeRegional(){
                if(this.regional){
                    this.getCityList(this.regional);
                }
            },

            //地区
            getCityList(pid, type){     
                let data = {
                    pid: pid
                }
                getCity(data).then(res => {
                    if(res.code == 200){
                        if(this.provinceData.length==0){
                            this.provinceData = res.data;
                            this.province = res.data[0].id;
                            this.getCityList(res.data[0].id, 'province');
                        }
                        if(type== 'province'){
                            this.regionalData = res.data;
                        }
                        if(data.pid){
                            this.params.location = data.pid;
                            this.searchBtn();
                        }
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //下载
            downLoad(){
                var down = {export: 2};
                getScreenKeywordlibList(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/screen/keyword-lib?', this.params, res);
                });
            },

            //搜索
            searchBtn(){
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
    }
</script>

