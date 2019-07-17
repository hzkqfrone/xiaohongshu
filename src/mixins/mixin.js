import Cookies from 'js-cookie';
import md5 from 'js-md5';
import { userList, pullCustomerList, keywordCustomerList, seedingCustomerList, getSaleList, getMarketList, getScreenCustomerList } from '@/libs/api';
import env from '../../build/env';

export const url = env === 'development'
    ? 'http://xhs.cn/' : `${document.location.origin}/`;


//图片上传超出指定大小限制时的钩子
export const beyondSize = {
    methods:{
        exceededSize(){
            this.$store.commit('setProgressStatus', false);
            this.$Notice.warning({
                title: '图片大小不能超过5M！'
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
    },
}


// 表情  emoji
export const ImgEmoji = {
    data(){
        return {
            emojiArr: ['😄','😃','😀','😊','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','🙌','👈','🙏','☝','👏','💪','🚶','♀','️🚶','🏃‍','♀','🏃','💃','🕺','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','💆','👰','🙎','️🙍','🤷‍','🎩','👑','👒','🧢','👟','👞','👡','👠','👢','👙','👕','👔','👚','👗','🎽','👖','👘','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭'],                             
            emojiImg: [
                {
                    label: 'r_weixiao', 
                    value: '[微笑R]'
                },
                {
                    label: 'haixiu', 
                    value: '[害羞R]'
                },
                {
                    label: 'r_shiwang', 
                    value: '[失望R]'
                },
                {
                    label: 'hanyan', 
                    value: '[汗颜R]'
                },
                {
                    label: 'r_wa', 
                    value: '[哇R]'
                }, 
                {
                    label: 'r_henaicha', 
                    value: '[喝奶茶R]'
                },
                {
                    label: 'r_zipai', 
                    value: '[自拍R]'
                },
                {
                    label: 'touxiao', 
                    value: '[偷笑R]'
                },
                {
                    label: 'feiwen', 
                    value: '[飞吻R]'
                },
                {
                    label: 'r_shihua', 
                    value: '[石化R]'
                },
                {
                    label: 'xiaoku', 
                    value: '[笑哭R]'
                },
                {
                    label: 'zan', 
                    value: '[赞R]'
                },
                {
                    label: 'r_anzhongguancha', 
                    value: '[暗中观察R]'
                },
                {
                    label: 'r_maibao', 
                    value: '[买爆R]'
                },
                {
                    label: 'r_daxiao', 
                    value: '[大笑R]'
                },
                {
                    label: 'sese', 
                    value: '[色色R]'
                },
                {
                    label: 'shengqi', 
                    value: '[生气R]'
                },
                {
                    label: 'kure', 
                    value: '[哭惹R]'
                },
                {
                    label: 'mengmengda', 
                    value: '[萌萌哒R]'
                },
                {
                    label: 'r_xieyan', 
                    value: '[斜眼R]'
                },
                {
                    label: 'r_kelian', 
                    value: '[可怜R]'
                },
                {
                    label: 'bishi', 
                    value: '[鄙视R]'
                },
                {
                    label: 'r_zhoumei', 
                    value: '[皱眉R]'
                },
                {
                    label: 'zhuakuang', 
                    value: '[抓狂R]'
                },
                {
                    label: 'r_wulian', 
                    value: '[捂脸R]'
                },
                {
                    label: 'r_paidui', 
                    value: '[派对R]'
                },
                {
                    label: 'baji', 
                    value: '[吧唧R]'
                },
                {
                    label: 'jingkong', 
                    value: '[惊恐R]'
                },
                {
                    label: 'r_koubi', 
                    value: '[抠鼻R]'
                },
                {
                    label: 'zaijian', 
                    value: '[再见R]'
                },
                {
                    label: 'tanqi', 
                    value: '[叹气R]'
                },
                {
                    label: 'r_shuijiao', 
                    value: '[睡觉R]'
                },
                {
                    label: 'deyi', 
                    value: '[得意R]'
                },
                {
                    label: 'r_chigua', 
                    value: '[吃瓜R]'
                },
                {
                    label: 'fuqiang', 
                    value: '[扶墙R]'
                },
                {
                    label: 'r_heishuwenhao', 
                    value: '[黑薯问号R]'
                },
                {
                    label: 'r_huangjinshu', 
                    value: '[黄金薯R]'
                },
                {
                    label: 'h_tushetou', 
                    value: '[吐舌头H]'
                },
                {
                    label: 'h_chelian', 
                    value: '[扯脸H]'
                },
                {
                    label: 'h_jingxia', 
                    value: '[惊吓H]'
                }
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
            marketData: [],
            saleData: [],
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

        //红薯霸屏王 - 用户列表
        getBaPingUserList(){
            getScreenCustomerList().then(res => {
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