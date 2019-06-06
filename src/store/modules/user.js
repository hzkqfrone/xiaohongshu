import Cookies from 'js-cookie';

export default {
    state: {},
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('session');
            localStorage.clear();
            if(vm){
                vm.$Notice.destroy();   //清除通知消息
                vm.$store.state.app.pageOpenedList = [];
            }
        },
        fetch: function() {
 
            return window.JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
           
        },
           
        save: function(items) {
        
            window.localStorage.setItem(STORAGE_KEY, window.JSON.stringify(items))
        
        }
    }
};

