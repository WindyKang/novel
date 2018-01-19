const https = require("https");
const http = require("http");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const BufferHelper = require("bufferhelper");
const Url = require("url");

exports.interest = function (url, cb) {
    splider(url, cb);
};
exports.interests = function (url, cb) {
    spliders(url, cb);
};

var i = 0;

function splider(url, cb) {
    var rootUrl = "";
    var ArrayUrl = url.split("/");
    var httpType = ArrayUrl[0];
    for (var i = 0; i < ArrayUrl.length - 1; i++) {
        rootUrl = rootUrl + ArrayUrl[i] + "/";
    }
    // var path = Url.parse(url).path;
    if (httpType == "http:") {

        http.get(url, function (res) {
            readAWrite(res, rootUrl, function (err, data) {
                cb(err, data);
            });
        });

    } else if (httpType == "https:") {

        https.get(url, function (res) {
            readAWrite(res, rootUrl, function (err, data) {
                cb(err, data);
            });
        });

    } else {
        cb("worry httpType", null);
    }
}
function readAWrite(res, rootUrl, cb) {

    var html = "";
    var data = [];
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
    });
    res.on("end", function () {
        //将二进制字符流进行编码
        var html = iconv.decode(bufferHelper.toBuffer(), "utf-8")
        //用cheerio模块进行页面解析
        var $ = cheerio.load(html);
        //获取页面的编码格式
        var charset = $("head meta").attr("charset");
        if (!charset) {
            // 处理<meta http-equiv="Content-Type" content="text/html; charset=gbk">格式
            $("head meta").each(function (i, elem) {
                var cont = $(this).attr("content").trim().split(";");
                var char = cont[cont.length - 1].trim().split("=");
                if (char[0] == "charset") {
                    charset = char[1];
                }
            });
            if (!charset) {
                charset = "utf-8";
            }
        }
        //获取charset，根据charset进行重新编码
        var html = iconv.decode(bufferHelper.toBuffer(), charset)
        var $ = cheerio.load(html);
        var title = $("div .bookname h1").text().trim();
        var urls = [];
        var value = [];
        $('.bottem1 a').each(function (i, elem) {
            urls[i] = $(this).attr("href");
            value[i] = $(this).text();
        });
        for (var j = 0; j < value.length; j++) {
            if (value[j] == "上一章") {
                var array = urls[j].split("/");
                urls[j] = array[array.length - 1];
                var beforeUrl = rootUrl + urls[j];
            }
            if (value[j] == "下一章") {
                var array = urls[j].split("/");
                urls[j] = array[array.length - 1];
                var afterUrl = rootUrl + urls[j];
            }
        }
        var content = $("#content").html();
        data[0] = {
            title: title,
            content: content,
            afterUrl: afterUrl,
            beforeUrl: beforeUrl
        };
        cb(null, data);
    });
}

//测试url http://www.2952.cc/b/58/58088/14915121.html