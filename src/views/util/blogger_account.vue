<template>
    <div>
        <Card>
            <p slot="title">
                博主账户管理
            </p>
            <Row>
                <Col class="button_wrap">
                    <Button type="primary" icon="md-add" @click="bloggerLinkModal=true">添加博主链接</Button>
                    <Button type="primary" icon="md-add" @click="articleLinkModal=true">添加文章链接</Button>
                </Col>
                <Col>
                    <Table :columns="columns" :data="resData"></Table>
                    <Page :total="totalCount" :current="params.page" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"  style="margin-top:20px"></Page>
                </Col>
            </Row>
        </Card>

        <!-- 添加博主链接 -->
        <Modal
            v-model="bloggerLinkModal"
            transfer
            title="添加博主链接">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" inline>
                <FormItem label="博主链接">
                    <Input clearable placeholder="请输入链接" style="width: 300px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="bloggerLinkModal=false">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>

        <!-- 添加文章链接 -->
        <Modal
            v-model="articleLinkModal"
            transfer
            title="添加文章链接">
            <Form :label-width="$store.state.app.isFromMobile?auto:100" :label-position="$store.state.app.isFromMobile?'top':'right'" inline>
                <FormItem label="选择博主">
                    <Select clearable style="width:300px">
                        <Option :value="0">博主1</Option>
                        <Option :value="1">博主2</Option>
                    </Select>
                </FormItem>
                <FormItem label="文章链接">
                    <Input clearable placeholder="请输入链接" style="width: 300px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="articleLinkModal=false">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>

        <!-- 查看文章数据 -->
        <Modal
            width="1000"
            v-model="articleDataModal"
            transfer
            title="文章数据">
            <Table :columns="articleColumns" :data="articleResData"></Table>
            <div slot="footer">
                <Button @click="articleDataModal=false">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Modal>


    </div>
</template>
<script>
export default {
    data(){
        return {
            totalCount: 0,             //总条数
            params: {},
            bloggerLinkModal: false,   //添加博主链接 modal
            articleLinkModal: false,   //添加文章链接 modal
            resData: [{}], 
            columns: [
                {
                    key: '',
                    title: '博主名称',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '博主链接',
                    minWidth: 80, 
                    render: (h, params) => {
                        return h('a', {
                            
                        })
                    }
                },
                {
                    key: '',
                    title: '相关数据',
                    minWidth: 120, 
                    render: (h, params) => {
                        return h('div', [
                            h('p', `粉丝数：`),
                            h('p', `笔记数：`),
                            h('p', `总收藏与点赞：`)
                        ])
                    }
                },
                {
                    key: '',
                    title: '文章评论(最新两条评论)',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '添加日期',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '文章数据',
                    minWidth: 100, 
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small',
                                type: 'success'
                            },
                            on: {
                                click: ()=> {
                                    this.articleDataModal = true;
                                }
                            }
                        }, '查看文章数据')
                    }
                },
            ],
            articleDataModal: false,
            articleResData: [],         //文章数据
            articleColumns: [   
                {
                    key: '',
                    title: '标题',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '链接',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '是否收录',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '文章数据',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('p', `收藏：`),
                            h('p', `点赞：`),
                            h('p', `评论：`)
                        ])
                    } 
                },
                {
                    key: '',
                    title: '最新两条评论',
                    minWidth: 80, 
                },
                {
                    key: '',
                    title: '查询日期',
                    minWidth: 80, 
                }
            ],
        }
    },
    methods: {
        //加载列表
        init(){

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
