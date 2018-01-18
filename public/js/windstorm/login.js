$(function () {
    $("#register0").click(function () {
        location.href = 'register';
    });
    $("#login0").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var data = { "name": username, "pwd": password };
        $.ajax({
            url: '/login',
            type: 'post',
            data: data,
            success: function (status) {
                if (status == 'success') {
                    location.href = '/start';
                }
                if (status == 'fail') {
                    location.href = 'login';
                }
            },
        });
    });
});
