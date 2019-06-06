import Cookies from 'js-cookie';
import md5 from 'js-md5';
import { userList, pullCustomerList, keywordCustomerList, seedingCustomerList, getSaleList, getMarketList } from '@/libs/api';
import env from '../../build/env';

export const url = env === 'development'
    ? 'http://xhs.cn/' : `${document.location.origin}/`;


//图片上传超出指定大小限制时的钩子
export const beyondSize = {
    methods:{
        exceededSize(){
            this.$store.commit('setProgressStatus', false);
            this.$Notice.warning({
                title: '图片大小不能超过2M！'
            });
        },
        handleFormatError (){
            this.$store.commit('setProgressStatus', false);
            this.$Notice.warning({
                title: '文件格式有误'
            });
        },
        //上传文档成功
        uploadSuccess(response,file,fileList){
            this.$store.commit('setProgressStatus', false);
            this.details = response.data;
            this.$Notice.success({
                title: '上传成功'
            });
        },
        //上传文档失败
        uploadError(){
            this.$store.commit('setProgressStatus', false);
            this.$Notice.error({
                title: '上传失败'
            });
        },
    }
}



//下载
export const downloadingTools = {
    methods:{
        downLoadwj(url,data,res){
            if(res.code == 200){
                let down = {export:1};
                let qs = require('qs');
                let time = parseInt(new Date().getTime()/1000);
                let secret = 'jTJxKcGL';
                let appId = 'guard';
                let sign = md5(`appId=${appId}&time=${time}${secret}`); 
                let str = {
                    'access-token': Cookies.get('session'),
                }
                window.open(`${url}access-token=${Cookies.get('session')}&time=${time}&sign=${sign}&appId=${appId}&` + qs.stringify(Object.assign(data,down)));
            }else{
                this.$Notice.error({title: res.message});
            }
            delete data.export;
        }
    }
}



//用户权限
export const userAuthority = {
    methods: {
        isAuth(data){
            let arr = [
                {id: 1, name: '超级管理员'},
                {id: 2, name: '客户'},
                {id: 3, name: '销售'},
                {id: 4, name: '销售主管'},
                {id: 5, name: '营销顾问'},
                {id: 6, name: '营销顾问主管'},
            ];
            let role  = localStorage.loginData ? JSON.parse(localStorage.loginData) : {};
            let handel = false;
            data.forEach(v => {
                if(v == role.role){
                    handel = true;
                }
            });
            return handel;
        },

        operatingAuth(name){
            let handle = false;
            let auth_list = JSON.parse(localStorage.getItem('funList'));
            let msg = auth_list[`menu_${this.$route.path.split('/')[1]}`];
            msg[0].forEach(val => {
                if(val.name == name){
                    handle = true;
                }
            });
            return handle;
        }
    },
}


// 表情  emoji
export const ImgEmoji = {
    data(){
        return {
            emojiArr: ['😄','😃','😀','😊','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','🙌','👈','🙏','☝','👏','💪','🚶','♀','️🚶','🏃‍','♀','🏃','💃','🕺','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','💆','👰','🙎','️🙍','🤷‍','🎩','👑','👒','🧢','👟','👞','👡','👠','👢','👙','👕','👔','👚','👗','🎽','👖','👘','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭'],
            emojiImg: [
                '<img src="//ci.xiaohongshu.com/xy_emo_r_weixiao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_haixiu.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_shiwang.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_hanyan.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_wa.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_henaicha.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_zipai.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_touxiao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_feiwen.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_shihua.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_xiaoku.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_zan.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_anzhongguancha.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_maibao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_daxiao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_sese.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_shengqi.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_kure.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_mengmengda.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_xieyan.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_kelian.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_bishi.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_zhoumei.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_zhuakuang.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_wulian.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_paidui.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_baji.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_jingkong.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_koubi.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_zaijian.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_tanqi.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_shuijiao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_deyi.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_chigua.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_fuqiang.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_heishuwenhao.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_r_huangjinshu.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_h_tushetou.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_h_chelian.png?v=2" class="shubaobao-expression" width="18" heihgt="18">',
                '<img src="//ci.xiaohongshu.com/xy_emo_h_jingxia.png?v=2" class="shubaobao-expression" width="18" heihgt="18">'
            ],
        }
    }
}



//用户列表
export const getUserList = {
    data(){
        return{
            userList:[],   //指定用户列表
            customerList: [],
        }
    },
    methods: {
        //用户列表
        loadUserList(){
            userList().then(res => {
                if (res.code == 200) {
                    this.userList = res.data;
                } else {
                    this.$Notice.error({title:res.message});
                }
            })
        },

        //搜索下拉 - 用户列表
        getPullUserList(){
            pullCustomerList().then(res =>{
                if(res.code == 200){
                    this.customerList = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //关键词排名 - 用户列表
        getKeywordUserList(){
            keywordCustomerList().then(res => {
                if(res.code == 200){
                    this.customerList = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //种草营销 - 用户列表
        getSeedingUserList(){
            seedingCustomerList().then(res => {
                if(res.code == 200){
                    this.customerList = res.data;
                }else{
                    this.$Notice.error({title: res.message});
                }
            })
        },

        //加载销售列表
        loadSaleList(){
            getSaleList().then(res => {
                if(res.code == 200){
                    this.saleData = res.data;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },

        //加载营销顾问
        loadMarketList(){
            getMarketList().then(res => {
                if(res.code == 200){
                    this.marketData = res.data;
                }else{
                    this.$Notice.error({ title: res.message });
                }
            })
        },
    },
}

//上传接口 加密参数
export const uploadApiEncrypt = {
    methods: {
        encrypt(path){
            let time = parseInt(new Date().getTime()/1000);
            let secret = 'jTJxKcGL';
            let appId = 'guard';
            let sign = md5(`appId=${appId}&time=${time}${secret}`); 
            return `${url}${path}?access-token=${Cookies.get('session')}&time=${time}&sign=${sign}&appId=${appId}`
        },

        //上传之前 更新Time
        befroUploadTime(UPLOADURL){
            return this.encrypt(UPLOADURL);
        }
    },
}