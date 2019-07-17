import { get, post, del } from './http'

//首页登录
export function getUserLogin(data) { return post('api/v1/site/login', data); }

//退出登录
export function userLogout(data) { return post('api/v1/site/logout', data); }

//加载菜单列表
export function getCurrent(data) { return get('/api/v1/sys/menu/get-current-menu', data); }

// 用户列表
export function userList(data) { return get('api/v1/member/member/customer-list', data); }




//菜单管理 - 添加菜单
export function addMenuList(data) { return post('api/v1/sys/menu', data); }

//菜单管理 - 获取菜单列表
export function getMenuList(data) { return get('api/v1/sys/menu', data); }

//菜单管理 - 删除菜单
export function deleteMenu(data) { return del(`api/v1/sys/menu/${data}`); }

//菜单管理 - 获取菜单详情
export function getMenuDetail(data) { return get(`api/v1/sys/menu/${data}`, data); }

//菜单管理 - 获取菜单上级分类
export function getSuperiorList(data) { return get('api/v1/sys/menu/get-parent', data); }


//角色管理 - 获取角色列表信息
export function getRole(data) { return get('api/v1/sys/auth-role', data); }

//角色管理 - 获取角色详情
export function getRoleDetail(data) { return get(`api/v1/sys/auth-role/${data}`); }

//角色管理 - 添加/修改角色信息  ID【修改时需要】
export function addRole(data) { return post('api/v1/sys/auth-role', data); }



//消息中心 - 获取消息列表
export function getMessageList(data) { return get('api/v1/sys/notify-message', data); }

//消息中心 - 通知消息
export function getMessageInfo(data) { return get('api/v1/sys/notify-message/system', data); }

//消息中心 - 读过消息
//    读过信息 （传ids ，）
export function closeMessageInfo(data) { return post('api/v1/sys/notify-message/reader', data); }



//小红薯资源发布 - 选号发布 - 列表
export function xiaohongshuMediaInfo(data) { return get('api/v1/publish/red-book/choose-list', data); }

//小红薯资源发布 - 选号发布 - 筛选列表
export function xiaohonghsuInitCate(data) { return get('api/v1/publish/red-book/choose-search', data); }

//小红薯资源发布 - 选号发布 - 获取编辑时数据
export function editGetArticle(data) { return get(`api/v1/publish/article/${data}`, {}); }

//小红薯资源发布 - 选号发布 - 发布
export function publish(data) { return post('api/v1/publish/article', data); }

//小红薯资源发布 - 定制发布 - 发布
export function customPub(data) { return post('api/v1/publish/article/custom-create', data); }

//小红薯资源发布 - 定制发布 - 稿件列表
export function customPubList(data) { return get('api/v1/publish/red-book/custom-list', data); }

//小红薯资源发布 - 定制发布 - 筛选列表
export function customInitCate(data) { return get('api/v1/publish/red-book/custom-search', data); }

//小红薯资源发布 - 定制发布 - 获取编辑时数据
export function getDingzhiInfo(data) { return get('api/v1/publish/article/custom-view', data); }

//小红薯资源发布 - 定制发布 - 提交定制需求
export function addcustomDemand(data) { return post('api/v1/sys/notify-message/demand', data); }


//小红薯资源发布 - 稿件列表 - 选号稿件
export function xuanHaoArticle(data) { return get('api/v1/publish/article', data); }

//小红薯资源发布 - 稿件列表 - 选号稿件筛选
export function xhsInitCate(data) { return get('api/v1/publish/article/choose-search', data); }

//小红薯资源发布 - 稿件列表 - 定制稿件
export function customArticleList(data) { return get('api/v1/publish/article/custom-list', data); }

//小红薯资源发布 - 稿件列表 - 查看单个稿件
export function customAritcle(data) { return get('api/v1/publish/article/custom-article', data); }

//小红薯资源发布 - 稿件列表 - 收藏 || 取消收藏
export function collectArticle(data) { return get('api/v1/publish/red-book/favorite', data); }




//小红薯定制 - 小红薯稿件 - 获取多条数据
//link 获取多条链接，只取链接
//fengmian 获取多条收录图片
export function getMultiData(data) { return post('/xiaohongshu/article/getMultiData', data); }


//管理设置 - 用户列表 - 获取用户列表
export function getUserList(data) { return get('api/v1/member/member', data); }

//管理设置 - 用户列表 - 添加用户
export function addUser(data) { return post('api/v1/member/member', data); }

//管理设置 - 用户列表 - 获取用户详情
export function getUserInfo(data) { return get(`api/v1/member/member/${data}`); }

//管理设置 - 用户列表 - 删除用户
export function delUser(data) { return del(`api/v1/member/member/${data}`); }

//管理设置 - 用户列表 - 获取营销顾问列表
export function getMarketList(data) { return get('api/v1/member/member/market-list', data); }

//管理设置 - 用户列表 - 获取销售列表
export function getSaleList(data) { return get('api/v1/member/member/sale-list', data); }

//管理设置 - 用户列表 - 删除资质图片
export function delAttachment(data) { return post('api/v1/member/member/remove-attachment', data); }


//管理设置 - 费用充值 - 列表
export function rechargeList(data) { return get('api/v1/member/receipt/recharge-list', data); }

//管理设置 - 费用充值 - 充值明细
export function rechargeDetail(data) { return get('api/v1/member/receipt/recharge-view', data); }

//管理设置 - 费用充值 - 积分充值明细
export function integralRechargeDetail(data) { return get('api/v1/member/receipt/integral-details', data); }

//管理设置 - 费用充值 - 手动充值费用
export function recharge(data) { return post('api/v1/member/receipt/recharge', data); }

//管理设置 - 费用充值明细 - 列表
export function rechargeInfoList(data) { return get('api/v1/member/receipt/recharge-details', data); }


//管理设置 - 审核通过的销售单据 - 列表
export function getReceiptList(data) { return get('api/v1/member/receipt', data); }

//管理设置 - 审核通过的销售单据 - 自动充值
export function autoRecharge(data) { return post('api/v1/member/receipt/auto-recharge', data); }

//管理设置 - 审核通过的销售单据 - 人工充值
export function handelRecharge(data) { return post('api/v1/member/receipt/handle-recharge', data); }

//管理设置 - 审核通过的销售单据 - 批量审核不通过
export function receiptAudit(data) { return post('api/v1/member/receipt/audit', data); }


//小红书资源大全 - 列表
export function xiaohongshuKol(data) { return get('api/v1/kol', data); }

//小红书资源大全 - 收藏 || 取消收藏
export function kolCollect(data) { return get('api/v1/kol/favorite', data); }


//搜索下拉 - 用户列表
export function pullCustomerList(data) { return get('api/v1/publish/pull/customer-list', data); }

//搜索下拉 - 列表
export function pullDataList(data) { return get('api/v1/publish/pull', data); }

//搜索下拉 - 添加
export function addPullData(data) { return post('api/v1/publish/pull', data); }

//搜索下拉 - 删除
export function delPullData(data) { return del(`api/v1/publish/pull/${data}`); }

//搜索下拉 - 关键词合作类型
export function getCooperationType(data) { return get('api/v1/publish/pull/cooperation-type', data); }

//搜索下拉 - 更新上线日期
export function updatedOnline(data) { return post('api/v1/publish/pull/online-time', data); }

//搜索下拉 - 获取历史上线截图
export function getScreenLog(data) { return get('api/v1/publish/pull/screen-log', data); }

//搜索下拉 - 补时间
export function repairTime(data) { return post('api/v1/publish/pull/repair', data); }

//搜索下拉 - 总消费啥的
export function pullOther(data) { return get('api/v1/publish/pull/other-data', data); }

// 搜索下拉 - 消费明细
export function pullConsumeLog(data) { return get('api/v1/publish/pull/search', data); }

// 搜索下拉 - 编辑
export function editPull(data) { return post('api/v1/publish/pull/rewrite', data); }

// 搜索下拉 - 添加备注
export function pullRemark(data) { return post('api/v1/publish/pull/remark', data); }

// 搜索下拉 - 备注日志
export function pullRemarkLog(data) { return get('api/v1/publish/pull/remark-log', data); }

//搜索下拉 - 修改状态
export function pullChangeStatus(data) { return post('api/v1/publish/pull/change-status', data); }

//搜索下拉 - 获取历史笔记数量
export function getPullNoteLog(data) { return get('api/v1/publish/pull/note-num-log', data); }

//搜索下拉 - 获取历史排名
export function getPullRnkLog(data) { return get('api/v1/publish/pull/rank-log', data); }


//关键词排名 - 用户列表
export function keywordCustomerList(data) { return get('api/v1/publish/keyword/customer-list', data); }

//关键词排名 - 总消费啥的
export function keywordOther(data) { return get('api/v1/publish/keyword/other-data', data); }

//关键词排名 - 列表
export function keywordList(data) { return get('api/v1/publish/keyword', data); }

//关键词排名 - 添加
export function addKeyword(data) { return post('api/v1/publish/keyword', data); }

//关键词排名 - 删除
export function delKeyword(data) { return del(`api/v1/publish/keyword/${data}`); }

//关键词排名 - 更新上线日期
export function keywordUpdatedOnline(data) { return post('api/v1/publish/keyword/online-time', data); }

//关键词排名 - 获取历史上线截图
export function getKeywordScreenLog(data) { return get('api/v1/publish/keyword/screen-log', data); }

//关键词排名 - 补时间
export function keywordrepairTime(data) { return post('api/v1/publish/keyword/repair', data); }

//关键词排名 - 上传素材  文案  material_type	类型【0素材 1文案】
export function uploadMaterial(data) { return post('api/v1/file/images-material', data); }

//关键词排名 - 文案审核
export function keywordAudit(data) { return post('api/v1/publish/keyword/audit', data); }

//关键词排名 - 消费明细
export function keywordConsumeLog(data) { return get('api/v1/publish/keyword/search', data); }

//关键词排名 - 编辑
export function editKeyword(data) { return post('api/v1/publish/keyword/rewrite', data); }

//关键词排名 - 添加备注
export function keywordRemark(data) { return post('api/v1/publish/keyword/remark', data); }

//关键词排名 - 备注日志
export function keywordRemarkLog(data) { return get('api/v1/publish/keyword/remark-log', data); }

//关键词排名 - 修改状态
export function keywordChangeStatus(data) { return post('api/v1/publish/keyword/change-status', data); }

//关键词排名 - 获取历史笔记数量
export function getKeywordNoteLog(data) { return get('api/v1/publish/keyword/note-num-log', data); }

//关键词排名 - 获取历史排名
export function getKeywordRnkLog(data) { return get('api/v1/publish/keyword/rank-log', data); }

//关键词排名 - 关键词合作情况查询 - 新增 暂停关键词
export function addKeywordSearch(data) { return post('api/v1/publish/keyword/create-details', data); }

//关键词排名 - 关键词合作情况查询 - 列表
export function KeywordSearchList(data) { return get('api/v1/publish/keyword/cooperation-details', data); }

//关键词排名 - 关键词合作情况查询 - 删除
export function deleteKeywordSearch(data) { return get('api/v1/publish/keyword/delete-details', data); }



//管理设置 - 消息列表 - 列表 
export function getNotice(data) { return get('api/v1/sys/notify-message/search', data); }

//管理设置 - 消息列表 - 添加 
export function addNotice(data) { return post('api/v1/sys/notify-message', data); }

//管理设置 - 消息列表 - 获取类型列表 
export function getNoticeTypeList(data) { return get('api/v1/sys/notify-message/type', data); }


//小红书学院 - 添加
export function addXueyuan(data) { return post('api/v1/article', data); }

//小红书学院 - 获取文章列表
export function getXueyuanList(data) { return get('api/v1/article', data); }

//小红书学院 - 审核文章
export function auditArticle(data) { return post('api/v1/article/audit', data); }

//小红书学院 - 删除文章
export function delArticle(data) { return del(`api/v1/article/${data}`); }

//小红书学院 - 获取文章详情
export function getArticleDetail(data) { return get(`api/v1/article/${data}`); }

//小红书学院 - 获取已通过审核文章列表
export function getArticleList(data) { return get('api/v1/article/search', data); }

//小红书学院 - 添加、编辑标签
export function addArticleTag(data) { return post('api/v1/article/create-tag', data); }

//小红书学院 - 标签列表
export function getArticleTagList(data) { return get('api/v1/article/get-tag', data); }

//小红书学院 - 删除标签
export function delArticleTag(data) { return get('api/v1/article/delete-tag', data); }


//种草营销 - 用户列表
export function seedingCustomerList(data) { return get('api/v1/publish/seeding/customer-list', data); }

//种草营销 - 添加、修改 套餐信息
export function addSeeding(data) { return post('api/v1/publish/combo', data); }

//种草营销 - 获取发布关联
export function comboCustomList(data) { return get('api/v1/publish/combo/custom-list', data); }

//种草营销 - 获取列表
export function getSeedingList(data) { return get('api/v1/publish/combo', data); }

//种草营销 - 选择套餐列表
export function packageList(data) { return get('api/v1/publish/combo/combo-list', data); }

//种草营销 - 充值套餐
export function seedingRecharge(data) { return post('api/v1/publish/combo/recharge', data); }

//种草营销 - 套餐id获取对应的用户所有的消费信息
export function comboConsumeLog(data) { return post('api/v1/publish/combo/details', data); }

//种草营销 - 发布
export function seedingPub(data) { return post('api/v1/publish/seeding', data); }

//种草营销 - 稿件列表
export function getSeedingPubList(data) { return get('api/v1/publish/seeding', data); }

//种草营销 - 稿件列表 - 单个数据
export function seedingAritcle(data) { return get('api/v1/publish/seeding/seeding-article', data); }

//种草营销 - 稿件列表 - 编辑 发布
export function editSeeding(data) { return get(`api/v1/publish/seeding/${data}`); }

//种草营销 - 稿件列表 - 重发 获取详情
export function editRetrySeeding(data) { return get(`api/v1/publish/seeding/retry-view`, data); }

//种草营销 - 稿件列表 - 重发
export function retrySeeding(data) { return post(`api/v1/publish/seeding/retry`, data); }

// 种草营销 - 稿件列表 - 复制
export function copySeeding(data) { return post('api/v1/publish/seeding/copy', data); }

// 种草营销 - 稿件列表 - 下载昨日发布稿件
export function downloadYesterdayArticle(data) { return get('api/v1/publish/seeding/yesterday-article', data); }



//种草营销 - 总消费啥的
export function seedingOther(data) { return get('api/v1/publish/seeding/other-data', data); }

//种草营销 - 消费明细
export function seedingConsumeLog(data) { return get('api/v1/publish/seeding/search', data); }

//种草营销 - 备注
export function comboRemark(data) { return post('api/v1/publish/combo/remark', data); }

//种草营销 - 备注日志
export function comboRemarkLog(data) { return get('api/v1/publish/combo/remark-log', data); }

//种草营销 - 素材库 - 添加 编辑
export function seedingAddMaterial(data) { return post('api/v1/publish/seeding-material', data); }

//种草营销 - 素材库 - 列表
export function getSeedingMaterial(data) { return get('api/v1/publish/seeding-material', data); }

//种草营销 - 素材库 - 编辑时获取详情
export function getSeedingMaterialDetail(data) { return get(`api/v1/publish/seeding-material/${data}`); }

//种草营销 - 素材库 - 备注
export function materialRemark(data) { return post('api/v1/publish/seeding-material/remark', data); }

//种草营销 - 素材库 - 备注日志
export function materialRemarkLog(data) { return get('api/v1/publish/seeding-material/remark-log', data); }

//种草营销 — 素材库 - 添加素材 选择用户获取对应的客户拥有的套餐及余量
export function selectUserCombo(data) { return get('api/v1/publish/combo/search', data); }

//种草营销 — 素材库 - 素材复制
export function materialCopy(data) { return post('api/v1/publish/seeding-material/copy', data); }


//种草营销 - 文章库 - 列表
export function getSeedingArticle(data) { return get('api/v1/publish/seeding-article', data); }

//种草营销 - 文章库 - 详情
export function getSeedingArticleDetail(data) { return get(`api/v1/publish/seeding-article/${data}`); }

//种草营销 - 文章库 - 备注
export function seedingArticleRemark(data) { return post('api/v1/publish/seeding-article/remark', data); }

//种草营销 - 文章库 - 备注日志
export function seedingArticleRemarkLog(data) { return get('api/v1/publish/seeding-article/remark-log', data); }

//种草营销 - 文章库 - 审核
export function seedingArticleAudit(data) { return post('api/v1/publish/seeding-article/audit', data); }

//种草营销 - 文章库 - 发布获取详情
export function seedingArticlePubDetail(data) { return post('api/v1/publish/seeding-article/details', data); }

//种草营销 - 文章库 - 发布 || 保存
export function seedingArticelPub(data) { return post('api/v1/publish/seeding-article', data); }

//种草营销 - 文章数据 - 列表
export function seedingArticleData(data) { return get('api/v1/publish/seeding-article/pub-article', data); }

//种草营销 - 文章数据 - 用户列表
export function seedingCustomList(data) { return get('api/v1/publish/seeding/customer-all', data); }




//小红书工具 - 博主账号管理 - 列表
export function bloggerAccountList(data) { return get('api/v1/tools/blogger', data); }

//小红书工具 - 博主账号管理 - 添加博主链接
export function addBloggerLink(data) { return post('api/v1/tools/blogger', data); }

//小红书工具 - 博主账号管理 - 积分消耗明细
export function integralConsumeLog(data) { return get('api/v1/tools/blogger/integral-details', data); }

//小红书工具 - 博主账号管理 - 创建博主文章链接
export function addBloggerArticleLink(data) { return post('api/v1/tools/blogger/create-note', data); }

//小红书工具 - 博主账号管理 - 博主列表
export function getBloggerList(data) { return get('api/v1/tools/blogger/blogger-list', data); }

//小红书工具 - 博主账号管理 - 校验当前可免费添加几篇文章链接
export function freeNumber(data) { return get('api/v1/tools/blogger/check-note-num', data); }

//小红书工具 - 博主账号管理 - 查看文章数据
export function getBloggerArticle(data) { return get('api/v1/tools/blogger/note-list', data); }

//小红书工具 - 违禁词查询
export function check_forbidden_text(data) { return post('api/v1/tools/check-word/check', data); }

//小红书工具 - 违禁词查询
export function textIntegralConsumeLog(data) { return get('api/v1/tools/check-word/integral-details', data); }

//小红书工具 - 获取用户的积分详情
export function getIntegralDetails(data) { return get('api/v1/member/member/integral-details', data); }


//红薯霸屏王 - 红薯账号管理 - 列表
export function getScreenAccountList(data) { return get('api/v1/screen/blogger', data); }

//红薯霸屏王 - 红薯账号管理 -添加注册信息
export function addBloggerInfo(data) { return post('api/v1/screen/blogger', data); }

//红薯霸屏王 - 红薯账号管理 - 获取客户列表
export function getScreenCustomerList(data) { return get('api/v1/screen/blogger/customer-list', data); }

//红薯霸屏王 - 红薯账号管理 - 添加博主链接
export function addBloggerLinkInfo(data) { return post('api/v1/screen/blogger/create-link', data); }

//红薯霸屏王 - 红薯账号管理 - 博主列表
export function getScreenBloggerList(data) { return get('api/v1/screen/blogger/choose-list', data); }

//红薯霸屏王 - 红薯账号管理 - 备注
export function screenBloggerRemark(data) { return post('api/v1/screen/blogger/remark', data); }

//红薯霸屏王 - 红薯账号管理 - 备注日志
export function screenBloggerRemarkLog(data) { return get('api/v1/screen/blogger/remark-log', data); }



//红薯霸屏王 - 霸屏素材库 - 列表
export function getScreenMaterial(data) { return get('api/v1/screen/material', data); }

//红薯霸屏王 - 霸屏素材库 - 选择用户 - 获取对应的博主账号
export function getUserInBloggerList(data) { return get('api/v1/screen/blogger/blogger-list', data); }

//红薯霸屏王 - 霸屏素材库 - 选择用户 - 获取对应的关键词
export function getUserInKeywordList(data) { return get('api/v1/screen/keyword/keyword-list', data); }

//红薯霸屏王 - 霸屏素材库 - 写稿关联列表
export function screenTrelevance(data) { return get('api/v1/screen/material/writer-list', data); }

//红薯霸屏王 - 霸屏素材库 - 创建、编辑
export function createScreenMaterial(data) { return post('api/v1/screen/material', data); }

//红薯霸屏王 - 霸屏素材库 - 编辑时获取详情
export function getScreenMaterialDetail(data) { return get(`api/v1/screen/material/${data}`); }

//红薯霸屏王 - 霸屏素材库 - 备注
export function screenMaterialRemark(data) { return post('api/v1/screen/material/remark', data); }

//红薯霸屏王 - 霸屏素材库 - 备注日志
export function screenMaterialRemarkLog(data) { return get('api/v1/screen/material/remark-log', data); }

//红薯霸屏王 - 霸屏素材库 - 复制
export function screenMaterialCopy(data) { return post('api/v1/screen/material/copy', data); }



//红薯霸屏王 - 霸屏文章库 - 列表
export function getScreenArticle(data) { return get('api/v1/screen/article', data); }

//红薯霸屏王 - 霸屏文章库 - 审核 查看详情
export function screenArticleDetail(data) { return get(`api/v1/screen/article/${data}`); }

//红薯霸屏王 - 霸屏文章库 - 审核
export function screenArticleAudit(data) { return post('api/v1/screen/article/audit', data); }

//红薯霸屏王 - 霸屏文章库 - 备注
export function screenArticleRemark(data) { return post('api/v1/screen/article/remark', data); }

//红薯霸屏王 - 霸屏文章库 - 备注日志
export function screenArticleRemarkLog(data) { return get('api/v1/screen/article/remark-log', data); }

//红薯霸屏王 - 霸屏文章库 - 获取文章库内指定文章的详情
export function getScreenArticleDetails(data) { return post('api/v1/screen/article/details', data); }

//红薯霸屏王 - 霸屏文章库 - 发布文章
export function screenPubArticle(data) { return post('api/v1/screen/article', data); }

//红薯霸屏王 - 霸屏文章库 - 批量修改文章
export function batchEditArticle(data) { return post('api/v1/screen/article/rewrite', data); }

//红薯霸屏王 - 霸屏文章库 - 添加文章
export function screenAddArticle(data) { return post('api/v1/screen/article/local-create', data); }

//红薯霸屏王 - 霸屏文章库 - 单个文章的所有评论信息
export function getArticleComments(data) { return get('api/v1/screen/article/comments', data); }

//红薯霸屏王 - 霸屏文章库 - 回复评论
export function replyArticleComments(data) { return post('api/v1/screen/article/reply', data); }

//红薯霸屏王 - 霸屏文章库 - 批量设置收录
export function screenBatchRecord(data) { return post('api/v1/screen/article/batch-record', data); }



//红薯霸屏王 - 霸屏关键词推荐 - 添加关键词
export function screenAddKeywordlib(data) { return post('api/v1/screen/keyword-lib', data); }

//红薯霸屏王 - 霸屏关键词推荐 - 列表
export function getScreenKeywordlibList(data) { return get('api/v1/screen/keyword-lib', data); }

//红薯霸屏王 - 霸屏关键词推荐 - 删除关键词
export function delScreenKeywordlib(data) { return post('api/v1/screen/keyword-lib/remove', data); }

//红薯霸屏王 - 霸屏关键词推荐 - 编辑关键词
export function editScreenKeywordlib(data) { return post('api/v1/screen/keyword-lib/rewrite', data); }

//红薯霸屏王 - 霸屏关键词推荐 - 获取省份/城市/地区
export function getCity(data) { return get('api/v1/common/province/province', data); }


//红薯霸屏王 - 排名数据管理 - 列表
export function rankingDataList(data) { return get('api/v1/screen/data', data); }

//红薯霸屏王 - 排名数据管理 - 备注
export function screenDataRemark(data) { return post('api/v1/screen/data/remark', data); }

//红薯霸屏王 - 排名数据管理 - 备注日志
export function screenDataRemarkLog(data) { return get('api/v1/screen/data/remark-log', data); }

//红薯霸屏王 - 排名数据管理 - 历史排名
export function screenDataRankLog(data) { return get('api/v1/screen/data/rank-log', data); }

//红薯霸屏王 - 排名数据管理 - 导出
export function screenDataDownLoad(data) { return get('api/v1/screen/data/export', data); }

//红薯霸屏王 - 排名数据管理 - 重查
export function screenDataReset(data) { return post('api/v1/screen/data/retry', data); }

//红薯霸屏王 - 排名数据管理 - 编辑
export function screenDataEdit(data) { return post('api/v1/screen/data/rewrite', data); }

//红薯霸屏王 - 排名数据管理 - 返表 微信发送通知
export function sendWechtMessage(data) { return post('api/v1/screen/data/template-message', data); }

//红薯霸屏王 - 排名数据管理 - 用户列表
export function screenCutomerList(data) { return get('api/v1/screen/blogger/customer-all', data); }




//红薯霸屏王 - 客户数据统计 - 添加关键词
export function addScreenKeyword(data) { return post('api/v1/screen/keyword', data); }

//红薯霸屏王 - 客户数据统计 - 关键词列表
export function getScreenKeywordList(data) { return get('api/v1/screen/keyword', data); }

//红薯霸屏王 - 客户数据统计 - 删除
export function delScreenKeyword(data) { return del(`api/v1/screen/keyword/${data}`); }


//红薯霸屏王 - 红薯商务通 - 获取聊天列表
export function getScreenChatList(data) { return get('api/v1/screen/chat', data); }

//红薯霸屏王 - 红薯商务通 - 查看指定用户的聊天记录
export function getScreenChatLog(data) { return get('api/v1/screen/chat/chat-log', data); }

//红薯霸屏王 - 红薯商务通 - 回复消息
export function screenReplymsg(data) { return post('api/v1/screen/chat/reply', data); }

//红薯霸屏王 - 红薯商务通 - 备注
export function screenChatRemark(data) { return post('api/v1/screen/chat/remark', data); }

//红薯霸屏王 - 红薯商务通 - 备注日志
export function screenChatRemarkLog(data) { return get('api/v1/screen/chat/remark-log', data); }

//红薯霸屏王 - 红薯商务通 - 修改会话状态
export function screenRewriteChat(data) { return post('api/v1/screen/chat/rewrite', data); }

//红薯霸屏王 - 红薯商务通 - 查看文章列表
export function screenChatArticleList(data) { return get('api/v1/screen/blogger/note-list', data); }




//个人中心 - 获取个人信息
export function getMemberInfo(data) { return get('api/v1/member/person', data); }

//个人中心 - 修改个人信息
export function updatedMemberInfo(data) { return post('api/v1/member/person/rewrite', data); }

//个人中心 - 修改密码
export function updatedPassword(data) { return post('api/v1/member/person/alter-password', data); }

//个人中心 - 二维码
export function getQrcode(data) { return get('api/v1/member/person/qrcode', data); }

//个人中心 - 轮询  是否绑定微信
export function isBindWechat(data) { return post('api/v1/member/person/check', data); }

//个人中心 - 解除绑定 微信账号
export function unbindWechat(data) { return post('api/v1/member/person/unbind', data); }

