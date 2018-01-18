$(function(){
    $("#logout").click(function(){
        var data="";
        $.ajax({
            url: '/logout',
            type: 'post',
            data: data,
            success: function (res) {
                if (res == 'success') {
                    location.href = 'login';
                }else {
                    alert("登出失败");
                }
            },
        });
    });
    $("#return").click(function(){
        location.href = '/';
    })
})