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
            res.render('WBlike', {
                title: '微博高级点赞任务',
                money: user.funds,
                username: user.username,
                role: user.role
            })
        });
});

router.get('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wb', smallType: 'like'})
                .then(function(result) {
                    var resultIns = Product.wrapToInstance(result);
                    var myPrice = resultIns.getPriceByRole(user.role);
                    res.render('WBlikeAdd', {
                        title: '添加微博高级点赞任务',
                        money: user.funds,
                        username: user.username,
                        role: user.role,
                        price: myPrice
                    });
                });
        });
});

router.post('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(req.body);
            order.createAndSave(user, {type: 'wb', smallType: 'like'})
                .then(function () {
                    socketIO.emit('updateNav', {'wb': 1});
                    res.redirect('/wb/like');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/vote', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBvote', {
                title: '微博投票任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/vote/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBvoteAdd', {
                title: '添加微博投票任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBfans', {
                title: '微博粉丝任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/fans/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBfansAdd', {
                title: '添加微博粉丝任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/forward', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBforward', {
                title: '微博转发任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

router.get('/forward/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WBforwardAdd', {
                title: '添加微博转发任务',
                money: user.funds,
                username: user.username,
                role: user.role
            });
        });
});

module.exports = router;