$(function () {
    $("#login1").click(function () {
        location.href = 'login';
    });
    $("#register1").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var password1 = $("#password1").val();
        if ((password !== password1)||password==""||password==""||password1==null||password1==""){
            $("#password").css("border", "1px solid red");
            $("#password1").css("border", "1px solid red");
        } else if(username==""||username==""){
            $("#username").css("border", "1px solid red");
        }else if (password === password1) {
            $("#password").css("border", "");
            $("#password1").css("border", "");
            var data = {
                uname:username,
                upwd:password
            };
            $.ajax({
                url: '/register',
                type: 'post',
                data: data,
                success: function (res) {
                    if (res == 'success') {
                        location.href = 'login';
                    }else if(res == "repeat"){
                        $("#password").val("");
                        $("#password1").val("");                
                        $("#username").css("border", "1px solid red");
                        $("#display").css("display","");
                    }
                },
            });
        }
    });
});