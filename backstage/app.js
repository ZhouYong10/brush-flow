var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ccap = require('ccap')();

var bcrypt = require('bcryptjs');
var User = require('./db').getCollection('User');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  console.log(user, 'serializeUser  user.id 000000000000000000000000000000000000000000000');
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  console.log(id, 'id 000000000000000000000000000000000000000000000');
  User.findById(id, function (err, user) {
    console.log(user, 'deserializeUser user 000000000000000000000000000000000000000000000');
    done(err, user);
  })
});

passport.use(new LocalStrategy({
  usernameField: 'username' ,
  passwordField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  if(req.body.securityCode != req.session.securityCode) {
    return done(null, false, '验证码错误！');
  }

  //实现用户名或邮箱登录
  //这里判断提交上的username是否含有@，来决定查询的字段是哪一个
  var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
  User.findOne(criteria, function(err, user) {
    if (!user){
      return done(null, false, '用户名 ' + username + ' 不存在!');
    }

    //bcrypt.genSalt(10, function (err, salt) {
    //  bcrypt.hash(password, salt, function (err, hash) {
    //    console.log(hash, 'hash   11111111111111111111111111111111111111111111111');
    //  })
    //});

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user, '登陆成功！');
      } else {
        return done(null, false, '密码错误！');
      }
    });
  });
}));

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/static/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'need change'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/securityImg', function (req, res) {
  var ary = ccap.get();
  req.session.securityCode = ary[0];
  res.end(ary[1]);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({
        isOK: false,
        message: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send({
        isOK: true,
        message: info
      });
    });
  })(req, res, next);
});


app.get('/login', function(req, res) {
  res.send('登录失败!  redirect to:  /login');
});

//将req.isAuthenticated()封装成中间件
//var isAuthenticated = function(req, res, next) {
//  if (req.isAuthenticated()) return next();
//  res.redirect('/login');
//};

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return res.send('您已经登陆了,可以随便访问.');
  }
  res.send('对不起,您还没有登陆......');
};

//这里getUser方法需要自定义
app.get('/user', isAuthenticated);

app.get('/logout', function(req, res){
  req.logout();
  res.send('退出登录。。。。。。。。');
});


app.post('/users/login', function (req, res) {
  res.send('欢迎访问/user/login........................username: ' + req.body.username + ' password: ' +
      req.body.password + ' securityCode: ' + req.body.securityCode);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});


module.exports = app;
