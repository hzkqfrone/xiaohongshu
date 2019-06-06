import axios from 'axios'; //引用axios
import Cookies from 'js-cookie'; //引用刚才我们创建的util.js文件，并使用getCookie方法
import qs from 'qs';
import store from '@/store/index.js';
import env from '../../build/env';
import {router} from '../router/index';
import md5 from 'js-md5';

//生产环境接口地址 跟随网页域名变化
const ajaxUrl = env === 'development'
    ? 'http://xhs.cn/' : `${document.location.origin}/`;      

// axios 配置
// axios.defaults.timeout = 10000;
// axios.defaults.baseURL = "https://www.ppxhs.com/"
axios.defaults.baseURL = ajaxUrl;

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type':'application/x-www-form-urlencoded' //设置跨域头部
        };
        
        let time = parseInt(new Date().getTime()/1000);
        let secret = 'jTJxKcGL';
        let appId = 'guard';
        let sign = md5(`appId=${appId}&time=${time}${secret}`);
        let access_token = Cookies.get('session');
        if(config.url.indexOf('?') > -1){
            config.url = `${config.url}&time=${time}&sign=${sign}&appId=${appId}`;
        }else{
            config.url = `${config.url}?time=${time}&sign=${sign}&appId=${appId}`;
        }
        if(access_token){
            config.url = `${config.url}&access-token=${access_token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);


// http response 拦截器
axios.interceptors.response.use(
    response => {
        if(response.data.code == 401) {
            //登录过期
        	store.commit('logout', this);
            location.reload();
        }else if(response.data.code == 409){
            //无权限
            router.push({
                path: '/home'
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error.response.data)
    });

export default axios;

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data))
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}


/**
 * delete 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {data:qs.stringify(data)})
        .then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}


