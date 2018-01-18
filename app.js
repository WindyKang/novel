var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./database/db');
var session = require('express-session');
var mySqlStore = require('express-mysql-session')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs").__express);             //改ejs为html
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// open database
db.connect(db.MODE_PRODUCTION, function (err) {
  if (err) {
    console.log('Unable to connect to MySql.')
    process.exit(1)
  } else {
    console.log('Listening on port 8080...');
    console.log("MySql is connected")
  }
});

//session 
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'zf',
};

app.use(session({
  name: 'sid',
  secret: 'cat',
  store: new mySqlStore(options),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/', index);
app.use('/users', users);
app.use('/login', index);
app.use('/register', index);
app.use('/logout', index);
app.use('/start', index); 
app.use('/home', index); 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
