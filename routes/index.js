const express = require('express');
const router = express.Router();
const sql = require("../database/sql.js");
const moment = require('moment');
const uuidV1 = require('uuid/v1');//time-based;v4:random
const encrypt = require("./others/md5");
const async = require("async");
var splider = require("./others/interest.js");


/* GET home page. */
router.route('/').get(function (req, res, next) {
    if (req.session.user) {
        var name = req.session.user.name
        res.render("index", { title: name })
    } else {
        res.render('index', { title: '首页' });
    }
});

/* GET register page. */
router.route("/register").get(function (req, res) {
    res.render("register", { title: '用户注册' });
}).post(function (req, res) {
    var name = req.body.uname;
    var pwd = encrypt.md5(req.body.upwd);
    var date = moment().format('YYYY-MM-DD,hh:mm:ss');
    var table = {
        text: {
            ID: uuidV1(),
            NAME: name,
            PWD: pwd,
            CREATE_DATE: date,
            URL: ""
        }
    }
    sql.search(name, function (err, result) {
        if (err) {
            res.send("fail")
        } else if (result[0]) {
            res.send("repeat")
        } else {
            sql.insert(table, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    req.session.user = { name: name, pwd: pwd }
                    res.send("success");
                }
            })

        }
    })


});

/* GET login page. */
router.route("/login").get(function (req, res) {
    if (req.session.user) {
        var name = req.session.user.name
        res.render("start", { title: name })
    } else {
        res.render("login", { title: '用户登录' });
    }
}).post(function (req, res) {
    var name = req.body.name;
    var pwd = encrypt.md5(req.body.pwd);
    var user = {
        name: name,
        pwd: pwd
    };
    sql.search(name, function (err, result) {
        if (err) {
            res.send("fail")
        } else if (result[0] == null || result[0].PWD != pwd) {
            res.send("fail")
        } else if (result[0].PWD == pwd) {
            req.session.user = { name: name, pwd: pwd }
            res.send("success")
        }
    })
});

/* GET logout page. */
router.route('/logout').get(function (req, res, next) {
    if (req.session.user) {
        var name = req.session.user.name
        res.render("logout", { name: name, title: "注销" })
    } else {
        res.render('index', { title: '首页' });
    }
}).post(function (req, res) {
    req.session.user = "";
    res.send("success")
});

/* GET start page. */
router.route('/start').get(function (req, res, next) {
    if (req.session.user) {
        var name = req.session.user.name
        res.render("start", { title: name })
    } else {
        res.render('login', { title: '登陆' });
    }
}).post(function (req, res) {
    var url = req.body.url;
    var name = req.session.user.name;
    async.autoInject({
        
        _search: function (cb) {
            sql.search(name, function (err, data) {
                if (err) { cb(err, null) }
                else { cb(null, data) }
            });
        },
        _splider: function (_search, cb) {
            if (!url) {
                url = _search[0].URL;
            }
            splider.interest(url, function (err, _data) {
                var obj = {
                    name: name,
                    url: url,
                    data: _data,
                    success: true
                }
                cb(null, obj);
            })
        },
        _updata: function (_splider, cb) {
            if (_splider.url) {
                var arr = _splider.url.split("/");
                if (arr[arr.length - 1]) {
                    var str = arr[arr.length - 1].split(".");
                    if (str[str.length - 1] == "html") {
                        sql.update(_splider, function (err, result) {
                        })
                    }
                }
            }
            cb(null, "1");
        }
    }, function (err, result) {
        res.send(result._splider);
    })
});

router.route("/home").get(function(req,res,next){
    res.render("home",{title:'首页'})
}).post(function(req,res){
    var value = req.body.data;
    sql.searchLike(value,function(err,data){
        if(err){
            res.send(err);
        }else{
            var result={
                success:true,
                data:data,
            }
            res.send(result);
        }
    })
})

module.exports = router;
