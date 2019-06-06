<template>
    <div class="networkWrap full-screen-btn-con" @click="utp">
        <Tooltip :content="networkNum" placement="bottom">
            <i :style="networkStyle"></i>
        </Tooltip>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    export default {
        data(){
            return{
                networkStyle: 'background-position:0 0',
            }
        },
        computed: {
            networkNum(){
                var n = this.$store.state.app.networkMS;
                var s = "";
                if(n == 0){
                    s = "0 -100px";
                }else if(n < 200){
                    s = "0 0";
                }else if(n > 200 && n <= 500){
                    s = "0 -25px";
                }else if(n > 500 && n <= 1000){
                    s = "0 -50px";
                }else if(n>1000){
                    s = "0 -75px";
                }
                this.networkStyle = `background-position:${s}`;
                return n + 'ms';
            }
        },
        methods: {
            utp(){
                window.open('http://api.meijiebao.org.cn/network_speed/utp.html');
            }
        },
    }
</script>
<style lang="less" scoped>
    .networkWrap i{
        display: inline-block;
        width: 25px;
        height: 25px;
        background-image: url(../../images/network.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;
    }
</style>
