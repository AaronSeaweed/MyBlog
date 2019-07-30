var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors=require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var articleRouter = require('./routes/article');
var weixinRouter = require('./routes/weixin');
var testController=require('./routes/testController');
var anumentRouter=require('./routes/anument');

var app = express();

app.use(cors({
	origin:['http://localhost:8080'],  //允许这个域的访问
	methods:['GET','POST'],			//只允许GET和POST请求
	alloweHeaders:['Conten-Type','Authorization']	//只允许带这两种请求头的连接访问
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/article', articleRouter);
app.use('/weixin', weixinRouter);
app.post('/dataInpute',testController.dataInput);
app.use('/anument', anumentRouter);
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
