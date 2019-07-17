<template>
    <!-- <button size="primary" type="info" icon="plus" @click="getContent">获取内容</button> -->
    <UEditor :config=config ref="ueditor" :id="id"></UEditor>
</template>

<script>
import UEditor from '@/views/my-components/editor/ue';

export default {
    name:'hello',
    props:['details', 'order', 'id'],
    data(){
        return {
            config: {
                //可以在此处定义工具栏的内容
                // toolbars: [
                //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
                //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
                //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
                // ],
                autoHeightEnabled: false,
                autoFloatEnabled: true,
                initialContent:' ',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                autoClearinitialContent:false, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
                initialFrameWidth: null,
                initialFrameHeight: 250,
                BaseUrl: '',
            },
            addFormVisible: false
        }
    },
    created() {
        if(this.id == 'violate_editor'){
            this.config.toolbars =  [['source']];
            this.config.initialFrameHeight = 300;
            this.config.maximumWords = 1000;
        }
    },
    methods: {
        //获取文档内容
        getContent: function(){
            let content = this.$refs.ueditor.getUEContent();
        },
        
        //插入表情
        inserthtmls(data){
            this.$refs.ueditor.inserthtml(data);
        }
    },
    watch:{
        details: {
    　　　　handler(newValue, oldValue) {
                this.$nextTick(() => {
                    if(this.order){
                        this.$refs.ueditor.editor.body.innerHTML = this.details;
                    }else{
                        try {
                            let details = this.details ? this.details : ' ';
                            this.$refs.ueditor.editor.body.innerHTML = details;
                        } catch (error) {
                            
                        }
                    }
                })
    　　　　},
    　　　　deep: true
    　　}
    },
    components: {
        UEditor
    },
  }

</script>