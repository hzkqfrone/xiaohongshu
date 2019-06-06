"use strict";
function scriptload(t, i) {
    if (!timeout[i]) {
        timeout[i] = !0;
        var e = (new Date).getTime() - t;
        600 > e ? $("#" + i).html('<span class="success">网络正常:' + e + "ms</span>") : 3e3 > e ? $("#" + i).html('<span class="warn">网络延迟:' + e + "ms</span>") : $("#" + i).html('<span class="error">网络拥堵:' + e + "ms</span>")
    }
}
function scriptError(t, i) {
    if (!timeout[i]) {
        timeout[i] = !0;
        var e = (new Date).getTime() - t;
        $("#" + i).html('<span class="error">请求失败:' + e + "ms")
    }
}
function createIMG(t, i, type) {
    var e = document.createElement("img");
    if (e.style.display = "none",
    e) {
        var a = (new Date).getTime();
        e.domain = t,
        e.onload = scriptload.bind(this, a, i),
        e.onerror = scriptError.bind(this, a, i);
        if(type == 'hz'){
            var o = t + "/images/favicon.ico";
        }else{
            var o = "https://" + t + "/favicon.ico";
        }
        "qq" === i && (o = "http://" + t + "/favicon.ico"),
        e.src = o + "?" + String(Math.random()),
        e.id = "img_" + t,
        // document.getElementById("imgload").appendChild(e),
        setTimeout(function() {
            timeout[i] || (timeout[i] = !0,
            $("#" + i).html('<span class="error">请求超时</span>'))
        }, 1e4)
    }
}
function supportStorage() {
    try {
        return "localStorage"in window && null !== window.localStorage
    } catch (t) {
        return !1
    }
}
window.onerror = function(t) {
    console.log(t, error["static"])
}
;
var timeout = {};
$(document).ready(function() {
    function t() {
        for (var t in i)
            createIMG(t, i[t], 'hz');
        for (var t in e)
            createIMG(t, e[t])
    }
    var i = {
        "http://www.meijiebao.org.cn": "meijiebao",
        "https://cdn.dmh.bjhzkq.com": "cdndmh",
        "http://api.meijiebao.org.cn": "apimeijiebao",
    }
      , e = {
        "www.baidu.com": "baidu",
        "www.sina.com.cn": "sina",
        "www.taobao.com": "taobao",
        "mp.weixin.qq.com": "weixin"
    };
    // $("#os").text(platform.os.toString()),
    // $("#ua").text(navigator.userAgent),
    // $("#cookie").text(navigator.cookieEnabled ? "开启" : "关闭"),
    // $("#localStorage").text(supportStorage() ? "开启" : "关闭"),
    // $.get("/zone", function(t) {
    //     $("#zone").text(t)
    // }),
    t(),
    setInterval(t, 1e5)
    
});
$('#checkbox').change(function(){
    console.log($(this).attr())
})