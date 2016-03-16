/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Product = require('../models/Product');
var Order = require('../models/Order');

var router = require('express').Router();

router.get('/like', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().find({userId: user._id, type: 'mp', smallType: 'like'})
                .then(function(results) {
                    res.render('MPlike', {
                        title: '美拍点赞任务',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        orders: results.reverse()
                    })
                })
        });
});

router.get('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'mp', smallType: 'like'})
                .then(function(like) {
                    var likeIns = Product.wrapToInstance(like);
                    var myLikePrice = likeIns.getPriceByRole(user.role);
                    res.render('MPlikeAdd', {
                        title: '添加美拍点赞任务',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        price: myLikePrice
                    });
                });
        });
});

router.post('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
            order.createAndSave(user, {type: 'mp', smallType: 'like'})
                .then(function () {
                    socketIO.emit('updateNav', {'mp': 1});
                    res.redirect('/mp/like');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/comment', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('MPcomment', {
                title: '美拍评论任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/comment/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'mp', smallType: 'comment'})
                .then(function(comment) {
                    var commentIns = Product.wrapToInstance(comment);
                    var myCommentPrice = commentIns.getPriceByRole(user.role);
                    res.render('MPcommentAdd', {
                        title: '添加美拍评论任务',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        price: myCommentPrice
                    });
                });
        });
});

router.post('/comment/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
            order.createAndSave(user, {type: 'mp', smallType: 'comment'})
                .then(function () {
                    socketIO.emit('updateNav', {'mp': 1});
                    res.redirect('/mp/comment');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/attention', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('MPattention', {
                title: '美拍关注任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/attention/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('MPattentionAdd', {
                title: '添加美拍关注任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/forward', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('MPforward', {
                title: '美拍转发任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/forward/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('MPforwardAdd', {
                title: '添加美拍转发任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});
module.exports = router;