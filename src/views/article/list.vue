<template>
    <div>
        <list v-if="show=='list'" @showList="eventTab"></list>
        <custom-list v-if="show=='customlist'" @showList="eventTab"></custom-list>
    </div>
</template>
<script>
    import list from './components/list';
    import customList from './components/custom-list';
    export default {
        data(){
            return{
                show: '', 
            }
        },
        created(){
            if(this.$route.query.t && this.$route.query.t == 'custom'){
                this.show = 'customlist';
            }else{
                this.show = 'list';
            }
        },
        methods: {
            eventTab(data){
                if(data == 0){
                    this.show = 'list';
                }else if(data == 1){
                    this.show = 'customlist';
                }
            }
        },
        components: {
            list,
            customList
        }
    }
</script>
