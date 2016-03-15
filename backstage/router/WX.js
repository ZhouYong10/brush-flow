/**
 * Created by zhouyong10 on 1/24/16.
 */

var User = require('../models/User');
var Product = require('../models/Product');
var Order = require('../models/Order');

var moment = require('moment');
var router = require('express').Router();

router.get('/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().find({userId: user._id, type: 'wx', smallType: 'friend'})
                .then(function(results) {
                    res.render('WXfriend', {
                        title: '微信个人好友',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        orders: results.reverse()
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
                        title: '添加微信粉丝',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        price: myPrice
                    })
                });
        });
});

router.post('/friend/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
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
            Order.open().find({userId: user._id, type: 'wx', smallType: 'fans'})
                .then(function (results) {
                    res.render('WXfans', {
                        title: '微信公众粉丝',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        orders: results.reverse()
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
                                title: '添加微信公众粉丝任务',
                                money: user.funds,
                                username: user.username,
                                role: user.role,
                                fansPrice: myFansPrice,
                                replyPrice: myReplyPrice
                            });
                        });
                });
        });
});

router.post('/fans/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
            order.createAndSaveTwo(user, {type: 'wx', smallType: 'fans'}, {type: 'wx', smallType: 'fansReply'})
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
            Order.open().find({userId: user._id, type: 'wx', smallType: {$in: ['article', 'share', 'collect']}})
                .then(function (results) {
                    res.render('WXshare', {
                        title: '微信原文/分享/收藏',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        orders: results.reverse()
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
            Order.open().find({userId: user._id, type: 'wx', smallType: 'read'})
                .then(function (results) {
                    res.render('WXlike', {
                        title: '图文阅读/点赞',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        orders: results.reverse()
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
                                role: user.role,
                                price: myReadPrice,
                                price2: myLikePrice
                            });
                        });
                });
        });
});

router.post('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
            order.createAndSaveTwo(user, {type: 'wx', smallType: 'read'}, {type: 'wx', smallType: 'like'})
                .then(function () {
                    socketIO.emit('updateNav', {'wxLike': 1});
                    res.redirect('/wx/like');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

module.exports = router;