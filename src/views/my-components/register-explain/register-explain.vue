<template>
    <Card>
        <Steps :current="0" direction="vertical">
            <Step title="注册账号" status="process" content="填写账号、密码、联系方式，点击<b style='color:#fb7403'>[提交]</b>完成注册"></Step>
            <Step title="添加资源" status="process" content="点击<b style='color:#fb7403'>[我的资源-添加]</b>按照要求填写自有媒体资源信息 提交等待审"></Step>
            <Step title="查看订单" status="process" content="点击<b style='color:#fb7403'>[我的订单]</b>然后开始执行订单完成 按要求操作回链 退稿"></Step>
            <Step title="申请提现" status="process" content="订单完成7天之后可在后<b style='color:#fb7403'>[个人中心-提现 ]</b>申请款项"></Step>
            <div style="border-bottom:1px dashed #e5e5e5;"></div>
            <Step title="充值发稿" status="process" content="登陆后台，点击<b style='color:#fb7403'>[个人在线-我要充值]</b>，选择您的支付方式充值，充值发布文章费用"></Step>
            <Step title="开始发稿" status="process" content="点击<b style='color:#fb7403'>[我要发稿- 文章发布]</b>，选择您要发布的媒体，点击<b style='color:#fb7403'>[下一步]</b>，填写标题、内容，点击<b style='color:#fb7403'>[提交]</b>完成发布"></Step>
            <Step title="查看文章" status="process" content="点击<b style='color:#fb7403'>[文章管理- 发稿列表]</b>，查看文章发布状态，文章发布成功后后台会显示链接，发布时间一般在24小时"></Step>
            <Step title="售后服务" status="process" content="如果您的文章发布没有发布成功不收费，如您有任何疑问有，可以通过后台显示的QQ联系我们"></Step>
        </Steps>
    </Card>
</template>
<script>
export default {
    mounted(){
        this.$nextTick(function () {
           var str =  document.querySelectorAll('.ivu-steps-content');
           for(var i = 0;i < str.length;i++){
               str[i].innerHTML = str[i].innerText;
           }
        })
    }
}
</script>
