<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    菜单管理
                </p>
                <Row>
                    <span style="margin-right:10px;"><Button type="primary" icon="md-add" @click="modal1 = true, addMenuStr = {status: 1, is_show: 1, sort: 1}">添加</Button></span>

                    <Modal
                        v-model="modal1"
                        title="菜单"
                        :mask-closable="false"
                        class="addMenu">
                        <Form ref="addMenuStr" :model="addMenuStr" :label-width="100" :rules="ruleValidate">
                            <Form-item label="path" prop="path">
                                <Input style="width: 350px" v-model="addMenuStr.path"></Input>
                            </Form-item>
                            <Form-item label="name" prop="name">
                                <Input style="width: 350px" v-model="addMenuStr.name"></Input>
                            </Form-item> 
                            <Form-item label="api" prop="api">
                                <Input style="width: 350px" v-model="addMenuStr.api"></Input>
                            </Form-item> 
                            <Form-item label="栏目名称" prop="title">
                                <Input style="width: 350px" v-model="addMenuStr.title"></Input>
                            </Form-item> 
                            <Form-item label="图标">
                                <Input style="width: 350px" v-model="addMenuStr.menu_css"></Input>
                            </Form-item> 
                            <Form-item label="访问地址" prop="view">
                                <Input style="width: 350px" v-model="addMenuStr.url"></Input>
                            </Form-item> 
                            <Form-item label="上级分类">
                                <Select v-model="addMenuStr.pid" style="width: 350px">
                                    <Option v-for="(item, index) in superiorList" :value="item.id" :key="index">{{ item.title }}</Option>
                                </Select>
                            </Form-item> 
                            <Form-item label="排序" prop="sort">
                                <InputNumber style="width: 350px" v-model="addMenuStr.sort"></InputNumber>
                            </Form-item> 
                            <Form-item label="状态">
                                <RadioGroup v-model="addMenuStr.status">
                                    <Radio :label="0">停用</Radio>
                                    <Radio :label="1">启用</Radio>
                                </RadioGroup>
                            </Form-item> 
                            <Form-item label="显示左侧菜单">
                                <i-switch v-model="addMenuStr.is_show" :true-value="1" :false-value="0"></i-switch>
                            </Form-item> 
                        </Form>
                        <div slot="footer">
                            <Button @click="modal1=false">取消</Button>
                            <Button type="primary" @click="addMenu('addMenuStr')">确定</Button>
                        </div>
                    </Modal>
                </Row>
                <Row class="margin-top-10 searchable-table-con1">
                    <Table :row-class-name="rowClassName" border :loading="loading" :columns="columnsData" :data="resData"></Table>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { getMenuList, addMenuList, deleteMenu, getMenuDetail, getSuperiorList} from '@/libs/api'
                     
    export default {
        name: 'columnnav',
        data () {
            return {
                modal1:false,
                loading:false,   //Loading 
                columnsData: [
                    {title: 'path',key: 'path'},
                    {title: 'name',key: 'name'},
                    {
                        title: '栏目名称',
                        key: 'title',
                        minWidth: 250,
                        width: 160,
                    	render: function (h, params) {
                            if (this.row.level != 1) {
                                var j = "__";
                                var d = "|" + j.repeat(this.row.level);
                            } else {
                                var d = "";
                            }
                            return h('span', d + this.row.title);
                        }
                    },
                    {
                    	title: '图标',
                    	key: 'menu_css',
                    	width: 80,
                    	render: function (h, params) {
                    		return h('Icon', {
                    			props: {
                                    type: this.row.menu_css,
                                },
                    		},this.row.menu_css);
                        }
                    },
                    {title: '访问地址',key: 'url'},
                    {title: '上级分类',key: 'pid'},
                    {title: 'Api',key: 'api'},
                    {
                        title: '状态',
                        key: 'status',
                        render: function (h, params) {
                            return h('span', this.row.status ==1 ? '启用' : '停用');
                        }
                    },
                    {
                        title: '显示左侧菜单',
                        key: 'is_show',
                        render: function (h, params) {
                            return h('span', this.row.is_show ==1 ? '显示' : '不显示');
                        }
                    },
                    {title: '排序',key: 'sort',width:80},
                    {
                        title: '操作',
                        key:'desc',
                        fixed: 'right',
                        width: 170,
                        render: (h, params) => {    
                            let showMenuArr = [];
                            
                            showMenuArr.push(
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-create'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            )
                            
                            showMenuArr.push(
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '您确定要删除这条数据吗?'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.removeMenu(params.row.id);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '5px'
                                        },
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon:'md-trash',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            )
                            return h('div', showMenuArr);
                        }
                    }
                ],
                resData:[],
                addMenuStr:{      //添加栏目 列表参数
                    status: 1, //状态
                    is_show: 1
                },
                superiorList:[],  //上级分类

                //验证规则
                ruleValidate: {
                    name: [
                        {required: true, message: 'name不能为空', trigger: 'blur'},
                    ],
                    path: [
                        {required: true, message: 'path不能为空', trigger: 'blur'},
                    ],
                    api: [
                        {required: true, message: 'api不能为空', trigger: 'blur'},
                    ],
                    title: [
                        {required: true, message: '栏目名称不能为空', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '访问地址不能为空', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, type:'number', message: '排序不能为空', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            addMenu(name) {
                //验证表单
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //添加栏目添加栏目
                        addMenuList(this.addMenuStr).then(res => {
                            if(res.code == 200){
                                this.$Notice.success({
                                    title: '添加成功'
                                });
                                this.modal1 = false;
                                this.getMenuList();
                                this.getColumnList();
                            }else{
                                this.$Notice.error({title: res.message});
                            }
                        }).catch(error => {
                            this.$Notice.error({title: '服务器异常'})
                        })
                    }
                })
            },

            //删除栏目
            removeMenu(id) {
                deleteMenu(id).then(res => {
                    if(res.code == 200){
                        this.$Notice.success({title: res.message});
                        this.getMenuList();
                        this.getColumnList();
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                    
                })
            },

            //获取栏目列表
            getMenuList() {
                this.loading = true;
                getMenuList().then(res => {
                    this.loading = false;
                    if(res.code == 200){
                        this.resData = res.data;
                    }else{
                        this.$Notice.warning({title:res.message});
                    }
                })
            },

            //获取编辑栏目的数据
            edit (id) {
                getMenuDetail(id).then(res => {
                    if(res.code == 200){
                        this.modal1 = true;
                        this.addMenuStr = res.data;
                    }else{
                        this.$Notice.warning({title: res.message});
                    }
                })
            },

            rowClassName (row,index) {
                if(row.level == 1){
                    return 'demo-table-info-row';
                }
            },

            //获取栏目分类列表
            getColumnList(){
                getSuperiorList().then(res => {
                    if(res.code == 200){
                        var str = [{title: '顶级栏目', id: '0'}];
                        this.superiorList = str.concat(res.data);
                    }
                })
            }
        },
        mounted () {
            this.getMenuList();
            this.getColumnList();
        },
        activated(){
            this.getMenuList();
        }
        
    };

</script>

<style lang="less">
    @import '../../styles/common.less';
    
    .ivu-table .demo-table-info-row td{
        background: #7ec3f5;
    }
</style>
