/**
 * Created by zhouyong10 on 1/24/16.
 */

var User = require('../models/User');
var Product = require('../models/Product');
var Order = require('../models/Order');

var moment = require('moment');
var Formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var router = require('express').Router();

Object.defineProperty(global, 'codeDir', {
    value: path.join(__dirname, '../public/codes/'),
    writable: false,
    configurable: false
});

router.get('/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'friend'
            }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('WXfriend', {
                        title: '公众粉丝(1000以上)',
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

router.get('/account/search/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'friend',
                    account: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXfriend', {
                        title: '公众粉丝(1000以上)',
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

router.get('/friend/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'friend'})
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    res.render('WXfriendAdd', {
                        title: '添加公众粉丝(1000以上)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        price: myPrice
                    })
                });
        });
});

router.post('/friend/add', function (req, res) {
    var orderInfo = req.body;
    orderInfo.account = orderInfo.account.replace(/(^\s*)|(\s*$)/g, "");
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.createAndSave(user, {type: 'wx', smallType: 'friend'})
                .then(function () {
                    socketIO.emit('updateNav', {'wxFriend': 1});
                    res.redirect('/wx/friend');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'fans'
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('WXfans', {
                        title: '公众粉丝(1000以下)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/fans'
                    })
                });
        });
});

router.get('/account/search/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'fans',
                    account: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXfans', {
                        title: '公众粉丝(1000以下)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/fans'
                    })
                });
        });
});

router.get('/fans/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'fans'})
                .then(function(fans) {
                    var fansIns = Product.wrapToInstance(fans);
                    var myFansPrice = fansIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'fansReply'})
                        .then(function(reply) {
                            var replyIns = Product.wrapToInstance(reply);
                            var myReplyPrice = replyIns.getPriceByRole(user.role);
                            res.render('WXfansAdd', {
                                title: '添加公众粉丝(1000以下)',
                                money: user.funds,
                                username: user.username,
                                userStatus: user.status,
                                role: user.role,
                                fansPrice: myFansPrice,
                                replyPrice: myReplyPrice
                            });
                        });
                });
        });
});

router.post('/fans/add', function (req, res) {
    var orderInfo = req.body;
    orderInfo.account = orderInfo.account.replace(/(^\s*)|(\s*$)/g, "");
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.createAndSave(user, {type: 'wx', smallType: 'fans'})
                .then(function () {
                    socketIO.emit('updateNav', {'wxReply': 1});
                    res.redirect('/wx/fans');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/share', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: {$in: ['article', 'share', 'collect']}
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXshare', {
                        title: '微信原文/分享/收藏',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/share'
                    });
                });
        });
});

router.get('/account/search/share', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: {$in: ['article', 'share', 'collect']},
                    address: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXshare', {
                        title: '微信原文/分享/收藏',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/share'
                    });
                });
        });
});

router.get('/share/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WXshareAdd', {
                title: '添加微信原文/分享/收藏任务',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        });
});

router.post('/share/add', function (req, res) {
    var orderInfo = req.body;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.createAndSave(user, {type: 'wx', smallType: orderInfo.smallType})
                .then(function () {
                    socketIO.emit('updateNav', {'wxArticle': 1});
                    res.redirect('/wx/share');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/get/price/by/type', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: req.query.type})
                .then(function(result) {
                    var productIns = Product.wrapToInstance(result);
                    var myPrice = productIns.getPriceByRole(user.role);
                    res.send({price: myPrice});
                });
        });
});

router.get('/like', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'read'
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXlike', {
                        title: '图文阅读/点赞',
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

router.get('/account/search/like', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'read',
                    address: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXlike', {
                        title: '图文阅读/点赞',
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

router.get('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'read'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'like'})
                        .then(function(like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            res.render('WXlikeAdd', {
                                title: '添加微信图文点赞任务',
                                money: user.funds,
                                username: user.username,
                                userStatus: user.status,
                                role: user.role,
                                price: myReadPrice,
                                price2: myLikePrice
                            });
                        });
                });
        });
});

router.post('/like/add', function (req, res) {
    var orderInfo = req.body;
    orderInfo.num = parseInt(orderInfo.num);
    if(orderInfo.num2 == ''){
        orderInfo.num2 = parseInt(orderInfo.num * 5 / 1000);
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {

            var order = Order.wrapToInstance(orderInfo);
            order.createAndSaveTwo(user, {type: 'wx', smallType: 'read'}, {type: 'wx', smallType: 'like'})
                .then(function () {
                    socketIO.emit('updateNav', {'wxLike': 1});
                    res.redirect('/wx/like');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/code', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'code'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXcode', {
                        title: '扫码关注',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/code'
                    })
                });
        });
});

router.get('/date/search/code', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'code',
                    createTime: new RegExp(req.query.createTime)
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXcode', {
                        title: '扫码关注',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/code'
                    })
                });
        });
});

router.get('/code/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'code'})
                .then(function(fans) {
                    var fansIns = Product.wrapToInstance(fans);
                    var myFansPrice = fansIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'codeReply'})
                        .then(function(reply) {
                            var replyIns = Product.wrapToInstance(reply);
                            var myReplyPrice = replyIns.getPriceByRole(user.role);
                            res.render('WXcodeAdd', {
                                title: '添加扫码关注任务',
                                money: user.funds,
                                username: user.username,
                                userStatus: user.status,
                                role: user.role,
                                fansPrice: myFansPrice,
                                replyPrice: myReplyPrice
                            });
                        });
                });
        });
});

router.post('/code/add', function (req, res) {
    var order = {};
    var form = new Formidable.IncomingForm();
    form.maxFieldsSize = 1024 * 1024;
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.hash = 'md5';
    var logoDir = form.uploadDir = global.codeDir;

    if(!fs.existsSync(logoDir)){
        fs.mkdirSync(logoDir);
    }
    form.on('error', function(err) {
            res.end(err); //各种错误
        }).on('field', function(field, value) {
            order[field] = value;
        }).on('file', function(field, file) { //上传文件
            var filePath = file.path;
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            var newFileName = file.hash + fileExt;
            var newFilePath = path.join(logoDir + newFileName);
            fs.rename(filePath, newFilePath, function (err) {
                order[field] = '/codes/' + newFileName;
                order.num2 = order.reply == '' ? 0 : order.num;
                User.open().findById(req.session.passport.user)
                    .then(function (user) {
                        var orderIns = Order.wrapToInstance(order);
                        orderIns.createAndSaveTwo(user, {type: 'wx', smallType: 'code'}, {type: 'wx', smallType: 'codeReply'})
                            .then(function () {
                                socketIO.emit('updateNav', {'wxCode': 1});
                                res.redirect('/wx/code');
                            }, function() {
                                res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                            });
                    });
            });
        });
    form.parse(req);
});

module.exports = router;