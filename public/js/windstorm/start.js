var afterUrl;
var beforeUrl;

$("#sub").click(function () {
    var url;
    fun(url);
});

$("#nextstep1").click(function () {
    fun(afterUrl);
});

$("#upstep1").click(function () {
    fun(beforeUrl);
});
$("#nextstep2").click(function () {
    fun(afterUrl);
});

$("#upstep2").click(function () {
    fun(beforeUrl);
});

document.onkeydown = function (event) {
    if (event.keyCode == "37") {
        fun(beforeUrl);
    }
    if (event.keyCode == "39") {
        fun(afterUrl);  
    }
}

function fun(url) {
    $(window).scrollTop(0);//回到网页顶部
    var data = {
        url: url,
    }
    $.ajax({
        url: '/start',
        type: 'post',
        data: data,
        success: function (res) {
            if (res.success) {
                var str = "";
                // alert(window.location.toString());//获取当前网页url
                afterUrl = res.data[0].afterUrl;
                beforeUrl = res.data[0].beforeUrl
                for (var i = 0; i < res.data.length; i++) {
                    str = str + res.data[i].title + "<br/>" + res.data[i].content + "<br/><br/><br/>";
                }
                $("#content").html(str);
            } else {
                location.href = "/";
            }
        }
    })
}