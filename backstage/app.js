var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CCAP = require('ccap');
var ccapOld = CCAP();
var ccap = CCAP({
  width: 216,
  height: 76,
  offset: 56,
  quality: 28,
  fontsize: 56,
  generate: function() {
    return ccapOld.get()[0].substr(0, 4);
  }
});
var moment = require('moment');
var bcrypt = require('bcryptjs');

var User = require('./models/User');
var Placard = require('./models/Placard');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Cleaners = require('./models/Cleaners');
Cleaners.timeOfDay();
// Cleaners.test();



passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.open().findById(id)
      .then(function (user) {
        done(null, user);
      }, function (error) {
        done(error, null);
      });
});

passport.use(new LocalStrategy({
  usernameField: 'username' ,
  passwordField: 'password',
  passReqToCallback: true
}, function(req, uname, password, done) {
  var username = uname.replace(/(^\s*)|(\s*$)/g, "");

  if(!req.body.isAuto) {
    //判断验证码
    if(req.body.securityCode.toLowerCase() != req.session.securityCode) {
      return done(null, false, '验证码错误！');
    }
  }

  //实现用户名或邮箱登录
  //这里判断提交上的username是否含有@，来决定查询的字段是哪一个
  //var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
  var criteria = {username: username};
  User.open().findOne(criteria)
      .then(function (user) {
        if (!user){
          return done(null, false, '用户名 ' + username + ' 不存在!');
        }
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (isMatch) {
            if(user.status == '冻结'){
              done(null, false, '账户已被冻结，请联系上级或管理员！');
            }else{
              done(null, user, '登陆成功！');
            }
          } else {
            done(null, false, '密码错误！');
          }
        });
      }, function (error) {
        done(error, false, '登陆查询用户信息失败！');
      });
}));

var app = express();

//app.get('/clear', function (req, res) {
//  Cleaners.test();
//});

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


var Recharge = require('./models/Recharge');
/*
* 爱支付
* */
//app.get('/auto/recharge', function (req, res) {
//  var caseValue = req.query.a;
//  switch (caseValue) {
//    case "getsn":
//      Recharge.getAlipayIds()
//          .then(function (ids) {
//            res.send(ids);
//          });
//      break;
//    case "report":
//      Recharge.updateRecord(req.query.result)
//          .then(function (msg) {
//            res.end(msg);
//          });
//      break;
//  }
//});

/*
* 易支付
* */
app.get('/yzf/recharge', function (req, res) {
  var info = req.query;
  if(info.key === 'chong@zhi@3.1415'){
    var temp = info.uid.split('-');
    var uid;
    if(temp.length > 1){
      uid = temp[2];
    }else{
      uid = temp[0];
    }
    info.uid = uid;
    Recharge.yzfAutoInsert(info);
    res.end('1');
  }else{
    res.end('<h1>你是假冒的充值记录，别以为我真的不知道！等着被查水表吧！</h1>');
  }
});


app.post('/yzf/recharge', function (req, res) {
    var day_time = req.body.Paytime.split(" ");
    var year_day = day_time[0].split('/');
    year_day[1] = parseInt(year_day[1]) < 10 ? '0' + year_day[1] : year_day[1];
    year_day[2] = parseInt(year_day[2]) < 10 ? '0' + year_day[2] : year_day[2];
    day_time[0] = year_day.join('-');
    var payTime = day_time.join(' ');

    var info = {
        fee: req.body.Money,
        uid: req.body.title,
        money: req.body.Money,
        PayTime: payTime,
        orderid: req.body.tradeNo,
        key: req.body.memo,
        type: 1
    };

    if(info.key === 'chong@zhi@3.1415'){
        var temp = info.uid.split('-');
        var uid;
        if(temp.length > 1){
            uid = temp[2];
        }else{
            uid = temp[0];
        }
        info.uid = uid;
        Recharge.yzfAutoInsert(info);
        res.end('success');
    }else{
        res.end('<h1>你是假冒的充值记录，别以为我真的不知道！等着被查水表吧！</h1>');
    }
});

/*
 * 易支付 vip电影会员
 * */
var VipRecharge = require('./models/VipRecharge');
app.get('/vip/video/recharge', function (req, res) {
  var info = req.query;
  if(info.key === 'vip@chong@zhi@3.1415'){
    var temp = info.uid ? info.uid.split('-') : [];
    var uid;
    if(temp.length > 1){
      uid = temp[2];
    }else{
      uid = temp[0];
    }
    info.uid = uid;
    VipRecharge.yzfAutoInsert(info);
    res.end('1');
  }else{
    res.end('<h1>你是假冒的充值记录，别以为我真的不知道！等着被查水表吧！</h1>');
  }
});

app.get('/', function (req, res) {
  res.render('index', {title: '用户登陆'});
  //res.render('platformClose', {title: '平台暂时关闭'});
});

app.get('/securityImg', function (req, res) {
  var ary = ccap.get();
  req.session.securityCode = ary[0].toLowerCase();
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
    userLogin(req, res, user);
  })(req, res, next);
});

function userLogin(req, res, user) {
    req.logIn(user, function(err) {
        if (err) {
            return next(err);
        }
        User.open().updateById(user._id, {
            $set: {
                lastLoginTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }).then(function () {
            var userIns = User.wrapToInstance(user);
            if(userIns.isAdmin()) {
                res.send({
                    isOK: true,
                    path: '/admin/home'
                });
            }else{
                res.send({
                    isOK: true,
                    path: '/client/home'
                });
            }
        }, function (error) {
            res.send({
                isOK: false,
                message: '更新用户登陆时间失败： ' + error
            });
        });
    });
}

app.post('/logup', function (req, res, next) {
    var userInfo = req.body;
    User.open().findOne({username: userInfo.username}).then(function (user) {
        /*
        * 验证数据的有效性
        *   验证账户名不存在
        *   验证两次输入的密码一致
        *   验证码正确
        * */
        if (user) {
            return res.send({
                isOK: false,
                message: "账户： " + userInfo.username + " 已存在！"
            });
        }

        if (userInfo.password != userInfo.repassword) {
            return res.send({
                isOK: false,
                message: "两次输入的密码不一致！"
            });
        }

        //判断验证码
        if (userInfo.securityCode.toLowerCase() != req.session.securityCode) {
            return res.send({
                isOK: false,
                message: '验证码错误！'
            });
        }

        /*
        * 判断推广链接存在
        *   解密推广链接得到userId
        *   通过userId查询出推广用户
        *   注册新用户，并关联上下级关系
        *
        * 推广链接不存在
        *   查出管理员用户
        *   注册新用户，并并关联上下级关系
        * */
        var addLowerUser = function(parentObj) {
            var newUser = {
                username: userInfo.username,
                password: userInfo.password,
                qq: '',
                phone: '',
                role: '金牌代理'
            };
            newUser.parent = parentObj.username;
            newUser.parentID = parentObj._id;
            if(parentObj.username != 'admin') {
                newUser.role = parentObj.childRole();
            }
            User.createUser(newUser, function (result) {
                var user = result[0];
                parentObj.addChild(user._id);
                User.open().updateById(parentObj._id, {
                    $set: parentObj
                }).then(function () {
                    userLogin(req, res, user);
                });
            });
        };
        var parentId = require('./models/CiAndDeci').doDecipher(userInfo.parentId);
        if (parentId) {
            User.open().findById(parentId).then(function (parent) {
                if (parent) {
                    var parentObj = User.wrapToInstance(parent);
                    addLowerUser(parentObj)
                } else {
                    User.open().findOne({username: 'admin'}).then(function (admin) {
                        var parentObj = User.wrapToInstance(admin);
                        addLowerUser(parentObj)
                    })
                }
            })
        } else {
            User.open().findOne({username: 'admin'}).then(function (admin) {
                var parentObj = User.wrapToInstance(admin);
                addLowerUser(parentObj)
            })
        }
    });
});

app.post('/username/notrepeat', function (req, res) {
    User.open().findOne({
        username: req.body.username
    }).then(function (user) {
        if(user) {
            res.send({notRepeat: false});
        }else{
            res.send({notRepeat: true});
        }
    }, function (error) {
        res.send('查询用户信息失败： ' + error);
    });
});

//对外公共接口
app.use('/proxy', require('./router/proxy.js'));
var Order = require('./models/Order');

global.weichuanmeiOrderNum = 1;
global.dingdingOrderNum = 3;

//丁丁提单
app.get('/wx/like/forward/remote', function (req, res) {
//app.get('/wx/like/forward/remote/get/order', function (req, res) {  //替代丁丁接单的接口地址
  //var num = parseInt(req.query.num);
  //global.forwardNum = num;
  Order.open().findOne({
    type: 'wx',
    smallType: 'read',
    status: '未处理',
    num: {$gt: global.weichuanmeiOrderNum, $lte: global.dingdingOrderNum}
  }).then(function (obj) {
    if(obj && !obj.remote) {
      Order.open().updateById(obj._id, {
        //$set: {remote: 'daiding'}
        $set: {remote: 'dingding'}
      }).then(function() {
        res.send(JSON.stringify({
          id: obj._id,
          address: obj.address,
          read: obj.num,
          like: obj.num2
        }));
      });
    }else{
      res.send(null);
    }
  });
});

app.get('/wx/like/complete/remote', function (req, res) {
//app.get('/wx/like/forward/complete/remote', function (req, res) {  //替代丁丁接单的接口地址
  var status = req.query.status;
  var msg = req.query.msg;
  var orderId = req.query.id;
  var startReadNum = req.query.startReadNum;
  Order.open().findById(orderId)
      .then(function (order) {
        //if(order && order.status == '未处理' && order.remote == 'daiding'){
        if(order && order.status == '未处理' && order.remote == 'dingding'){
          var orderIns = Order.wrapToInstance(order);
          if (status == 1) {
            orderIns.startReadNum = startReadNum;
            orderIns.complete(function () {
              res.end();
            });
          } else {
            orderIns.remoteError(msg).then(function () {
              res.end();
            });
          }
        }else {
          res.end();
        }
      })
});


//微传媒提单
//app.get('/wx/like/forward/remote/weichuanmei', function (req, res) {
//  Order.open().findOne({
//    type: 'wx',
//    smallType: 'read',
//    status: '未处理',
//    num: {$gt: global.dingdingOrderNum, $lte: global.weichuanmeiOrderNum}
//  }).then(function (obj) {
//    if(obj && !obj.remote) {
//      Order.open().updateById(obj._id, {
//        $set: {remote: 'weichuanmei'}
//      }).then(function() {
//        res.send(JSON.stringify({
//          id: obj._id,
//          address: obj.address,
//          read: obj.num,
//          like: obj.num2
//        }));
//      });
//    }else{
//      res.send(null);
//    }
//  });
//});
//
//app.get('/wx/like/complete/remote/weichuanmei', function (req, res) {
//  var status = req.query.status;
//  var msg = req.query.msg;
//  var orderId = req.query.id;
//  var startReadNum = req.query.startReadNum;
//  Order.open().findById(orderId)
//      .then(function (order) {
//        if(order && order.status == '未处理' && order.remote == 'weichuanmei'){
//          var orderIns = Order.wrapToInstance(order);
//          if (status == 1) {
//            orderIns.startReadNum = startReadNum;
//            orderIns.complete(function () {
//              res.end();
//            });
//          } else {
//            orderIns.refund(msg, function() {
//              res.end();
//            });
//          }
//        }else {
//          res.end();
//        }
//      })
//});

app.get('/new/placard', function (req, res) {
  Placard.open().newPlacard()
      .then(function (obj) {
    res.send(obj);
  });
});

app.use('/handle', require('./router/handle.js'));

//拦截未登录
app.use(function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect('/');
  }
});

app.get('/client/home', function (req, res) {
  User.open().findById(req.session.passport.user)
      .then(function (user) {
        Placard.open().findPages(null, (req.query.page ? req.query.page : 1))
            .then(function (obj) {
              res.render('clientHome', {
                title: '系统公告',
                money: user.funds,
                placards: obj.results,
                pages: obj.pages,
                username: user.username,
                userStatus: user.status,
                role: user.role
              });
            }, function (error) {
              res.send('获取公告列表失败： ' + error);
            });
      });
});


app.use('/user', require('./router/user.js'));
app.use('/task', require('./router/task.js'));
app.use('/artificial', require('./router/artificial.js'));
app.use('/forum', require('./router/forum.js'));
app.use('/flow', require('./router/flow.js'));
app.use('/WX', require('./router/WX.js'));
app.use('/MP', require('./router/MP.js'));
app.use('/WB', require('./router/WB.js'));
app.use('/parse', require('./router/parse-address.js'));

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