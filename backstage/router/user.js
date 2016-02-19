/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Feedback = require('../models/Feedback');
var router = require('express').Router();

var bcrypt = require('bcryptjs');

router.get('/recharge', function (req, res) {
    res.render('recharge', {title: '在线充值', money: 10.01})
});

router.get('/recharge/history', function (req, res) {
    res.render('rechargeHistory', {title: '充值记录', money: 10.01})
});

router.get('/consume/history', function (req, res) {
    res.render('consumeHistory', {title: '消费记录', money: 10.01})
});

router.get('/info', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('userInfo', {title: '我的详细信息', money: 10.01, user: user});
        }, function (error) {
            res.send('获取用户详细信息失败： ' + error);
        });
});

router.post('/info', function (req, res) {
    var update = req.body;
    User.open().updateById(req.session.passport.user, {
        $set: {
            QQ: update.QQ,
            phone: update.phone,
            email: update.email
        }
    }).then(function (user) {
        res.redirect('/user/info');
    }, function (error) {
        res.send('更新用户信息失败： ' + error);
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/changePwd', function (req, res) {
    res.render('changePassword', {title: '修改账号密码', money: 22.22});
});

router.post('/changePwd', function (req, res) {
    var info = req.body;
    var oldPwd = info.oldpwd,
        newPwd = info.newpwd,
        repeatPwd = info.repeatpwd;

    if(newPwd === repeatPwd) {
        User.open().findById(req.session.passport.user)
            .then(function(result) {
                var user = User.wrapToInstance(result);
                if(user.samePwd(oldPwd)){
                    User.open().update({
                        _id: user._id
                    }, {$set: {
                        password: bcrypt.hashSync(newPwd, bcrypt.genSaltSync(10))
                    }}).then(function(user) {
                        res.send({
                            isOK: true,
                            url: '/user/info'
                        });
                    }, function(error) {
                        res.send({
                            isOK: false,
                            info: '更新用户密码失败： ' + error
                        });
                    })
                }else{
                    res.send({
                        isOK: false,
                        info: '原密码错误！如果忘记密码，请联系管理员！！'
                    });
                }
            }, function(error) {
                res.send({
                    isOK: false,
                    info: '用户信息查询失败： ' + error
                });
            })
    }else{
        res.send({
            isOK: false,
            info: '新密码两次输入不一致！！'
        });
    }
});

router.post('/username/notrepeat', function (req, res) {
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

router.get('/addLowerUser', function (req, res) {
    res.render('addLowerUser', {title: '添加下级用户', money: 11});
});

router.post('/addLowerUser', function (req, res) {
    var userInfo = req.body;
    User.open().findById(req.session.passport.user)
        .then(function (result) {
            var parent = User.wrapToInstance(result);
            userInfo.parent = parent.username;
            userInfo.parentID = parent._id;
            userInfo.role = parent.childRole();
            User.createUser(userInfo, function (user) {
                parent.addChild(user[0]._id);
                User.open().updateById(parent._id, {
                    $set: parent
                }).then(function (result) {
                    res.redirect('/user/lowerUser');
                }, function(error) {
                    throw (new Error(error));
                });
            }, function (error) {
                res.send('添加下级用户失败： ' + error);
            });
        }, function (error) {
            res.send('查询上级用户信息失败： ' + error);
        });
});

router.get('/lowerUser', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (parent) {
            if(parent.children && parent.children.length > 0){
                User.open().find({_id: {$in: parent.children}})
                    .then(function(children) {
                        res.render('lowerUser', {title: '我的下级用户', money: 33.33, users: children});
                    }, function(error) {
                        throw new Error('查询下级用户信息失败： ' + error)
                    })
            }else {
                res.render('lowerUser', {title: '我的下级用户', money: 33.33, users: []});
            }
        }, function(error) {
            res.send(error);
        });
});

router.get('/removeLowerUser', function (req, res) {
    User.removeUser(req, res, '/user/lowerUser');
});

router.get('/feedback', function (req, res) {
    Feedback.open().find()
        .then(function (feedbacks) {
            res.render('feedback', {title: '问题反馈', money: 33, feedbacks: feedbacks});
        }, function (error) {
            res.send('获取反馈列表失败： ' + error);
        });
});

router.get('/feedback/add', function (req, res) {
    res.render('feedbackAdd', {title: '问题反馈 / 我要提意见', money: 323});
});

router.post('/feedback/add', function (req, res) {
    var feedback = req.body;
    User.open().findById(req.session.passport.user)
        .then(function(user) {
            feedback.user = user.username;
            Feedback.createFeedback(feedback)
                .then(function (result) {
                    console.log(result,'result==================================');
                    res.redirect('/user/feedback');
                }, function (error) {
                    res.send('提交反馈失败： ' + error);
                });
        })
});

router.get('/withdraw', function (req, res) {
    res.render('withdraw', {title: '我要提现', money: 100});
});

router.get('/withdraw/add', function (req, res) {
    res.render('withdrawAdd', {title: '申请提现', money: 100});
});

router.get('/errorSummary', function (req, res) {
    res.render('errorSummary', {title: '错误信息汇总', money: 200});
});   

module.exports = router;