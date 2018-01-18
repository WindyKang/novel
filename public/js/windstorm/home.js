$(function () {
    $("#jiansuo").click(function () {
        var value = $("#search").val();
        fun(value);
    });
    $('#search').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            var value = $("#search").val();
            fun(value);
        }
    })
})

function fun(val) {
    var data = {
        data: val,
    }
    if (val) {
        $.ajax({
            type: "post",
            url: "/home",
            data: data,
            success: function (res) {
                if (res.success) {
                    location.href = "/start?name=" + res.data[0].NAME;
                    // alert(res.data[0].NAME);
                } else {
                    alert(res);
                }
            }
        })
    }
}