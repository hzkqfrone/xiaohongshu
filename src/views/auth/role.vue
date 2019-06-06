<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    角色管理
                </p>
                <!-- <Button type="success" @click="addRoleBtn"><Icon type="md-add"></Icon> 添加</Button> -->
                <Modal
                    v-model="modalShow"
                    :title="modalTitle"
                    :loading="loading"
                    @on-cancel="modalShow=false"
                    @on-ok="asyncOK">
                    <Form :label-width="$store.state.app.isFromMobile?auto:80" :label-position="$store.state.app.isFromMobile?'top':'right'">
                        <FormItem label="角色:" required>
                            <Input v-model="form.name" placeholder="" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="权限">
                            <Tree :data="form.treeData" show-checkbox ref="Tree"></Tree>
                        </FormItem>
                    </Form>
                </Modal>

                <Row class="margin-top-10 searchable-table-con1">
                    <Table border :loading="showLoading" :content="self" :columns="columnsData" :data="resData"></Table>
                </Row>

            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { addRole, getRole, getRoleDetail } from '@/libs/api';
    export default {
        data () {
            return {
                self:this,
                modalShow:false,
                modalTitle:'添加',
                loading: true,
                form:{},
                columnsData: [
                    {
                        key: 'id',
                        title: 'ID'
                    },
                    {
                        key: 'name',
                        title: '角色'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            var roleArr = [];
                                roleArr.push(
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
                                                this.edit(params.row)
                                            }
                                        }
                                    }, '编辑')
                                )
                            return h('div', roleArr);
                        }
                    }
                ],
                resData:[],
                showLoading: false
            }; 
        },
        methods: {
            //加载角色列表
            init () {
                this.showLoading = true;
                getRole().then(res => {
                    this.showLoading = false;
                    if (res.code == 200) {
                        this.resData = res.data;
                    } else {
                        this.$Notice.error({title:res.message});
                    }
                });
            },

            //添加角色btn
            addRoleBtn(){
                this.form = {};
                this.roleDetail(0); 
                this.modalTitle='添加';
            },

            //编辑
            edit (params) {
                this.form = params;
                this.modalTitle = '编辑';
                this.roleDetail(params.id);
            },

            //获取角色详情
            roleDetail(id){
                getRoleDetail(id).then(res => {
                    if(res.code == 200){
                        this.form.treeData = res.data;
                        this.modalShow = true;
                    }else{
                        this.$Notice.error({ title: res.message });
                    }
                })
            },


            //添加/修改角色信息  
            //角色ID【修改时需要】
            asyncOK () {
                if(this.form.name=='' || this.form.name == undefined){
                    this.$Notice.error({ title: '角色名称不能为空!' });
                    this.loading = false;
                    this.modalShow = true;
                }else{
                    let group = this.$refs.Tree.getCheckedAndIndeterminateNodes();
                    var arr = new Array();
                    group.forEach(e => {
                        arr.push(e.id);
                    })
                    let data = {
                        name: this.form.name,
                        item_child: arr,
                        id: this.form.id
                    }
                    addRole(data).then(res => {
                        this.loading = false;
                        if (res.code == 200) {
                            this.$Notice.success({ title: res.message });
                            this.modalShow = false;
                            this.init();
                            this.form = {};
                        } else {
                            this.$Notice.error({ title: res.message });
                        }
                    });
                }
            }
        },
        mounted () {
            this.init();
        },
    };
</script>
