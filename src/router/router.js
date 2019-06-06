import Main from '@/views/Main.vue';
import { getMyMenu } from '@/libs/api';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, meta: {keepAlive:true}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'message', title: '消息中心', meta: {title: '消息中心',keepAlive:true}, name: 'message_index', component: () => import('@/views/message/message.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/seeding',
    //     menu_css: 'md-flower',
    //     name: 'grass',
    //     title: '小红薯种草营销',
    //     component: Main,
    //     children: [
    //         { path: 'introduce',title: '种草营销', menu_css: 'md-radio-button-on', meta: {title: '小红薯种草营销 - 种草营销'}, name: 'seeding_page', component: () => import('@/views/seeding/introduce.vue')},
    //         { path: 'data',title: '种草方案', menu_css: 'md-radio-button-on', meta: {title: '小红薯种草营销 - 种草方案'}, name: 'seeding_data', component: () => import('@/views/seeding/data.vue')},
    //         { path: 'article',title: '种草稿件', menu_css: 'md-radio-button-on', meta: {title: '小红薯种草营销 - 种草稿件'}, name: 'seeding_article', component: () => import('@/views/seeding/seeding_article.vue')},
    //     ]
    // },
    // {
    //     path: '/xueyuan',
    //     icon: 'md-book',
    //     name: 'xiaohongshu_xy',
    //     title: '小红薯学院',
    //     component: Main,
    //     children: [
    //         { path: 'list',title: '小红薯学院', icon: 'md-book', meta: {title: '小红薯学院 - 列表'}, name: 'xiaohongshu_xuyuan', component: () => import('@/views/xueyuan/xueyuan.vue')},
    //         { path: 'add',title: '添加知识库', icon: 'md-radio-button-on', meta: {title: '小红薯学院 - 添加'}, name: 'xiaohongshu_xuyuan_add', component: () => import('@/views/xueyuan/add.vue')},
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: 'md-cloudy',
    //     name: 'xiaohongshu_resource',
    //     title: '小红薯资源大全',
    //     component: Main,
    //     children: [
    //         { path: '/xiaohongshu',title: '小红薯资源大全', icon: 'md-cloudy', meta: {title: '小红薯资源大全'}, name: 'xiaohongshu_kol', component: () => import('@/views/kol/kol.vue')},
    //     ]
    // },
    // {
    //     path: '/article',
    //     icon: 'ios-send',
    //     name: 'xiaohongshu_marketing',
    //     title: '小红薯资源发布',
    //     component: Main,
    //     children: [
    //         { path: 'pub',title: '选号发布', icon: 'md-radio-button-on', meta: {title: '选号发布'}, name: 'xiaohongshu_resource_pub', component: () => import('@/views/article/pub.vue')},
    //         { path: 'custom_pub',title: '定制发布', icon: 'md-radio-button-on', meta: {title: '定制发布'}, name: 'xiaohongshu_custom_pub', component: () => import('@/views/article/custom-pub.vue')},
    //         { path: 'list',title: '稿件列表', icon: 'md-radio-button-on', meta: {title: '小红薯资源发布 - 稿件列表'}, name: 'xiaohongshu_article_list', component: () => import('@/views/article/list.vue')},
    //     ]
    // },
    // {
    //     path: '/xiala',
    //     icon: 'ios-search',
    //     name: 'search_xiala',
    //     title: '搜索下拉',
    //     component: Main,
    //     children: [
    //         { path: 'introduce',title: '宣传页以及合作价', icon: 'md-radio-button-on', meta: {title: '搜索下拉 - 宣传页以及合作价'}, name: 'xiala_introduce', component: () => import('@/views/xiala/introduce.vue')},
    //         { path: 'data',title: '合作数据', icon: 'md-radio-button-on', meta: {title: '搜索下拉 - 合作数据'}, name: 'xiala_data', component: () => import('@/views/xiala/data.vue')}
    //     ]
    // },
    // {
    //     path: '/keyword',
    //     icon: 'md-list',
    //     name: 'keywords_ranking',
    //     title: '关键词排名',
    //     component: Main,
    //     children: [
    //         { path: 'introduce',title: '宣传页', icon: 'md-radio-button-on', meta: {title: '搜索下拉 - 宣传页以及合作价'}, name: 'ranking_info', component: () => import('@/views/keyword/introduce.vue')},
    //         { path: 'data',title: '合作数据', icon: 'md-radio-button-on', meta: {title: '搜索下拉 - 合作数据'}, name: 'ranking_data', component: () => import('@/views/keyword/data.vue')}
    //     ]
    // },
    // {
    //     path: '/util',
    //     menu_css: 'md-build',
    //     name: 'util',
    //     title: '小红薯工具',
    //     component: Main,
    //     children: [
    //         { path: 'blogger_account',title: '博主账户管理', menu_css: 'md-radio-button-on', meta: {title: '小红薯工具 - 博主账户管理'}, name: 'blogger_account', component: () => import('@/views/util/blogger_account.vue')},
    //         { path: 'violate_word_search',title: '违禁词查询', menu_css: 'md-radio-button-on', meta: {title: '小红薯工具 - 违禁词查询'}, name: 'violate_word_search', component: () => import('@/views/util/violate_word_search.vue')}
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: 'logo-buffer',
    //     name: 'management_setting',
    //     title: '管理设置',
    //     component: Main,
    //     children: [
    //         { path: 'user_list',title: '用户列表', icon: 'md-radio-button-on', meta: {title: '管理设置 - 用户列表'}, name: 'user_list', component: () => import('@/views/management/user_list.vue')},
    //         { path: 'recharge',title: '费用充值', icon: 'md-radio-button-on', meta: {title: '管理设置 - 费用充值'}, name: 'recharge', component: () => import('@/views/management/recharge.vue')},
    //         { path: 'recharge_log',title: '费用充值明细', icon: 'md-radio-button-on', meta: {title: '管理设置 - 费用充值明细'}, name: 'recharge_log', component: () => import('@/views/management/recharge_log.vue')},
    //         { path: 'receipt',title: '审核通过的销售单据', icon: 'md-radio-button-on', meta: {title: '管理设置 - 审核通过的销售单据'}, name: 'soldnote', component: () => import('@/views/management/soldnote.vue')}
    //     ]
    // },
    // {
    //     path: '/auth',
    //     icon: 'md-lock',
    //     name: 'authority',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'role',title: '角色管理', icon: 'md-radio-button-on', meta: {title: '权限管理 - 角色管理'}, name: 'role', component: () => import('@/views/auth/role.vue')},
    //         { path: 'menu',title: '菜单管理', icon: 'md-radio-button-on', meta: {title: '权限管理 - 菜单管理'}, name: 'menu', component: () => import('@/views/auth/menu.vue')},
    //     ]
    // },
];




// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403
];
