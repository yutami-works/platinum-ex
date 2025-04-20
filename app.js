// base
const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// custom
const dotenv = require('dotenv');
dotenv.config(); // 先に読み込む

// DB接続
require('./utils/db');

// routers読み込み
const indexRouter = require('./routes/index');
const partnersRouter = require('./routes/partners');
const registerRouter = require('./routes/register');

// expressインスタンス化
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // formの文字列を配列にするためにtrueにしている
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング設定
app.use('/', indexRouter);
app.use('/partners', partnersRouter);
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
