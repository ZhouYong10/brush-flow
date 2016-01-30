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
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

passport.use(new LocalStrategy({
  usernameField: 'username' ,
  passwordField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  //判断验证码
  //if(req.body.securityCode != req.session.securityCode) {
  //  return done(null, false, '验证码错误！');
  //}

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      console.log(hash, 'hash   11111111111111111111111111111111111111111111111');
    })
  });

  //实现用户名或邮箱登录
  //这里判断提交上的username是否含有@，来决定查询的字段是哪一个
  var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
  User.findOne(criteria, function(err, user) {
    if (!user){
      return done(null, false, '用户名 ' + username + ' 不存在!');
    }

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

// view engine setup
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

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



app.get('/', function (req, res) {
  res.render('index', {title: '网络营销系统'});
});

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

      if(user.role === 'admin'){
        return res.send({
          isOK: true,
          path: '/admin/home'
        });
      }else{
        return res.send({
          isOK: true,
          path: '/client/home'
        });
      }
    });
  })(req, res, next);
});

//拦截未登录
app.use(function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect('/');
  }
});

app.get('/client/home', function (req, res) {
  res.render('clientHome', {title: '系统公告', money: 12.3});
});

app.use('/user', require('./router/user.js'));
app.use('/forum', require('./router/forum.js'));
app.use('/flow', require('./router/flow.js'));
app.use('/WX', require('./router/WX.js'));
app.use('/MP', require('./router/MP.js'));
app.use('/WB', require('./router/WB.js'));

app.use('/admin', require('./router/admin.js'));







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('======================================');
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
