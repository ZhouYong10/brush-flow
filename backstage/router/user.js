/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Order = require('../models/Order');
var Feedback = require('../models/Feedback');
var AlipayRecord = require('../models/AlipayRecord');
var Recharge = require('../models/Recharge');
var Withdraw = require('../models/Withdraw');
var router = require('express').Router();

var bcrypt = require('bcryptjs');

router.get('/recharge', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('recharge', {
                title: '在线充值',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            })
        });
});

router.post('/recharge', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            AlipayRecord.open().findOne(req.body)
                .then(function (result) {
                    if(result) {
                        if(result.status !== 1) {
                            Recharge.open().insert({
                                username: user.username,
                                userId: user._id,
                                funds: result.funds,
                                time: result.createTime,
                                orderNum: result.orderNum
                            }).then(function (recharge) {
                                var fundsNow = (parseFloat(user.funds) + parseFloat(result.funds)).toFixed(4);
                                User.open().updateById(user._id, {$set: {funds: fundsNow}});
                                AlipayRecord.open().updateById(result._id, {$set: {status: 1}});
                                res.send({
                                    isOK: true,
                                    path: '/user/recharge/history'
                                });
                            }, function (error) {
                                console.log('充值失败：' + error);
                                res.send({
                                    isOK: false,
                                    message: '充值失败：' + error
                                });
                            });
                        }else {
                            res.send({
                                isOK: false,
                                message: '该交易号已充值成功，能不重复充值！'
                            });
                        }
                    }else {
                        res.send({
                            isOK: false,
                            message: '请核对交易号是否正确！'
                        });
                    }
                }, function (error) {
                    console.log('查询交易记录失败：' + error);
                    res.send({
                        isOK: false,
                        message: '查询交易记录失败：' + error
                    });
                });
        });
});

router.get('/recharge/history', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Recharge.open().findPages({userId: user._id}, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('rechargeHistory', {
                        title: '充值记录',
                        money: user.funds,
                        recharges: obj.results,
                        pages: obj.pages,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role
                    });
                }, function (error) {
                    res.send('查询充值记录失败： ' + error);
                });
        });
});

router.get('/search/recharge', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var query = {userId: user._id};
            if(req.query.funds) {
                query.funds = req.query.funds;
            }
            if(req.query.createTime) {
                query.createTime = new RegExp(req.query.createTime);
            }
            Recharge.open().findPages(query, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('rechargeHistory', {
                        title: '充值记录',
                        money: user.funds,
                        recharges: obj.results,
                        pages: obj.pages,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role
                    });
                }, function (error) {
                    res.send('查询充值记录失败： ' + error);
                });
        });
});

router.get('/consume/history', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                status: {$in: ['已处理', '已退款']}
            }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    res.render('consumeHistory', {
                        title: '消费记录',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages
                    })
                })
        });
});

router.get('/search/consume', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    status: {$in: ['已处理', '已退款']},
                    createTime: new RegExp(req.query.createTime)
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    res.render('consumeHistory', {
                        title: '消费记录',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages
                    })
                })
        });
});

router.get('/info', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('userInfo', {
                title: '我的详细信息',
                money: user.funds,
                user: user,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
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
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('changePassword', {
                title: '修改账号密码',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        });
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
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('addLowerUser', {
                title: '添加下级用户',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        });
});

router.post('/addLowerUser', function (req, res) {
    var userInfo = req.body;
    userInfo.username = userInfo.username.replace(/(^\s*)|(\s*$)/g, "");
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
                User.open().findPages({_id: {$in: parent.children}}, (req.query.page ? req.query.page : 1))
                    .then(function(obj) {
                        res.render('lowerUser', {
                            title: '我的下级用户',
                            money: parent.funds,
                            users: obj.results,
                            pages: obj.pages,
                            username: parent.username,
                            userStatus: parent.status,
                            role: parent.role
                        });
                    }, function(error) {
                        throw new Error('查询下级用户信息失败： ' + error)
                    })
            }else {
                res.render('lowerUser', {
                    title: '我的下级用户',
                    money: parent.funds,
                    users: [],
                    pages: 1,
                    username: parent.username,
                    userStatus: parent.status,
                    role: parent.role
                });
            }
        }, function(error) {
            res.send(error);
        });
});

router.get('/removeLowerUser', function (req, res) {
    User.removeUser(req.query.id).then(function () {
        res.redirect('/user/lowerUser');
    });
});

router.get('/feedback', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Feedback.open().findPages(null, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('feedback', {
                        title: '问题反馈',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        feedbacks: obj.results,
                        pages: obj.pages
                    });
                }, function (error) {
                    res.send('获取反馈列表失败： ' + error);
                });
        });
});

router.get('/feedback/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('feedbackAdd', {
                title: '问题反馈 / 我要提意见',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        });
});

router.post('/feedback/add', function (req, res) {
    var feedback = req.body;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            feedback.user = user.username;
            Feedback.createFeedback(feedback)
                .then(function (result) {
                    socketIO.emit('updateNav', {'feedback': 1});
                    res.redirect('/user/feedback');
                }, function (error) {
                    res.send('提交反馈失败： ' + error);
                });
        });
});

router.get('/withdraw', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Withdraw.open().findPages({userId: user._id}, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    res.render('withdraw', {
                        title: '我要提现',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        withdraws: obj.results,
                        pages: obj.pages
                    });
                })
        });
});

router.get('/withdraw/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('withdrawAdd', {
                title: '申请提现',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        });
});

router.post('/withdraw/add', function (req, res) {
    Withdraw.saveOne(req.body, req.session.passport.user)
        .then(function() {
            socketIO.emit('updateNav', {'withdraw': 1});
            res.redirect('/user/withdraw');
        })
});

router.get('/errorSummary', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                error: {$in: ['未处理', '已处理']}
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                res.render('errorSummary', {
                    title: '错误信息汇总',
                    money: user.funds,
                    username: user.username,
                    userStatus: user.status,
                    role: user.role,
                    orders: obj.results,
                    pages: obj.pages
                });
            });
        });
});

router.get('/search/error', function (req, res) {
    var types = req.query.type.split('-');
    var type = types.shift();
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var query = {
                userId: user._id,
                type: type,
                smallType: {$in: types},
                error: {$in: ['未处理', '已处理']}
            };
            Order.open().findPages(query, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('errorSummary', {
                        title: '错误信息汇总',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages
                    });
                });
        });
});

router.get('/order/error', function (req, res) {
    var msg = req.query;
    Order.open().findById(msg.id)
        .then(function(order) {
            var orderIns = Order.wrapToInstance(order);
            orderIns.orderError(msg.info, function() {
                socketIO.emit('updateNav', {'error': 1});
                res.redirect(msg.url);
            });
        })
});

module.exports = router;