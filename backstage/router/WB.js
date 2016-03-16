/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Product = require('../models/Product');


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