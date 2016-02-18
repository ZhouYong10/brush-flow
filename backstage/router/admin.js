/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Placard = require('../models/Placard');

var bcrypt = require('bcryptjs');
var moment = require('moment');

var router = require('express').Router();

//拦截非管理员登录
router.use(function(req, res, next) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var userIns = User.wrapToInstance(user);
            if(userIns.isAdmin()){
                next();
            }else{
                console.log('不是管理员，不能非法登陆。。。。。。。。。。。。');
                res.redirect('/');
            }
        }, function (error) {
            res.send('获取用户信息失败： ' + error);
        });
});


router.get('/home', function (req, res) {
    Placard.open().find()
        .then(function (placards) {
            res.render('adminHome', {title: '管理员公告', money: 10.01, placards: placards});
        }, function (error) {
            return res.send('获取公告列表失败： ' + error);
        });
});




/*
* manage funds
* */
router.get('/recharge/history', function (req, res) {
    res.render('adminRechargeHistory', {title: '资金管理 / 充值记录', money: 10.01})
});

router.get('/withdraw/wait', function (req, res) {
    res.render('adminWithdrawWait', {title: '资金管理 / 提现管理 / 待处理', money: 10.01})
});

router.get('/withdraw/already', function (req, res) {
    res.render('adminWithdrawAlre', {title: '资金管理 / 提现管理 / 已处理', money: 10.01})
});




/*
* manage user
* */
router.get('/manage/user', function (req, res) {
    User.open().find()
        .then(function (users) {
            res.render('adminManageUser', {title: '设置 / 用户管理 / 所有用户', money: 10.01, users: users});
        }, function (error) {
            res.send('获取用户列表失败： ' + error);
        });
});

router.get('/manage/user/edit', function(req, res) {
    User.open().findById(req.query.id)
        .then(function (user) {
            res.render('adminManageUserEdit', {title: '设置 / 用户管理 / 编辑用户信息', money: 33.33, user: user});
        }, function (error) {
            res.send('查询用户详情失败： ' + error);
        });
});

router.post('/manage/user/edit', function(req, res) {
    var updateInfo = req.body;
    User.updateById(updateInfo.id, {$set: {
        username: updateInfo.username,
        status: updateInfo.status,
        role: updateInfo.role,
        QQ: updateInfo.QQ,
        phone: updateInfo.phone,
        email: updateInfo.email
    }}).then(function (user) {
        res.redirect('/admin/manage/user');
    }, function(error) {
        res.send('更新用户信息失败： ' + error);
    });
});

router.get('/manage/user/del', function(req, res) {
    User.open().removeById(req.query.id)
        .then(function (user) {
            res.redirect('/admin/manage/user');
        }, function (error) {
            res.send('删除用户失败： ' + error);
        });
});

router.get('/manage/user/add', function (req, res) {
    res.render('adminManageUserAdd', {title: '设置 / 用户管理 / 添加用户', money: 10.01})
});

router.post('/manage/user/add', function (req, res) {
    var userInfo = req.body;
    console.log(userInfo,'userInfo===============');
    User.open().findById(req.session.passport.user)
        .then(function(result) {
            console.log(result,'result===============');
            var parent = User.wrapToInstance(result);
            userInfo.parent = parent.username;
            User.createUser(userInfo, function (user) {
                parent.addChild(user[0]._id);
                User.open().updateById(parent._id, {
                    $set: {
                        children: parent.children
                    }
                }).then(function (result) {
                    res.redirect('/admin/manage/user');
                }, function(error) {
                    throw (new Error(error));
                });
            }, function (error) {
                res.send('添加下级用户失败： ' + error);
            });
        }, function(error) {
            res.send('查询上级用户信息失败： ' + error);
        })
});




/*
* manage price
* */
router.get('/price/forum', function (req, res) {
    res.render('adminPriceForum', {title: '价格&状态管理 / 论坛模块', money: 10.01})
});

router.get('/price/flow', function (req, res) {
    res.render('adminPriceFlow', {title: '价格&状态管理 / 流量模块', money: 10.01})
});

router.get('/price/WX/MP/WB', function (req, res) {
    res.render('adminPriceWXMPWB', {title: '价格&状态管理 / 微信、美拍、微博', money: 10.01})
});




/*
* manage placard
* */
router.get('/placard/send', function (req, res) {
    res.render('adminPlacardSend', {title: '公告管理 / 发布公告', money: 10.01})
});

router.post('/placard/send', function (req, res) {
    Placard.open().insert({
        placardName: req.body.placardName,
        placardContent: req.body.placardContent,
        sendTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then(function (placard) {
        res.redirect('/admin/placard/history');
    }, function (error) {
        res.send('发布公告失败： ' + error);
    });
});

router.get('/placard/history', function (req, res) {
    Placard.open().find()
        .then(function (placards) {
            res.render('adminPlacardHistory', {title: '公告管理 / 历史公告', money: 10.01, placards: placards});
        }, function (error) {
            return res.send('获取公告列表失败： ' + error);
        });
});

router.get('/placard/history/del', function (req, res) {
    Placard.open().removeById(req.query.id)
        .then(function (placard) {
            res.redirect('/admin/placard/history');
        }, function (error) {
            return res.send('删除公告失败： ' + error);
        });
});

router.get('/placard/add', function (req, res) {
    res.render('adminPlacardAdd', {title: '公告管理 / 添加公告类型', money: 10.01})
});




/*
* manage order form
* */
router.get('/reply/wait', function (req, res) {
    res.render('adminReplyWait', {title: '回复订单管理 / 待处理订单', money: 10.01})
});

router.get('/reply/already', function (req, res) {
    res.render('adminReplyAlre', {title: '回复订单管理 / 已处理订单', money: 10.01})
});

router.get('/flow/wait', function (req, res) {
    res.render('adminFlowWait', {title: '流量订单管理 / 待处理订单', money: 10.01})
});

router.get('/flow/already', function (req, res) {
    res.render('adminFlowAlre', {title: '流量订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/article/wait', function (req, res) {
    res.render('adminWXarticleWait', {title: '微信原文类订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/article/already', function (req, res) {
    res.render('adminWXarticleAlre', {title: '微信原文类订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/like/wait', function (req, res) {
    res.render('adminWXlikeWait', {title: '微信阅读点赞订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/like/already', function (req, res) {
    res.render('adminWXlikeAlre', {title: '微信阅读点赞订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/reply/wait', function (req, res) {
    res.render('adminWXreplyWait', {title: '微信公众粉丝回复订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/reply/already', function (req, res) {
    res.render('adminWXreplyAlre', {title: '微信公众粉丝回复订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/friend/wait', function (req, res) {
    res.render('adminWXfriendWait', {title: '微信个人好友订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/friend/already', function (req, res) {
    res.render('adminWXfriendAlre', {title: '微信个人好友订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/code/wait', function (req, res) {
    res.render('adminWXcodeWait', {title: '微信好友地区扫码订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/code/already', function (req, res) {
    res.render('adminWXcodeAlre', {title: '微信好友地区扫码订单管理 / 已处理订单', money: 10.01})
});

router.get('/MP/wait', function (req, res) {
    res.render('adminMPWait', {title: '美拍订单管理 / 待处理订单', money: 10.01})
});

router.get('/MP/already', function (req, res) {
    res.render('adminMPAlre', {title: '美拍订单管理 / 已处理订单', money: 10.01})
});

router.get('/WB/wait', function (req, res) {
    res.render('adminWBWait', {title: '微博订单管理 / 待处理订单', money: 10.01})
});

router.get('/WB/already', function (req, res) {
    res.render('adminWBAlre', {title: '微博订单管理 / 已处理订单', money: 10.01})
});


router.get('/error/wait', function (req, res) {
    res.render('adminErrorWait', {title: '错误信息报告管理 / 待处理错误报告', money: 10.01})
});

router.get('/error/already', function (req, res) {
    res.render('adminErrorAlre', {title: '错误信息报告管理 / 待处理错误报告', money: 10.01})
});

router.get('/feedback/wait', function (req, res) {
    res.render('adminFeedbackWait', {title: '问题反馈信息管理 / 待处理问题反馈信息', money: 10.01})
});

router.get('/feedback/already', function (req, res) {
    res.render('adminFeedbackAlre', {title: '问题反馈信息管理 / 待处理问题反馈信息', money: 10.01})
});


module.exports = router;