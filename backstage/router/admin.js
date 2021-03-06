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
var Order = require('../models/Order');

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
                User.getSystemFunds().then(function (count) {
                    req.session.systemFunds = count;
                    next();
                });
            }else{
                console.log('不是管理员，不能非法登陆。。。。。。。。。。。。');
                res.redirect('/');
            }
        }, function (error) {
            res.send('获取用户信息失败： ' + error);
        });
});


router.get('/home', function (req, res) {
    Placard.open().findPages(null, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminHome', {
                title: '管理员公告',
                money: req.session.systemFunds,
                placards: obj.results,
                pages: obj.pages
            });
        }, function (error) {
            return res.send('获取公告列表失败： ' + error);
        });
});

router.get('/get/system/funds', function(req, res) {
    User.getSystemFunds().then(function (count) {
        req.session.systemFunds = count;
        res.end(count);
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
        Order.open().find({error: '未处理'}).then(function (errorOrders) {
            if (errorOrders) {
                updateNav.error = errorOrders.length;
            }
            Feedback.open().find({status: '未处理'}).then(function (feedbacks) {
                if (feedbacks) {
                    updateNav.feedback = feedbacks.length;
                }
                Order.open().find({status: '未处理'})
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
                                            case 'article': case 'share': case 'collect':
                                                updateNav.wxArticle += 1;
                                                break;
                                            case 'read': case 'like':
                                                updateNav.wxLike += 1;
                                                break;
                                            case 'fans': case 'fansReply':
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
    Recharge.open().findPages(null, (req.query.page ? req.query.page : 1))
        .then(function(obj) {
            res.render('adminRechargeHistory', {
                title: '资金管理 / 充值记录',
                money: req.session.systemFunds,
                recharges: obj.results,
                pages: obj.pages,
                path: '/admin/recharge/history'
            });
        }, function(error) {
            res.send('查询充值记录失败： ' + error);
        })
});

router.get('/search/recharge/by/alipayId', function (req, res) {
    Recharge.open().findPages({alipayId: req.query.alipayId.replace(/(^\s*)|(\s*$)/g,"")}, (req.query.page ? req.query.page : 1))
        .then(function(obj) {
            res.render('adminRechargeHistory', {
                title: '资金管理 / 充值记录',
                money: req.session.systemFunds,
                recharges: obj.results,
                pages: obj.pages,
                path: '/admin/recharge/history'
            });
        }, function(error) {
            res.send('查询充值记录失败： ' + error);
        })
});

router.get('/search/user/recharge', function (req, res) {
    if(req.query.userId){
        req.session.searchRecharge = req.query.userId;
    }
    Recharge.findRechargeByUserId(req.session.searchRecharge, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminRechargeHistory', {
                title: '资金管理 / 充值记录',
                money: req.session.systemFunds,
                recharges: obj.results,
                pages: obj.pages,
                path: '/admin/recharge/history'
            });
        }, function (error) {
            res.send('查询充值记录失败： ' + error);
        });
});

router.get('/hand/recharge', function (req, res) {
    var msg = req.query;
    if(isNaN(msg.funds)) {
        res.send('充值金额必须是数字。。。。。。');
    }else {
        Recharge.hand(msg.id, msg.funds).then(function(backInfo) {
            if(backInfo) {
                res.send(backInfo);
            }else {
                res.redirect(msg.url);
            }
        })
    }
});

router.get('/hand/recharge/refuse', function (req, res) {
    var msg = req.query;
    Recharge.handRefuse(msg.id, msg.info).then(function() {
        res.redirect(msg.url);
    })
});

router.get('/withdraw/wait', function (req, res) {
    Withdraw.open().findPages({status: '未处理'}, (req.query.page ? req.query.page : 1))
        .then(function(obj) {
            res.render('adminWithdrawWait', {
                title: '资金管理 / 提现管理 / 待处理',
                money: req.session.systemFunds,
                withdraws: obj.results,
                pages: obj.pages,
                path: '/admin/withdraw/wait'
            });
        })
});

router.get('/withdraw/already', function (req, res) {
    Withdraw.open().findPages({status: {$in: ['成功', '失败']}}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWithdrawAlre', {
                title: '资金管理 / 提现管理 / 已处理',
                money: req.session.systemFunds,
                withdraws: obj.results,
                pages: obj.pages,
                path: '/admin/withdraw/already'
            });
        });
});

router.get('/withdraw/complete', function (req, res) {
    Withdraw.complete(req.query.id)
        .then(function() {
            res.redirect(req.query.url);
        })
});

router.get('/withdraw/refused', function (req, res) {
    var obj = req.query;
    Withdraw.refused(obj.id, obj.info, obj.funds, obj.userId)
        .then(function() {
            res.redirect(obj.url);
        })
});


/*
 * manage user
 * */
router.get('/manage/user', function (req, res) {
    User.open().findPages(null, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminManageUser', {
                title: '设置 / 用户管理 / 所有用户',
                money: req.session.systemFunds,
                users: obj.results,
                pages: obj.pages
            });
        }, function (error) {
            res.send('获取用户列表失败： ' + error);
        });
});

router.get('/search/user', function (req, res) {
    User.open().findPages({
        username: new RegExp(req.query.username)
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminManageUser', {
                title: '设置 / 用户管理 / 所有用户',
                money: req.session.systemFunds,
                users: obj.results,
                pages: obj.pages
            });
        }, function (error) {
            res.send('获取用户列表失败： ' + error);
        });
});

router.get('/manage/user/edit', function(req, res) {
    User.open().findById(req.query.id)
        .then(function (user) {
            res.render('adminManageUserEdit', {
                title: '设置 / 用户管理 / 编辑用户信息',
                money: req.session.systemFunds,
                user: user
            });
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

router.get('/user/edit/reset/password', function (req, res) {
    User.resetPassword(req.query.id)
        .then(function() {
            res.end();
        })
});

router.get('/manage/user/del', function(req, res) {
    User.removeUser(req.query.id).then(function () {
        res.redirect('/admin/manage/user');
    });
});

router.get('/manage/user/add', function (req, res) {
    res.render('adminManageUserAdd', {
        title: '设置 / 用户管理 / 添加用户',
        money: req.session.systemFunds
    })
});

router.post('/manage/user/add', function (req, res) {
    var userInfo = req.body;
    userInfo.username = userInfo.username.replace(/(^\s*)|(\s*$)/g, "");
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
    Product.open().findPages({type: 'forum'}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminPriceForum', {
                title: '价格&状态管理 / 论坛模块',
                money: req.session.systemFunds,
                products: obj.results,
                pages: obj.pages
            });
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
    Product.open().findPages({type: 'flow'}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminPriceFlow', {
                title: '价格&状态管理 / 流量模块',
                money: req.session.systemFunds,
                products: obj.results,
                pages: obj.pages
            });
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
    Product.open().findPages({type: {$in: ['wx', 'wb', 'mp']}}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminPriceWXMPWB', {
                title: '价格&状态管理 / 微信、美拍、微博',
                money: req.session.systemFunds,
                products: obj.results,
                pages: obj.pages
            });
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
    res.render('adminPlacardSend', {title: '公告管理 / 发布公告', money: req.session.systemFunds})
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
    Placard.open().findPages(null, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminPlacardHistory', {
                title: '公告管理 / 历史公告',
                money: req.session.systemFunds,
                placards: obj.results,
                pages: obj.pages
            });
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
    res.render('adminPlacardAdd', {title: '公告管理 / 添加公告类型', money: req.session.systemFunds})
});



/*
* order complete
* */
router.get('/order/complete', function (req, res) {
    var orderId = req.query.id;
    var url = req.query.url;
    Order.open().findById(orderId)
        .then(function(order) {
            if(order.status != '已处理'){
                var orderIns = Order.wrapToInstance(order);
                orderIns.complete(function() {
                    res.redirect(url);
                });
            }else {
                res.redirect(url);
            }
        })
});

router.get('/order/refund', function (req, res) {
    var msg = req.query;
    Order.open().findById(msg.id)
        .then(function(order) {
            if(order.status != '已退款'){
                var orderIns = Order.wrapToInstance(order);
                orderIns.refund(msg.info, function() {
                    res.redirect(msg.url);
                });
            }else {
                res.redirect(msg.url);
            }
        })
});

router.get('/order/refundProfit', function (req, res) {
    var msg = req.query;
    Order.open().findById(msg.id)
        .then(function(order) {
            if(order.status != '已退款'){
                var orderIns = Order.wrapToInstance(order);
                orderIns.refundProfit(msg.info, function() {
                    res.redirect(msg.url);
                });
            }else {
                res.redirect(msg.url);
            }
        })
});

router.get('/order/dealError', function (req, res) {
    var msg = req.query;
    Order.open().findById(msg.id)
        .then(function(order) {
            if(order.error != '已处理'){
                var orderIns = Order.wrapToInstance(order);
                orderIns.dealError(msg.info, function() {
                    res.redirect(msg.url);
                });
            }else {
                res.redirect(msg.url);
            }
        })
});



/*
 * manage order form
 * */
router.get('/reply/wait', function (req, res) {
    Order.open().findPages({
            type: 'forum',
            status: '未处理'
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminReplyWait', {
                title: '回复任务管理 / 待处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/reply/wait'
            });
        });
});

router.get('/reply/already', function (req, res) {
    Order.open().findPages({
            type: 'forum',
            status: {$ne: '未处理'}
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminReplyAlre', {
                title: '回复任务管理 / 已处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/reply/already'
            });
        });
});



router.get('/flow/wait', function (req, res) {
    Order.open().findPages({
            type: 'flow',
            status: '未处理'
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminFlowWait', {
                title: '流量任务管理 / 待处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/flow/wait'
            });
        });
});

router.get('/flow/already', function (req, res) {
    Order.open().findPages({
            type: 'flow',
            status: {$ne: '未处理'}
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminFlowAlre', {
                title: '流量任务管理 / 已处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/flow/already'
            });
        });
});



router.get('/WX/article/wait', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: {$in: ['article', 'share', 'collect']},
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXarticleWait', {
                title: '微信任务管理 / 待处理微信原文任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/article/wait'
            });
        });
});

router.get('/WX/article/already', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: {$in: ['article', 'share', 'collect']},
        status: {$ne: '未处理'}
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXarticleAlre', {
                title: '微信任务管理 / 已处理微信原文任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/article/already'
            });
        });
});

router.get('/WX/like/wait', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXlikeWait', {
                title: '微信任务管理 / 待处理微信阅读点赞任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/like/wait',
                wxReadIsOpen: Order.wxReadIsOpen()
            });
        });
});

router.get('/WX/like/already', function (req, res) {
    var search = {
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        status: {$ne: '未处理'}
    };
    Order.open().findPages(search, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            Order.open().find(search).then(function(allObj) {
                var readTotal = 0;
                for(var i = 0; i < allObj.length; i++) {
                    readTotal += parseInt(allObj[i].num);
                }
                res.render('adminWXlikeAlre', {
                    title: '微信任务管理 / 已处理微信阅读点赞任务',
                    money: req.session.systemFunds,
                    orders: obj.results,
                    pages: obj.pages,
                    path: '/admin/WX/like/already',
                    readTotal: readTotal
                });
            })
        });
});

router.get('/search/WX/like/dingding', function (req, res) {
    var search = {
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        status: '已处理',
        createTime: new RegExp(req.query.date)
    };
    if(req.query.type) {
        search.remote = req.query.type;
    }
    Order.open().findPages(search, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            Order.open().find(search).then(function(allObj) {
                var readTotal = 0;
                for(var i = 0; i < allObj.length; i++) {
                    readTotal += parseInt(allObj[i].num);
                }
                res.render('adminWXlikeAlre', {
                    title: '微信任务管理 / 已处理微信阅读点赞任务',
                    money: req.session.systemFunds,
                    orders: obj.results,
                    pages: obj.pages,
                    path: '/admin/WX/like/already',
                    readTotal: readTotal
                });
            })
        });
});

router.get('/open/wx/read/like', function (req, res) {
    Order.openWXReadAuto(req.query.cookie);
    res.end('ok');
});

router.get('/close/wx/read/like', function (req, res) {
    Order.closeWXReadAuto();
    res.end('ok');
});



router.get('/WX/reply/wait', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: 'fans',
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXreplyWait', {
                title: '微信任务管理 / 待处理公众粉丝回复任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/reply/wait',
                wxFansIsOpen: Order.wxFansIsOpen()
            });
        });
});

router.get('/WX/reply/already', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: 'fans',
        status: {$ne: '未处理'}
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXreplyAlre', {
                title: '微信任务管理 / 已处理公众粉丝回复任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/reply/already'
            });
        });
});

router.get('/WX/friend/wait', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: 'friend',
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXfriendWait', {
                title: '微信任务管理 / 待处理微信个人好友任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/friend/wait',
                wxFansIsOpen: Order.wxFansIsOpen()
            });
        });
});

router.get('/WX/friend/already', function (req, res) {
    Order.open().findPages({
        type: 'wx',
        smallType: 'friend',
        status: {$ne: '未处理'}
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXfriendAlre', {
                title: '微信任务管理 / 已处理微信个人好友任务',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/friend/already'
            });
        });
});

router.get('/open/wx/fans', function (req, res) {
    Order.openWXFansAuto(req.query.cookie);
    res.end('ok');
});

router.get('/close/wx/fans', function (req, res) {
    Order.closeWXFansAuto();
    res.end('ok');
});



router.get('/WX/code/wait', function (req, res) {
    Order.open().findPages({
            type: 'wx',
            smallType: 'code',
            status: '未处理'
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXcodeWait', {
                title: '微信任务管理 / 待处理微信好友地区扫码',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/code/wait',
                wxFansIsOpen: 'no'
            });
        });
});

router.get('/WX/code/already', function (req, res) {
    Order.open().findPages({
            type: 'wx',
            smallType: 'code',
            status: {$ne: '未处理'}
        }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWXcodeAlre', {
                title: '微信任务管理 / 已处理微信好友地区扫码',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WX/code/already'
            });
        });
});



router.get('/MP/wait', function (req, res) {
    Order.open().findPages({
        type: 'mp',
        smallType: {$in: ['like', 'comment', 'attention', 'forward']},
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminMPWait', {
                title: '美拍任务管理 / 待处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/MP/wait'
            });
        });
});

router.get('/MP/already', function (req, res) {
    Order.open().findPages({
        type: 'mp',
        smallType: {$in: ['like', 'comment', 'attention', 'forward']},
        status: {$ne: '未处理'}
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminMPAlre', {
                title: '美拍任务管理 / 已处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/MP/already'
            });
        });
});



router.get('/WB/wait', function (req, res) {
    Order.open().findPages({
        type: 'wb',
        smallType: {$in: ['like', 'vote', 'fans', 'fansTwo', 'fansEight', 'forward', 'forwardTwo', 'forwardEight', 'comment']},
        status: '未处理'}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWBWait', {
                title: '微博任务管理 / 待处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WB/wait'
            });
        });
});

router.get('/WB/already', function (req, res) {
    Order.open().findPages({
        type: 'wb',
        smallType: {$in: ['like', 'vote', 'fans', 'fansTwo', 'fansEight', 'forward', 'forwardTwo', 'forwardEight', 'comment']},
        status: {$ne: '未处理'}}, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
            res.render('adminWBAlre', {
                title: '微博任务管理 / 已处理订单',
                money: req.session.systemFunds,
                orders: obj.results,
                pages: obj.pages,
                path: '/admin/WB/already'
            });
        });
});



router.get('/error/wait', function (req, res) {
    Order.open().findPages({error: '未处理'}, (req.query.page ? req.query.page : 1), {'errorTime': -1})
        .then(function (obj) {
        res.render('adminErrorWait', {
            title: '错误信息管理 / 待处理错误报告',
            money: req.session.systemFunds,
            orders: obj.results,
            pages: obj.pages,
            path: '/admin/error/wait'
        });
    });
});

router.get('/error/already', function (req, res) {
    Order.open().findPages({error: '已处理'}, (req.query.page ? req.query.page : 1), {'errorTime': -1})
        .then(function (obj) {
        res.render('adminErrorAlre', {
            title: '错误信息管理 / 待处理错误报告',
            money: req.session.systemFunds,
            orders: obj.results,
            pages: obj.pages,
            path: '/admin/error/already'
        })
    });
});

router.get('/redirect/aim/order', function (req, res) {
    var orderId = req.query.id, type = req.query.type, smallType = req.query.smallType,
        render = '', title = '', money = req.session.systemFunds, pages = 1, path = '/admin/error/wait';
    Order.open().findById(orderId).then(function(result) {
        var arr = [];
        arr.push(result);
        switch (type) {
            case 'forum':
                render = 'adminReplyAlre';
                title = '回复任务管理 / 已处理订单';
                break;
            case 'flow':
                render = 'adminFlowAlre';
                title = '流量任务管理 / 已处理订单';
                break;
            case 'wx':
                switch (smallType) {
                    case 'article': case 'share': case 'collect':
                    render = 'adminWXarticleAlre';
                    title = '微信任务管理 / 已处理微信原文任务';
                    break;
                    case 'read': case 'like':
                    render = 'adminWXlikeAlre';
                    title = '微信任务管理 / 已处理微信阅读点赞任务';
                        break;
                    case 'fans':
                        render = 'adminWXreplyAlre';
                        title = '微信任务管理 / 已处理公众粉丝回复任务';
                        break;
                    case 'friend':
                        render = 'adminWXfriendAlre';
                        title = '微信任务管理 / 已处理微信个人好友任务';
                        break;
                    case 'code':
                        render = 'adminWXcodeAlre';
                        title = '微信任务管理 / 已处理微信好友地区扫码';
                        break;
                }
                break;
            case 'mp':
                render = 'adminMPAlre';
                title = '美拍任务管理 / 已处理订单';
                break;
            case 'wb':
                render = 'adminWBAlre';
                title = '微博任务管理 / 已处理订单';
                break;
        }
        res.render(render, {
            title: title,
            money: money,
            orders: arr,
            pages: pages,
            path: path,
            readTotal: result.num
        });
    })

});

router.get('/feedback/wait', function (req, res) {
    Feedback.open().findPages({
        status: '未处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function(obj) {
        res.render('adminFeedbackWait', {
            title: '问题反馈信息管理 / 待处理问题反馈信息',
            money: req.session.systemFunds,
            feedbacks: obj.results,
            pages: obj.pages
        });
    })
});

router.post('/feedback/wait/handle', function (req, res) {
    Feedback.handleFeedback(req.body, function(result) {
        res.redirect('/admin/feedback/wait');
    });
});

router.get('/feedback/already', function (req, res) {
    Feedback.open().findPages({
        status: '已处理'
    }, (req.query.page ? req.query.page : 1))
        .then(function (obj) {
        res.render('adminFeedbackAlre', {
            title: '问题反馈信息管理 / 已处理问题反馈信息',
            money: req.session.systemFunds,
            feedbacks: obj.results,
            pages: obj.pages
        });
    });
});


module.exports = router;