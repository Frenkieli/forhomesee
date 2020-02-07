var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// var bodyParser =require('body-parser');


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var updataRouter = require('./routes/updata');
var medicalrecordsRouter = require('./routes/medicalrecords');


var app = express();

// 聊天室功能
const socket = require('./socket/socket');
socket.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// 路由設定區域
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/updata', updataRouter);
app.use('/medicalrecords', medicalrecordsRouter);

app.use('/userData', express.static(__dirname + '/userData')); //提供圖片和假的位置讓網站使用

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
