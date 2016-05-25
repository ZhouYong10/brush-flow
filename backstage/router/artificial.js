/**
 * Created by ubuntu64 on 5/11/16.
 */
var User = require('../models/User');
var Order = require('../models/Order');
var Product = require('../models/Product');

var moment = require('moment');
var Formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = require('express').Router();

router.get('/WX/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'handle',
                    smallType: 'WXfans'
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    console.log(obj, '=====================');
                    res.render('handleWXfans', {
                        title: '人工微信粉丝(回复)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/artificial/WX/fans'
                    })
                })
        });
});

router.get('/WX/fans/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'handle', smallType: 'WXfans'})
                .then(function(result) {
                    var fans = Product.wrapToInstance(result);
                    var fansPrice = fans.getPriceByRole(user.role);
                    Product.open().findOne({type: 'handle', smallType: 'WXfansReply'})
                        .then(function(result) {
                            var reply = Product.wrapToInstance(result);
                            var replyPrice = reply.getPriceByRole(user.role);
                            res.render('handleWXfansAdd', {
                                title: '添加人工微信粉丝(回复)任务',
                                money: user.funds,
                                username: user.username,
                                userStatus: user.status,
                                role: user.role,
                                fansPrice: fansPrice,
                                replyPrice: replyPrice
                            })
                        });
                });
        });
});

Object.defineProperty(global, 'handleExam', {
    value: path.join(__dirname, '../public/handle_example/'),
    writable: false,
    configurable: false
});

function getOrder(req) {
    return new Promise(function(resolve, reject) {
        var order = {};
        var form = new Formidable.IncomingForm();
        form.maxFieldsSize = 1024 * 1024;
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.hash = 'md5';
        var logoDir = form.uploadDir = global.handleExam;

        if(!fs.existsSync(logoDir)){
            fs.mkdirSync(logoDir);
        }
        form.on('error', function(err) {
            reject(err);
        }).on('field', function(field, value) {
            order[field] = value;
        }).on('file', function(field, file) { //上传文件
            var filePath = file.path;
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            var newFileName = file.hash + fileExt;
            var newFilePath = path.join(logoDir + newFileName);
            fs.rename(filePath, newFilePath, function (err) {
                order[field] = '/handle_example/' + newFileName;
                resolve(order);
            });
        });
        form.parse(req);
    })
}

router.post('/WX/fans/add', function (req, res) {
    getOrder(req).then(function (order) {
        order.num2 = order.num;
        User.open().findById(req.session.passport.user)
            .then(function (user) {
                var orderIns = Order.wrapToInstance(order);
                if(orderIns.isTow) {
                    orderIns.handleCreateAndSaveTwo(user, {type: 'handle', smallType: 'WXfans'}, {type: 'handle', smallType: 'WXfansReply'})
                        .then(function () {
                            socketIO.emit('updateNav', {'waitHT': 1});
                            res.redirect('/artificial/WX/fans');
                        }, function() {
                            res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                        });
                }else {
                    delete orderIns.price2;
                    orderIns.handleCreateAndSave(user, {type: 'handle', smallType: 'WXfans'})
                        .then(function () {
                            socketIO.emit('updateNav', {'waitHT': 1});
                            res.redirect('/artificial/WX/fans');
                        }, function() {
                            res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                        });
                }
            });
    }, function() {
        res.end('提交表单失败： ',err); //各种错误
    });
});


router.get('/WX/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'friend'
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('handleWXfriend', {
                        title: '人工微信个人好友',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/friend'
                    })
                })
        });
});

router.get('/WX/friend/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'handle', smallType: 'WXfriend'})
                .then(function(result) {
                    var fans = Product.wrapToInstance(result);
                    var fansPrice = fans.getPriceByRole(user.role);
                    Product.open().findOne({type: 'handle', smallType: 'WXfansReply'})
                        .then(function(result) {
                            var reply = Product.wrapToInstance(result);
                            var replyPrice = reply.getPriceByRole(user.role);
                            res.render('handleWXfriendAdd', {
                                title: '添加人工微信个人好友任务',
                                money: user.funds,
                                username: user.username,
                                userStatus: user.status,
                                role: user.role,
                                fansPrice: fansPrice,
                                replyPrice: replyPrice
                            })
                        });
                });
        });
});

router.post('/WX/friend/add', function (req, res) {
    getOrder(req).then(function (order) {
        console.log(order, '=====================');
    }, function() {
        res.end('提交表单失败： ',err); //各种错误
    });
});

router.get('/WX/vote', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'friend'
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('handleWXvote', {
                        title: '人工微信投票',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/friend'
                    })
                })
        });
});

router.get('/WX/vote/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'friend'})
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    res.render('handleWXvoteAdd', {
                        title: '添加人工微信投票任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        price: myPrice
                    })
                });
        });
});


router.get('/WX/code', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'friend'
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('handleWXcode', {
                        title: '人工微信扫码',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/friend'
                    })
                })
        });
});

router.get('/WX/code/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'friend'})
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    res.render('handleWXcodeAdd', {
                        title: '添加人工微信扫码任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        price: myPrice
                    })
                });
        });
});


router.get('/WX/article', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'read'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('handleWXarticle', {
                        title: '人工微信原文/收藏/分享',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like'
                    })
                });
        });
});

router.get('/WX/article/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'friend'})
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    res.render('handleWXarticleAdd', {
                        title: '添加人工微信原文/收藏/分享任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        price: myPrice
                    })
                });
        });
});

router.get('/task/check', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'read'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('handleTaskCheck', {
                        title: '人工平台 / 待验收任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like'
                    })
                });
        });
});


module.exports = router;