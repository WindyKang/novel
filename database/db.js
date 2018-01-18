// var mysql=require("mysql");
// exports.connect=function(sql,param,callback){
//   var db=mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '123456',
//     database: 'zf'
//   });
//   db.connect();
//   db.query(sql,param,callback);
//   db.end();
// };



// var db=require("./routes/db.js");
// app.get("/index.html",function(req,res){
//   db.connect("select * from t_user",function(error,data){
//     console.log(data);
//   });
//   res.send("<h1>success</h1>");
// });


var mysql = require('mysql'),
  async = require('async');

var PRODUCTION_DB = 'zf',
  TEST_DB = 'zf'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function (mode, done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  })

  state.mode = mode
  done()
}

exports.get = function () {
  return state.pool
}

