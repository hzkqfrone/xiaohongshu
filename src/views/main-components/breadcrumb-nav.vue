<template>
    <div>
        <Breadcrumb style="display:inline-block">
            <BreadcrumbItem 
                v-for="item in currentPath" 
                :key="item.name"
                :to="item.path"
            >{{ itemTitle(item) }}</BreadcrumbItem>
        </Breadcrumb>
        <!-- <div class="relationQQ">
            <span>后台一切相关问题请联系QQ：1174796596</span>
            <a href="tencent://Message/?Uin=1174796596&websiteName=q-zone.qq.com&Menu=yes">在线咨询</a>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    },
    methods: {
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .relationQQ{
        display:inline-block;
        margin-left:20px;
        font-size:14px;
        span{
            color:red;
        }
        & a{
            margin-left:5px;
            display: inline-block;
            width:80px;
            height:30px;
            line-height: 28px;
            margin-top:-6px;
            padding-left:20px;
            border:1px solid #dddee1;
            border-radius:3px;
            background:url(../../images/qq.png) left center no-repeat;
            background-size:20px;
            color:rgb(0, 21, 41);
            transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
            &:hover{
                border-color:#2d8cf0;
                color:#2d8cf0;
            }
        }
    }
</style>
