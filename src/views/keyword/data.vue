<template>
    <div class="manuscript">
        <Row :gutter="10">
            <Col>
                <Card style="margin-bottom:20px">
                    <p slot="title">
                        关键词排名合作数据
                    </p>
                    <Row>
                        <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="addContent" ref="params" inline>
                            <FormItem label="用户" v-if="!isAuth([2])">
                                <Select v-model="params.member_id" filterable clearable style="width:200px" @on-change="serchData(); getOther()">
                                    <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="合作类型">
                                <Select v-model="params.type" clearable style="width:200px" @on-change="serchData">
                                    <Option v-for="(item, index) in cooperationTypeData" :key="index" v-if="item.value>-1" :value="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="状态">
                                <Select v-model="params.status" clearable style="width:200px" @on-change="serchData">
                                    <Option :value="0">待审核</Option>
                                    <Option :value="1">已操作</Option>
                                    <Option :value="2">已上线</Option>
                                    <Option :value="3">已过期</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="有无排名">
                                <Select v-model="params.has_rank" clearable style="width:200px" @on-change="serchData">
                                    <Option :value="1">有排名</Option>
                                    <Option :value="0">无排名</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="关键词">
                                <Input v-model="params.keyword" clearable placeholder="请输入关键词" style="width: 200px" @on-change="serchData" />
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
                            <FormItem label="合作日期">
                                <date-picker @changeTime="selectHzTime"></date-picker>
                            </FormItem>
                            <FormItem label="上线日期">
                                <date-picker @changeTime="selectPubTime"></date-picker>
                            </FormItem>
                        </Form>
                        <div class="button_wrap">
                            <Button icon="md-arrow-round-down" @click="downLoadBtn">下载</Button>
                            <Button icon="ios-search" type="primary" @click="serchData">搜索</Button>
                        </div>
                    </Row>
                </Card>
                <Card class="articleWrapper">
                    <Alert type="warning">
                        <p>注意：从提交关键词就开始扣费，从上线日期算开始计费。</p>
                        <p>更新上线日期，均为包月价格，到期之后，需要重新更新上线日期，需要重新开始计费。</p>
                    </Alert>
                    <!-- 客户显示 -->
                    <Row class="statistics" v-if="isAuth([2]) || params.member_id">
                        <Tag type="border" color="blue">您目前总费用是: {{otherData[0]}} 元 </Tag>
                        <Tag type="border" color="blue">已消费总费用: {{otherData[1]}} 元 </Tag>
                        <Tag type="border" color="blue">余额：{{otherData[2]}} 元 </Tag>
                        <Button type="info" size="small" @click="showConsumeLog()">查看消费明细</Button>
                        <span style="color:red" v-if="otherData[2]<1">暂无余额，请及时充值</span>
                    </Row>
                    <!-- 内部员工显示 -->
                    <Row class="statistics" v-else>
                        <Tag type="border" color="blue">目前合作客户数量为：{{otherData[0]}}</Tag>
                        <Tag type="border" color="blue">合作总词数：{{otherData[1]}}</Tag>
                        <Tag type="border" color="blue">已上线词数: {{otherData[2]}}</Tag>
                        <Tag type="border" color="blue">已过期词数: {{otherData[3]}}</Tag>
                    </Row>
                    <Row class="button_wrap">
                        <Button type="primary" icon="md-add" v-if="isAuth([1,5,6])" @click="addModal=true, addParams={price:1}">添加</Button>
                        <Button type="success" icon="md-refresh" v-if="isAuth([1,5,6])" @click="showUpModalBtn">更新上线时间</Button>
                        <Button type="warning" icon="md-repeat" v-if="isAuth([1])" @click="fillTimeBtn">补时间</Button>
                        <Dropdown style="margin-left: 20px" v-if="isAuth([1])" @on-click="changeStatus">
                            <Button type="error" icon="ios-build">修改状态</Button>
                            <DropdownMenu slot="list">
                                <DropdownItem :name="0">待审核</DropdownItem>
                                <DropdownItem :name="1">已操作</DropdownItem>
                                <DropdownItem :name="2">已上线</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Row>
                    <Row class="searchable-table-con1">
                        <show-table-head :loading="tabLoading" :columns="columnsData" :data="resData"></show-table-head>
                    </Row>
                    <template>
                        <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  class="pageTemplate"></Page>
                    </template>
                </Card>
            </Col>
        </Row>

        <!-- 添加 -->
        <Modal
            v-model="addModal"
            :mask-closable="false"
            title="添加">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" class="backLinkModal" :model="addParams" ref="addParams" :rules="rules">
                <FormItem label="关键词" prop="keyword">
                    <Input v-model="addParams.keyword" placeholder="请输入关键词"/>
                </FormItem>
                <FormItem label="笔记链接">
                    <Input v-model="addParams.link" placeholder="请输入笔记链接"/>
                </FormItem>
                <FormItem label="笔记内容截图">
                    <div class="demo-upload-list" v-if="addParams.screen">
                        <img :src="addParams.screen">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(addParams.screen)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="addParams.screen=''"></Icon>
                        </div>
                    </div>
                    <div v-show="!addParams.screen" @mouseenter="contentAction=befroUploadTime('api/v1/file/images')">
                        <Upload
                            ref="upload_c"
                            :show-upload-list="false"
                            :on-success="contentHandleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="5120"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="exceededSize"
                            :before-upload="handleBeforeUpload"
                            name="image"
                            type="drag"
                            :action="contentAction"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </div>
                </FormItem>
                <FormItem label="用户" prop="member_id">
                    <Select v-model="addParams.member_id" filterable clearable>
                        <Option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="合作类型" prop="type">
                    <Select v-model="addParams.type" clearable>
                        <Option v-for="(item, index) in cooperationTypeData" :key="index" v-if="item.value>-1" :value="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="单价" prop="price">
                    <InputNumber v-model="addParams.price" :min="1" placeholder="请输入单价"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addModal=false">取消</Button>
                <Button type="primary" :loading="addBtnLoading" @click="addKeywordData">确定</Button>
            </div>
        </Modal>

        <!-- 截图查看大图 -->
        <Modal title="截图" v-model="imgModal">
            <img :src="imgName" v-if="imgModal" style="width: 100%">
        </Modal>

        <!-- 消费明细 -->
        <Modal
            width="800"
            v-model="consumeLogModal"
            title="消费明细"> 
            <Table stripe border :loading="consumLoading" :columns="consumeCol" :data="consumeData"></Table>
            <Page :total="consumeTotal" show-total @on-change="consumeChangeNum" class="pageTemplate"></Page>
            <div slot="footer">
                <Button @click="consumeLogModal=false">取消</Button>
                <Button type="primary" @click="consumeLogModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 更新上线时间 -->
        <Modal
            v-model="updatedTimeModal"
            :mask-closable="false"
            title="更新上线时间">
            <Form :label-width="$store.state.app.isFromMobile?auto:90" :label-position="$store.state.app.isFromMobile?'top':'right'" class="backLinkModal">
                <FormItem label="选择时间">
                    <DatePicker type="datetime" :value="upParams.online_time" show-week-numbers placeholder="选择时间" @on-change="selectUpdatedTime"></DatePicker>
                </FormItem>
                <FormItem label="上传截图">
                    <div class="demo-upload-list" v-if="upParams.online_pic">
                        <img :src="upParams.online_pic">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(upParams.online_pic)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                        </div>
                    </div>
                    <div v-show="!upParams.online_pic" @mouseenter="action=befroUploadTime('api/v1/publish/keyword/upload-screen')">
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="5120"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="exceededSize"
                            :before-upload="handleBeforeUpload"
                            :data="upLoadData"
                            name="image"
                            type="drag"
                            :action="action"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                    </div>
                    <Modal title="头像" v-model="imgModal">
                        <img :src="imgName" v-if="imgModal" style="width: 100%">
                    </Modal>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="updatedTimeModal=false,upParams={}">取消</Button>
                <Button type="primary" :loading="updatedLoading" @click="updatedTimeBtn">确定</Button>
            </div>
        </Modal>

        <!-- 补时间 -->
        <Modal
            v-model="fillTimeModal"
            :mask-closable="false"
            title="补时间">
            <InputNumber :min="1" :max="30" v-model="repair_time"/>
            <div slot="footer">
                <Button @click="fillTimeModal=false">取消</Button>
                <Button type="primary" @click="sureFillTime">确定</Button>
            </div>
        </Modal>

        <!-- 上传素材 -->
        <upload-sucai ref="sucai" @refresh="init"></upload-sucai>

        <!-- 上传文案 -->
        <upload-wenan ref="wenan" @refresh="init"></upload-wenan>

        <!-- 预览素材 -->
        <Modal
            v-model="materialModal"
            width="800"
            :mask-closable="false"
            title="预览素材">
            <Form label-position="top">
                <FormItem label="标题">
                    {{material.title}}
                </FormItem>    
                <FormItem label="内容">
                    <div v-html="material.content"></div>
                </FormItem>    
            </Form> 
            <div slot="footer">
                <Button @click="materialModal=false">取消</Button>
                <Button type="primary" @click="materialModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 预览文案 -->
        <Modal
            v-model="previewModal"
            width="800"
            :mask-closable="false"
            title="预览文案">
            <Form label-position="top">
                <FormItem label="标题">
                    {{official.title}}
                </FormItem>    
                <FormItem label="内容">
                    <div v-html="official.content"></div>
                </FormItem>    
            </Form>     
            <div class="previewHint" v-if="!official.status">
                <Button type="success" icon="md-checkmark" @click="auditParams.status=1 ,audit()">审核通过</Button>
                <Button type="error" icon="md-close" @click="noPassBtn">审核不通过</Button>
            </div>
            <Alert type="warning" style="margin-top:10px;" v-else>
                审核人：{{official.username}}
                <template slot="desc" v-if="official.status==2">
                    不通过原因：{{official.reason}}
                </template>
            </Alert>
            <div slot="footer">
                <Button @click="previewModal=false">取消</Button>
                <Button type="primary" @click="previewModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 审核不通过原因 -->
        <Modal
            v-model="noPassModal"
            draggable 
            title="审核不通过原因">
            <Input type="textarea" :rows="4" placeholder="审核不通过原因" v-model="auditParams.reason"/>
            <div slot="footer">
                <Button @click="noPassModal=false">取消</Button>
                <Button type="primary" :loading="noPassLoading" @click="auditParams.status=2 ,audit()">确定</Button>
            </div>
        </Modal>

        <!-- 历史上线截图 -->
        <Modal
            v-model="showHistoryImg"
            width="700"
            title="历史上线截图">
            <Table stripe border :loading="tabLoading" :columns="historyImgColumns" :data="historyImgData"></Table>
            <div slot="footer">
                <Button @click="showHistoryImg=false">取消</Button>
                <Button type="primary" @click="showHistoryImg=false">确定</Button>
            </div>
        </Modal>

        <!-- 查看大图 -->
        <Modal title="截图" v-model="showLargeImg" style="text-align:center;">
            <img :src="largeImg" v-if="showLargeImg" style="max-width: 100%">
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

        <!-- 历史排名 -->
        <Modal
            v-model="showHistoryRanking"
            transfer
            width="600"
            :mask-closable="false"
            title="历史排名">
            <Table stripe :loading="rankingLoading" :columns="rankingCol" :data="rankingData"></Table>
            <div slot="footer">
                <Button @click="showHistoryRanking=false">取消</Button>
                <Button type="primary" @click="showHistoryRanking=false">确定</Button>
            </div>
        </Modal>

        <!-- 历史笔记数量 -->
        <Modal
            v-model="showHistoryNote"
            transfer
            width="600"
            :mask-closable="false"
            title="历史笔记数量">
            <Table stripe :loading="noteLoading" :columns="noteCol" :data="noteData"></Table>
            <div slot="footer">
                <Button @click="showHistoryNote=false">取消</Button>
                <Button type="primary" @click="showHistoryNote=false">确定</Button>
            </div>
        </Modal>
   
    </div>
</template>

<script>
    import datePicker from '@/views/my-components/date-picker/date-picker';      //日期选择
    import { url, beyondSize, userAuthority, uploadApiEncrypt, downloadingTools, getUserList } from '@/mixins/mixin';
    import uploadSucai from '@/views/keyword/components/upload_sucai';           //上传素材
    import uploadWenan from '@/views/keyword/components/upload_wenan';           //上传文案
    import {keywordList, addKeyword, delKeyword, getCooperationType, keywordUpdatedOnline, 
            getKeywordScreenLog, keywordrepairTime, keywordAudit, keywordOther, keywordConsumeLog, editKeyword, keywordRemark,
             keywordRemarkLog, keywordChangeStatus, getKeywordRnkLog, getKeywordNoteLog} from '@/libs/api';
    import showTableHead from '@/views/my-components/show-table-head/table'; 
    export default {
        mixins: [beyondSize, userAuthority, uploadApiEncrypt, downloadingTools, getUserList],
        data(){
            return {
                addModal: false,              //添加弹窗
                consumeLogModal: false,       //消费明细弹窗
                resData: [],    
                tabLoading: false,
                consumLoading: false,
                consumeData: [],               //消费明细数据
                consumeTotal: 0,
                updatedTimeModal: false,       //更新上线时间 弹窗S
                updatedLoading: false,         //更新上线时间 提交按钮loading
                fillTimeModal: false,          //补时间 弹窗
                repair_time: 1,                //补时间 参数
                currentChoose: '',             //表格单选 选中行的id
                showHistoryRanking: false,     //历史排名 modal
                rankingLoading: false,         //历史排名 loading
                rankingData: [],               //历史排名数据
                rankingCol: [
                    {
                        key: 'created_at',
                        title: '日期',
                        minWidth: 80,
                    },
                    {
                        key: 'data',
                        title: '排名',
                        minWidth: 60
                    }
                ],
                showHistoryNote: false,        //历史笔记数量 modal
                noteLoading: false,         //历史排名 loading
                noteData: [],               //历史排名数据
                noteCol: [
                    {
                        key: 'created_at',
                        title: '日期',
                        minWidth: 80,
                    },
                    {
                        key: 'data',
                        title: '笔记数量',
                        minWidth: 60
                    }
                ],
                columnsData: [
                    {
                        title: '选择',
                        key: 'id',
                        width: 50,
                        align: 'center',
                        show: true,
                        render: (h, params) => {
                            let id = params.row.id;
                            let flag = false;
                            if (this.currentChoose === id) {
                                flag = true
                            } else {
                                flag = false
                            }
                            let self = this;
                            return h('div', [
                                h('Radio', {
                                    props: {
                                        value: flag
                                    },
                                    on: {
                                        'on-change': () => {
                                            self.currentChoose = id;
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '操作',
                        width: 110,
                        show: this.isAuth([1,5,6]),
                        render: (h, params) => {
                            let arr = [];
                            arr.push(
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight: '5px'
                                    },
                                    on:{
                                        click: () => {
                                            let data = params.row;
                                            this.addParams = {
                                                'id': data.id,
                                                'keyword': data.keyword,
                                                'link': data.link,
                                                'member_id': data.member_id,
                                                'type': data.type,
                                                'price': data.price,
                                                'screen': data.screen
                                            }
                                            this.addModal = true;
                                        }
                                    }
                                }, '编辑')
                            )
                            if(this.isAuth([1])){
                                arr.push(
                                    h('Poptip', {
                                        props: {
                                            confirm: true,
                                            title: '您确定要删除此数据吗?',
                                            transfer: true
                                        },
                                        on: {
                                            'on-ok': () => {
                                                this.del(params.row.id);
                                            }
                                        }
                                    }, [
                                        h('Button', {
                                            props: {
                                                type: 'error',
                                                size: 'small',
                                                placement: 'top'
                                            }
                                        }, '删除')
                                    ])
                                )
                            }
                            return h('div', arr)
                        }
                    },
                    {
                        key: '',
                        title: '素材 / 文案',
                        width: 80, 
                        show: true,
                        render: (h, params) => {
                            //客户显示上传素材  预览素材   预览文案
                            let str = [];
                            str.push(
                                h('a', {
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs.sucai.showUploadModal(true, params.row.id);
                                        }
                                    }
                                }, '上传素材')
                            )
                            if(params.row.material){
                                str.push(
                                    h('a', {
                                        attrs: {
                                            href: 'javascript:;'
                                        },
                                        style: {
                                            display: 'block'
                                        },
                                        on: {
                                            click: () => {
                                                this.material = params.row.material;
                                                this.materialModal = true;
                                            }
                                        }
                                    }, '预览素材'),
                                )
                            }
                            str.push(
                                h('a', {
                                    attrs: {
                                        href: 'javascript:;'
                                    },
                                    style: {
                                        display: 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs.wenan.showUploadModal(true, params.row.id);
                                        }
                                    }
                                }, '上传文案')
                            )
                            if(params.row.official){
                                str.push(
                                    h('a', {
                                        attrs: {
                                            href: 'javascript:;'
                                        },
                                        style: {
                                            display: 'block'
                                        },
                                        on: {
                                            click: () => {
                                                this.auditParams.id = params.row.id;
                                                this.official = params.row.official;
                                                this.isProhibitedCopy(params.row.official.status);
                                                this.previewModal = true;
                                            }
                                        }
                                    }, '预览文案')
                                )
                            }
                            return h('div', str)
                        }
                    },
                    // {
                    //     key: 'id',
                    //     title: '编号',
                    //     minWidth: 40, 
                    // },
                    {
                        key: 'username',
                        title: '用户名',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'keyword',
                        title: '关键词',
                        minWidth: 80, 
                        show: true,
                    },
                    {
                        key: '',
                        title: '笔记链接',
                        minWidth: 70, 
                        show: true,
                        render: (h, params) => {
                            let arr = [];
                            if(params.row.link){
                                arr.push(
                                    h('p', [
                                        h('a', {
                                            attrs: {
                                                href: params.row.link,
                                                target: '_blank'    
                                            }
                                        }, '查看链接')
                                    ])
                                )
                            }
                            if(params.row.screen){
                                arr.push(
                                    h('p', [
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    this.largeImg = params.row.screen;
                                                    this.showLargeImg = true; 
                                                }
                                            }
                                        },'查看截图')
                                    ])
                                )
                            }
                            return h('div', arr)
                        }
                    },
                    {
                        key: 'blogger',
                        title: '博主',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: '',
                        title: '博主数据',
                        minWidth: 120, 
                        show: true,
                        render:(h, params) => {
                            return h('div',[
                                h('p',[
                                    h('span','粉丝数:  '),
                                    h('span', params.row.fans)
                                ]),
                                h('p',[
                                    h('span','笔记数:  '),
                                    h('span', params.row.note)
                                ]),
                                h('p',[
                                    h('span','点赞与收藏数:  '),
                                    h('span', params.row.collect)
                                ])
                            ]);
                        }
                    },
                    {
                        key: 'cooperation',
                        title: '合作类型',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: '',
                        title: '笔记数量 / 排名',
                        minWidth: 130, 
                        show: true,
                        render: (h, params) => {
                            return h('div', [
                                h('p',[
                                    h('span','笔记数量:  '),
                                    h('span', [
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    this.getHistoryNote(params.row.id);
                                                }
                                            }
                                        }, params.row.note_num)
                                    ]),
                                ]),
                                h('p',[
                                    h('span','排名:  '),
                                    h('span', [
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    this.getHistoryRank(params.row.id);
                                                }
                                            }
                                        }, params.row.rank)
                                    ]),
                                ])
                            ])
                        }
                    },
                    {
                        key: 'price',
                        title: '单价',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'status',
                        title: '状态',
                        minWidth: 60,
                        show: true, 
                    },
                    {
                        key: 'created_at',
                        title: '合作日期',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'online_time',
                        title: '上线日期',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'online_pic',
                        title: '上线截图',
                        minWidth: 100, 
                        show: true,
                        render: (h, params) => {
                            return h('div',{
                                attrs: { class: 'screenshot' }  
                            }, [
                                h('div',{
                                    on:{
                                        mouseenter: ()=>{
                                            this.actionPic = this.befroUploadTime('api/v1/publish/keyword/upload-img');
                                        }
                                    }
                                },[
                                    h('Upload',{
                                        props:{
                                            'action': this.actionPic, 
                                            'on-success': this.uploadTodaySuccess,
                                            'format': ['jpg','jpeg','png'],
                                            'max-size': 5120,
                                            'show-upload-list': false,
                                            'on-format-error': this.handleFormatError,
                                            'on-exceeded-size': this.exceededSize,
                                            'data': {id: params.row.id},
                                            'name': 'image'
                                        },
                                    },[
                                        h('a', {
                                            style: {
                                                display:'inline-block',
                                                float:'left',
                                                marginRight: '8px',
                                            },
                                        },'上传今日截图')
                                    ])
                                ]),
                                h('a', {
                                    on: {
                                        click: () =>{
                                            this.getHistoryLog(params.row.id);
                                        }
                                    }
                                },'查看历史上线截图')
                            ])
                        }
                    },
                    {
                        key: 'surplus_time',
                        title: '剩余时间',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'repair_time',
                        title: '补时间',
                        minWidth: 60, 
                        show: true,
                    },
                    {
                        key: 'repair_time',
                        title: '备注',
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
                consumeCol: [      //消费明细
                    {
                        key: 'keyword',
                        title: '关键词',
                        minWidth: 60, 
                    },
                    {
                        key: 'type',
                        title: '合作类型',
                        minWidth: 60, 
                    },
                    {
                        key: 'price',
                        title: '金额',
                        minWidth: 60, 
                    },
                    {
                        key: 'online_time',
                        title: '上线日期',
                        minWidth: 80, 
                    },
                    {
                        key: 'surplus_time',
                        title: '剩余日期',
                        minWidth: 80, 
                    },
                ],
                rules:{
                    keyword: [
                        {required: true, message: '请输入关键词', trigger: 'blur'},
                    ],
                    member_id: [
                        {required: true, type:'number', message: '请选择用户', trigger: 'change'},
                    ],
                    type: [
                        {required: true, type:'number', message: '请选择合作类型', trigger: 'change'}
                    ],
                    price: [
                        {required: true, type:'number', message: '请输入单价', trigger: 'blur'},
                    ]
                },
                action: this.encrypt(`api/v1/publish/keyword/upload-screen`),
                contentAction: this.encrypt(`api/v1/file/images`),        //上传笔记地址
                params: {},             //搜索参数    
                addParams: {price: 1},          //添加参数
                imgModal: false,        //查看截图大图
                imgName: '',            //图片url
                uploadcontentJt: [],    //笔记截图内容
                totalCount: 0,          //总条数
                materialModal: false,   //预览素材 弹框
                material: {},           //预览素材 数据
                previewModal: false,    //预览文案 弹窗
                official: {}, 
                noPassModal: false,     //审核不通过 弹窗
                noPassLoading: false,   //审核不通过 确定按钮 loading
                auditParams: {},        //审核 参数
                historyImgColumns: [    //历史上线截图table
                    {
                        key: 'created_at',
                        title: '日期',
                    },
                    {
                        key: '',
                        title: '截图',
                        render: (h, params) => {
                            return h('img', {
                                attrs:{
                                    src: params.row.data
                                },
                                style:{
                                    maxWidth: '100px'
                                },
                                on: {
                                    click: () => {
                                        this.largeImg = params.row.data
                                        this.showLargeImg = true;
                                    }
                                }
                            })
                        }
                    },
                ],
                showHistoryImg: false,   //历史上线截图 弹窗
                historyImgData: [],      //历史上线截图 数据
                saleData: [],            //销售列表
                marketData: [],          //营销顾问列表
                cooperationTypeData: [], //合作类型列表
                showLargeImg: false,     //查看大图
                largeImg: '',            //查看大图  图片路径
                upParams: {},            //更新上线日期参数
                upLoadData: {},          //更新上线日期 上传图 参数
                otherData: [],
                addBtnLoading: false,
                showRemarks: false,      //备注 modal
                remarkParams: {},        //备注参数
                remarkLogData: [],       //备注日志
                actionPic: this.encrypt(`api/v1/publish/keyword/upload-img`),
            }
        },
        created() {
            this.init();
            this.getKeywordUserList();
            this.loadUserList();
            this.loadSaleList();
            this.loadMarketList();
            this.loadCooperationType();
            this.getOther();
        },
        mounted() {
            this.uploadcontentJt = this.$refs.upload_c.fileList;
            //上传word 接口地址
        },
        methods:{
            //加载列表
            init(){
                this.tabLoading = true;
                keywordList(this.params).then(res => {
                    this.tabLoading = false;
                    if(res.code == 200){
                        this.resData = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                }).catch(res => {
                    this.$Notice.error({ title: '服务器异常' });
                })
            },

            //合作日期
            selectHzTime(date){
                this.params.created_start = date.createTimeStart;
                this.params.created_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //上线日期
            selectPubTime(date){
                this.params.online_start = date.createTimeStart;
                this.params.online_end = date.createTimeEnd;
                this.params.page = 1;
                this.init();
            },

            //添加关键词排名数据
            addKeywordData(){
                this.$refs.addParams.validate((valid) => {
                    if (valid) {
                        this.addBtnLoading = true;
                        if(this.addParams.id){
                            this.edit();
                        }else{
                            if(this.addParams.link){
                                this.addParams.link = this.addParams.link.replace(/\s+/g,"");
                            }
                            addKeyword(this.addParams).then(res => {
                                this.addBtnLoading = false;
                                if(res.code == 200){
                                    this.addModal = false;
                                    this.init();
                                    this.$Notice.success({title: res.message});
                                }else{
                                    this.$Notice.error({title: res.message});
                                }
                            })
                        }
                    }
                })
            },

            //编辑下拉数据
            edit(){
                editKeyword(this.addParams).then(res => {
                    this.addBtnLoading = false;
                    if(res.code == 200){
                        this.addModal = false;
                        this.init();
                        this.$Notice.success({ title: res.message });
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //查看消费明细
            showConsumeLog(page){
                this.consumeLogModal = true;
                this.consumLoading = true;
                keywordConsumeLog({page: page}).then(res => {
                    this.consumLoading = false;
                    if(res.code == 200){
                        this.consumeData = res.data.list;
                        this.consumeTotal = res.data.totalCount;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //消费明细分页
            consumeChangeNum(page){
                this.showConsumeLog(page);
            },

            //笔记内容截图上传成功
            contentHandleSuccess(res){
                if(res.code == 200){
                    this.$set(this.addParams, 'screen', res.data.url);
                    this.$Notice.success({title: res.message});
                }else{
                    this.$Notice.error({title: res.message});
                }
            },

            //上传截图  成功
            handleSuccess(res){
                this.$set(this.upParams, 'online_pic', res.data.url);
            },

            //上传前
            handleBeforeUpload(){
                this.upLoadData = {
                    id: this.currentChoose,
                }
                let promise = new Promise((resolve) => {
                    this.$nextTick(function () {
                        resolve(true);
                    });
                });
                return promise;
            },

            //查看大图
            handleView (name) {
                this.imgName = name;
                this.imgModal = true;
            },
            
            //删除图片
            handleRemove (file) {
                this.upParams.online_pic = "";
            },

            //文案审核不通过点击
            noPassBtn(){
                this.noPassModal = true;
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

            //每页条数
            changeSize(size){
                this.params.per_page = size;
                this.init();
            },

            //点击更新上线时间
            showUpModalBtn(){
                if(!this.currentChoose){
                    this.$Notice.warning({ title: '请选择需要更新上线时间的列表~' });
                    return
                }
                this.upParams = {};
                this.updatedTimeModal = true;
            },

            //选择更新日期
            selectUpdatedTime(date){
                this.upParams.online_time = date;
            },

            //更新上线日期
            updatedTimeBtn(){
                if(!this.upParams.online_time){
                    this.$Notice.warning({ title: '请选择上线日期~' });
                    return 
                }else if(!this.upParams.online_pic){
                    this.$Notice.warning({title: '请上传上线截图~'});
                    return
                }
                this.upParams.id = this.currentChoose;
                this.updatedLoading = true;
                keywordUpdatedOnline(this.upParams).then(res => {
                    this.updatedLoading = false;
                    if(res.code == 200){
                        this.updatedTimeModal = false;
                        this.upParams = {};
                        this.init();
                        this.$Notice.success({ title: res.message });
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //上传今日截图 成功~
            uploadTodaySuccess(res){
                if(res.code == 200){
                    this.$Notice.success({title: res.message});
                }else{
                    this.$Notice.error({title: res.message});
                }
            },

            //获取历史上线截图
            getHistoryLog(id){
                getKeywordScreenLog({id: id}).then(res => {
                    if(res.code == 200){
                        this.showHistoryImg = true;
                        this.historyImgData = res.data;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            //显示补时间弹框
            fillTimeBtn(){
                if(!this.currentChoose){
                    this.$Notice.warning({ title: '请选择需要补时间的列表~' });
                    return
                }
                this.fillTimeModal = true;
            },

            //确定补时间按钮
            sureFillTime(){
                var data = {
                    id: this.currentChoose,
                    repair_time: this.repair_time
                }
                keywordrepairTime(data).then(res => {
                    if(res.code == 200){
                        this.fillTimeModal = false;
                        this.init();
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //文案审核
            audit(){
                this.noPassLoading = true;
                keywordAudit(this.auditParams).then(res => {
                    this.noPassLoading = false;
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.previewModal = false;
                        this.noPassModal = false;
                        this.auditParams = {};
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //是否禁止复制
            isProhibitedCopy(status){
                document.onselectstart = function(){
                    event.returnValue = status!=2? true: false;
                }
            },


            //加载合作类型
            loadCooperationType(){
                getCooperationType().then(res => {
                    if(res.code == 200){
                        this.cooperationTypeData = res.data.keyword;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },

            // 总消费
            getOther(){
                let data = {};
                if(this.params.member_id){
                    data.member_id = this.params.member_id;
                }
                keywordOther(data).then(res => {
                    if(res.code == 200){
                        this.otherData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //查看备注日志
            remarkLog(id){
                this.remarkParams = {id: id};       
                keywordRemarkLog({id: id}).then(res => {
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
                keywordRemark(this.remarkParams).then(res =>{
                    if(res.code == 200){
                        this.showRemarks = false;
                        this.$Notice.success({title: res.message});
                        this.init();
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //修改状态
            changeStatus(name){
                if(!this.currentChoose){
                    this.$Notice.warning({ title: '请选择需要修改状态的列表~' });
                    return
                }
                let data = {
                    id: this.currentChoose,
                    status: name
                }
                keywordChangeStatus(data).then(res => {
                    if(res.code == 200){
                        this.init();
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //删除
            del(id){
                delKeyword(id).then(res => {
                    if(res.code == 200){
                        this.init();
                        this.$Notice.success({title: res.message});
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //加载历史排名
            getHistoryRank(id){
                getKeywordRnkLog({id: id}).then(res => {
                    if(res.code == 200){
                        this.showHistoryRanking = true;
                        this.rankingData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    }
                })
            },

            //加载历史笔记数量
            getHistoryNote(id){
                getKeywordNoteLog({id: id}).then(res => {
                    if(res.code == 200){
                        this.showHistoryNote = true;
                        this.noteData = res.data;
                    }else{
                        this.$Notice.error({title: res.message});
                    } 
                })
            },

            //下载
            downLoadBtn(){
                var down = {export: 2};
                keywordList(Object.assign(this.params,down)).then(res => {
                    this.downLoadwj(url + 'api/v1/publish/keyword?', this.params, res);
                });
            }

        },
        components: {
            datePicker,
            uploadSucai,
            uploadWenan,
            showTableHead
        }
    }
</script>
<style lang="less" scoped>
    .button_wrap{
        margin-top:10px;
    }
    .previewHint{
        text-align: center;
        button{
            margin:0 10px;
        }
    }
    .statistics{
        margin-bottom: 10px;
    }
</style>
