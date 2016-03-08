/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Placard = require('../models/Placard');
var Recharge = require('../models/Recharge');
var Error = require('../models/Error');
var Feedback = require('../models/Feedback');
var Withdraw = require('../models/Withdraw');

var Product = require('../models/Product');
var Orders = require('../models/Order');

var moment = require('moment');
var Formidable = require('formidable');

var path = require('path');
var fs = require('fs');
var router = require('express').Router();

Object.defineProperty(global, 'logoDir', {
    value: path.join(__dirname, '../public/logos/'),
    writable: false,
    configurable: false
});

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
* update header nav
* */
router.get('/update/header/nav', function (req, res) {
    var updateNav = {
        withdraw: 0,
        reply: 0,
        flow: 0,
        wxArticle: 0,
        wxLike: 0,
        wxReply: 0,
        wxFriend: 0,
        wxCode: 0,
        mp: 0,
        wb: 0,
        error: 0,
        feedback: 0
    };

    Withdraw.open().find({status: '未处理'}).then(function (withdraws) {
        if (withdraws) {
            updateNav.withdraw = withdraws.length;
        }
        Error.open().find({status: '未处理'}).then(function (errors) {
            if (errors) {
                updateNav.error = errors.length;
            }
            Feedback.open().find({status: '未处理'}).then(function (feedbacks) {
                if (feedbacks) {
                    updateNav.feedback = feedbacks.length;
                }
                Orders.open().find({status: '未处理'})
                    .then(function (results) {
                        if(results) {
                            for(var i in results) {
                                var result = results[i];
                                switch (result.type) {
                                    case 'forum':
                                        updateNav.reply += 1;
                                        break;
                                    case 'flow':
                                        updateNav.flow += 1;
                                        break;
                                    case 'wx':
                                        switch (result.smallType) {
                                            case 'article':
                                                updateNav.wxArticle += 1;
                                                break;
                                            case 'like':
                                                updateNav.wxLike += 1;
                                                break;
                                            case 'reply':
                                                updateNav.wxReply += 1;
                                                break;
                                            case 'friend':
                                                updateNav.wxFriend += 1;
                                                break;
                                            case 'code':
                                                updateNav.wxCode += 1;
                                                break;
                                        }
                                        break;
                                    case 'mp':
                                        updateNav.mp += 1;
                                        break;
                                    case 'wb':
                                        updateNav.wb += 1;
                                        break;
                                }
                            }
                        }
                        res.send(updateNav);
                    });
            });
        });
    });
});

/*
 * manage funds
 * */
router.get('/recharge/history', function (req, res) {
    Recharge.open().find()
        .then(function(results) {
            res.render('adminRechargeHistory', {title: '资金管理 / 充值记录', money: 10.01, recharges: results});
        }, function(error) {
            res.send('查询充值记录失败： ' + error);
        })
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
    var id = updateInfo.id;
    delete updateInfo.id;
    User.updateById(id, {$set: updateInfo})
        .then(function (user) {
            res.redirect('/admin/manage/user');
        }, function(error) {
            res.send('更新用户信息失败： ' + error);
        });
});

router.get('/manage/user/del', function(req, res) {
    User.removeUser(req, res, '/admin/manage/user');
});

router.get('/manage/user/add', function (req, res) {
    res.render('adminManageUserAdd', {title: '设置 / 用户管理 / 添加用户', money: 10.01})
});

router.post('/manage/user/add', function (req, res) {
    var userInfo = req.body;
    User.open().findById(req.session.passport.user)
        .then(function(result) {
            var parent = User.wrapToInstance(result);
            userInfo.parent = parent.username;
            userInfo.parentID = parent._id;
            User.createUser(userInfo, function (user) {
                parent.addChild(user[0]._id);
                User.open().updateById(parent._id, {
                    $set: parent
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
    Product.open().find({type: 'forum'})
        .then(function (products) {
            res.render('adminPriceForum', {title: '价格&状态管理 / 论坛模块', money: 10.01, products: products.reverse()});
        });
});

router.post('/price/forum', function (req, res) {
    Product.open().insert(req.body)
        .then(function (result) {
            res.send(result[0]);
        });
});

router.post('/price/forum/update', function (req, res) {
    var id = req.body.id;
    delete req.body.id;
    Product.open().updateById(id, {$set: req.body})
        .then(function (result) {
            res.end();
        });
});

router.post('/price/forum/delete', function (req, res) {
    Product.open().removeById(req.body.id)
        .then(function () {
            res.end();
        });
});

router.post('/price/forum/img/upload', function (req, res) {
    var form = new Formidable.IncomingForm();
    var logoDir = form.uploadDir = global.logoDir;

    if(!fs.existsSync(logoDir)){
        fs.mkdirSync(logoDir);
    }
    form.maxFieldsSize = 1024 * 1024;
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.hash = 'md5';
    form.parse(req, function(err, fields, files) {
        var file = files.file;
        var filePath = file.path;
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        var newFileName = file.hash + fileExt;
        var newFilePath = path.join(logoDir + newFileName);

        fs.rename(filePath, newFilePath, function (err) {
            res.end('/logos/' + newFileName);
        });
    });
});

router.post('/price/forum/img/remove', function (req, res) {
    var fileName = req.body.fileName;
    var filePath = global.logoDir + fileName;
    fs.unlink(filePath, function(err) {
        res.end('删除图片成功！');
    });
});



router.get('/price/flow', function (req, res) {
    Product.open().find({type: 'flow'})
        .then(function (products) {
            res.render('adminPriceFlow', {title: '价格&状态管理 / 流量模块', money: 10.01, products: products.reverse()});
        });
});

router.post('/price/flow', function (req, res) {
    Product.open().insert(req.body)
        .then(function (result) {
            res.send(result[0]);
        });
});

router.post('/price/flow/update', function (req, res) {
    var id = req.body.id;
    delete req.body.id;
    Product.open().updateById(id, {$set: req.body})
        .then(function (result) {
            res.end();
        });
});

router.post('/price/flow/delete', function (req, res) {
    Product.open().removeById(req.body.id)
        .then(function () {
            res.end();
        });
});


router.get('/price/WX/MP/WB', function (req, res) {
    Product.open().find({type: {$in: ['wx', 'wb', 'mp']}})
        .then(function (products) {
            res.render('adminPriceWXMPWB', {title: '价格&状态管理 / 微信、美拍、微博', money: 10.01, products: products.reverse()});
        });
});

router.post('/price/WX/MP/WB', function (req, res) {
    Product.open().insert(req.body)
        .then(function (result) {
            res.send(result[0]);
        });
});

router.post('/price/WX/MP/WB/update', function (req, res) {
    var id = req.body.id;
    delete req.body.id;
    Product.open().updateById(id, {$set: req.body})
        .then(function (result) {
            res.end();
        });
});

router.post('/price/WX/MP/WB/delete', function (req, res) {
    Product.open().removeById(req.body.id)
        .then(function () {
            res.end();
        });
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
    res.render('adminReplyWait', {title: '回复任务管理 / 待处理订单', money: 10.01})
});

router.get('/reply/already', function (req, res) {
    res.render('adminReplyAlre', {title: '回复任务管理 / 已处理订单', money: 10.01})
});



router.get('/flow/wait', function (req, res) {
    res.render('adminFlowWait', {title: '流量任务管理 / 待处理订单', money: 10.01})
});

router.get('/flow/already', function (req, res) {
    res.render('adminFlowAlre', {title: '流量任务管理 / 已处理订单', money: 10.01})
});



router.get('/WX/article/wait', function (req, res) {
    res.render('adminWXarticleWait', {title: '微信任务管理 / 待处理微信原文任务', money: 10.01})
});

router.get('/WX/article/already', function (req, res) {
    res.render('adminWXarticleAlre', {title: '微信任务管理 / 已处理微信原文任务', money: 10.01})
});

router.get('/WX/like/wait', function (req, res) {
    res.render('adminWXlikeWait', {title: '微信任务管理 / 待处理微信阅读点赞任务', money: 10.01})
});

router.get('/WX/like/already', function (req, res) {
    res.render('adminWXlikeAlre', {title: '微信任务管理 / 已处理微信阅读点赞任务', money: 10.01})
});

router.get('/WX/reply/wait', function (req, res) {
    res.render('adminWXreplyWait', {title: '微信任务管理 / 待处理公众粉丝回复任务', money: 10.01})
});

router.get('/WX/reply/already', function (req, res) {
    res.render('adminWXreplyAlre', {title: '微信任务管理 / 已处理公众粉丝回复任务', money: 10.01})
});

router.get('/WX/friend/wait', function (req, res) {
    res.render('adminWXfriendWait', {title: '微信任务管理 / 待处理微信个人好友任务', money: 10.01})
});

router.get('/WX/friend/already', function (req, res) {
    res.render('adminWXfriendAlre', {title: '微信任务管理 / 已处理微信个人好友任务', money: 10.01})
});

router.get('/WX/code/wait', function (req, res) {
    res.render('adminWXcodeWait', {title: '微信任务管理 / 待处理微信好友地区扫码', money: 10.01})
});

router.get('/WX/code/already', function (req, res) {
    res.render('adminWXcodeAlre', {title: '微信任务管理 / 已处理微信好友地区扫码', money: 10.01})
});



router.get('/MP/wait', function (req, res) {
    res.render('adminMPWait', {title: '美拍任务管理 / 待处理订单', money: 10.01})
});

router.get('/MP/already', function (req, res) {
    res.render('adminMPAlre', {title: '美拍任务管理 / 已处理订单', money: 10.01})
});



router.get('/WB/wait', function (req, res) {
    res.render('adminWBWait', {title: '微博任务管理 / 待处理订单', money: 10.01})
});

router.get('/WB/already', function (req, res) {
    res.render('adminWBAlre', {title: '微博任务管理 / 已处理订单', money: 10.01})
});



router.get('/error/wait', function (req, res) {
    res.render('adminErrorWait', {title: '错误信息管理 / 待处理错误报告', money: 10.01})
});

router.get('/error/already', function (req, res) {
    res.render('adminErrorAlre', {title: '错误信息管理 / 待处理错误报告', money: 10.01})
});



router.get('/feedback/wait', function (req, res) {
    Feedback.open().find({
        status: '未处理'
    }).then(function(feedbacks) {
        res.render('adminFeedbackWait', {
            title: '问题反馈信息管理 / 待处理问题反馈信息',
            money: 10.01,
            feedbacks: feedbacks
        });
    })
});

router.post('/feedback/wait/handle', function (req, res) {
    Feedback.handleFeedback(req.body, function(result) {
        res.redirect('/admin/feedback/wait');
    });
});

router.get('/feedback/already', function (req, res) {
    Feedback.open().find({
        status: '已处理'
    }).then(function (feedbacks) {
        res.render('adminFeedbackAlre', {
            title: '问题反馈信息管理 / 已处理问题反馈信息',
            money: 10.01,
            feedbacks: feedbacks
        });
    });
});


module.exports = router;