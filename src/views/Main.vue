<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflowY:'auto'}" v-if="!$store.state.app.isFromMobile">
            <shrinkable-menu 
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/logo.svg" key="max-logo" />
                    <img v-show="shrink" src="../images/logo_min.svg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="sidebar-menu-con" style="width:100%;overflow:auto;margin-top:60px; overflowY:auto" v-else v-show="mobileMenu">
            <shrinkable-menu 
                :shrink="!$store.state.app.isFromMobile"
                @on-change="handleSubmenuChange"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: !$store.state.app.isFromMobile ? shrink?'60px':'200px': '0', height: !$store.state.app.isFromMobile?'100px':'60px'}">
            <div class="main-header">
                <div class="navicon-con" v-if="!$store.state.app.isFromMobile">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="md-menu" size="32"></Icon>
                    </Button>
                </div>
                <div class="navicon-con mobile-navicon" v-if="$store.state.app.isFromMobile">
                    <Button type="text" @click="toggleMobileClick">
                        <Icon type="md-menu" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div v-if="!$store.state.app.isFromMobile">
                        <!-- <network-speed></network-speed> -->
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                        <message-tip v-model="mesCount"></message-tip>
                    </div>
                    
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="md-arrow-dropdown"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown> 
                            <img src="../images/avatar.svg" alt="头像" style="width:32px;height:32px;">
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con" v-if="!$store.state.app.isFromMobile">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: !$store.state.app.isFromMobile ? shrink?'60px':'200px': '0px', top: !$store.state.app.isFromMobile?'100px':'60px'}">
            <div class="single-page" :style="{margin: !$store.state.app.isFromMobile?'10px':'0'}">
                <keep-alive v-if="$route.meta.keepAlive">
                    <router-view></router-view>
                </keep-alive>
                <router-view v-else></router-view>
            </div>
        </div>
        <!-- 通知消息 -->
        <alert-msg></alert-msg>
        <!-- 上传中 -->
        <Spin v-if="progress" fix size="large"><Icon type="ios-loading" class="demo-spin-icon-load" size=25></Icon>上传中不要离开...</Spin>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import networkSpeed from './main-components/network-speed.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import alertMsg from '@/views/message/alert-msg';   //通知消息
    import { mapState } from 'vuex';
    import {userLogout} from '@/libs/api';

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            networkSpeed,
            alertMsg
        },
        data () {
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                spinShow:true,
                mobileMenu:false,
            };
        },
        computed: {
            ...mapState({
                menuList: state => state.app.menuList,   //菜单列表
                pageTagsList: state => state.app.pageOpenedList,// 打开的页面的页面对象
                currentPath: state => state.app.currentPath,  //当前面包屑数组
                cachePage: state => state.app.cachePage,
                lang: state => state.app.lang,   
                mesCount: state => state.app.messageCount,  //通知消息数量
                progress: state => state.app.progress       //是否上传word中
            }),
            // menuList () {
            //     return this.$store.state.app.menuList;
            // },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                // this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 0;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 0);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            toggleMobileClick(){
                this.mobileMenu = !this.mobileMenu;
            },
            handleClickUserDropdown (name) {
                //个人中心
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录 
                    userLogout({group: 'pc'}).then(res => {
                        if(res.code == 200){
                            this.$store.commit('logout', this);
                            this.$store.commit('clearOpenedSubmenu');
                            this.$router.push({
                                name: 'login'
                            });
                            window.removeEventListener('resize', this.scrollBarResize);
                        }else{
                            this.$Notice.error({title: res.message});
                        }
                    })
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                if(this.isFromMobile()){
                    this.mobileMenu = false;
                }
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },

            //移动端打开
            isFromMobile() {
                var agent = navigator.userAgent.toLowerCase();
                var ipad = agent.match(/(ipad).*os\s([\d_]+)/),
                    isIphone = !ipad && agent.match(/(iphone\sos)\s([\d_]+)/),
                    isAndroid = agent.match(/(android)\s+([\d.]+)/),
                    isWinPhone = agent.match(/(windows mobile)\s+([\d.]+)/),
                    isMobile = ipad || isIphone || isAndroid || isWinPhone;
                return isMobile;
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            openedSubmenuArr () {
                setTimeout(() => {
                    // this.scrollBarResize();
                }, 5000);
            }
        },
        mounted () {
            this.init();
            var _this = this;
            window.addEventListener('resize', function(){
                let clientWidth = document.body.clientWidth;
                clientWidth>1351 ? _this.shrink=false : _this.shrink=true;
            });
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            let clientWidth = document.body.clientWidth;
            clientWidth>800 ? this.shrink=false : this.shrink=true;
            if(this.isFromMobile()){
                this.$store.commit('fromMobile', true);
            }

            //权限
            if(localStorage.WMGX_auth){
                this.$store.commit('setPermission', localStorage.WMGX_auth);
            }
        }
    };
</script>
<style lang="less">
    .ivu-dropdown{
        margin-right:5px;
    }
    .ivu-notice-title{
        white-space:normal;
    }
    .sidebar-menu-con{
        position: relative;
        .zhuge{
            // position: absolute;
            // bottom:0;
            width:100%;
            text-align:center;
            img{
                width:80%;
            }
            i{
                color:#fff;
                position: absolute;
                right:20px;
                background:rgba(0,0,0,0.5);
                padding:2px 4px;
                cursor: pointer;
            }
            i:hover{
                background:rgba(0,0,0,0.8)
            }
        }
    }
</style>
