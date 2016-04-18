/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var Product = require('../models/Product');
var Order = require('../models/Order');

var router = require('express').Router();

router.get('/taskHistory', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('flowTaskHistory', {
                title: '流量业务任务历史',
                money: user.funds,
                userStatus: user.status,
                username: user.username,
                role: user.role
            })
        });
});

router.get('/forumTask', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'flow', smallType: 'forum'})
                .then(function(result) {
                    var instance = Product.wrapToInstance(result);
                    res.render('flowForumTask', {
                        title: '论坛流量任务',
                        money: user.funds,
                        userStatus: user.status,
                        username: user.username,
                        role: user.role,
                        price: instance.getPriceByRole(user.role)
                    })
                })
        });
});

router.post('/forumTask', function (req, res) {
    var orderInfo = req.body;
    if(orderInfo.num <= 10000) {
        orderInfo.num = 2;
    }else {
        orderInfo.num = parseInt(orderInfo.num / 5000) + (orderInfo.num % 5000 > 0 ? 1 : 0);
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.createAndSave(user, {type: 'flow', smallType: 'forum'})
                .then(function () {
                    socketIO.emit('updateNav', {'flow': 1});
                    res.redirect('/flow/taskHistory');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/videoTask', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('flowVideoTask', {
                title: '视频流量任务',
                money: user.funds,
                userStatus: user.status,
                username: user.username,
                role: user.role
            });
        });
});

router.post('/videoTask', function (req, res) {
    var orderInfo = req.body;
    if(orderInfo.num <= 10000) {
        orderInfo.num = 10;
    }else {
        orderInfo.num = parseInt(orderInfo.num / 1000) + (orderInfo.num % 1000 > 0 ? 1 : 0);
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.createAndSave(user, {type: 'flow', smallType: 'video', name: orderInfo.name})
                .then(function () {
                    socketIO.emit('updateNav', {'flow': 1});
                    res.redirect('/flow/taskHistory');
                }, function() {
                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                });
        });
});

router.get('/video/get/price', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var address = req.query.address;
            var arr = address.split('/')[2].split('.');
            arr.shift();
            var mainUrl = arr.join('.');
            Product.open().findOne({
                type: 'flow',
                address: new RegExp(mainUrl)
            }).then(function (result) {
                if(result) {
                    var instance = Product.wrapToInstance(result);
                    res.send({
                        isOk: true,
                        price: instance.getPriceByRole(user.role),
                        name: result.name
                    });
                }else {
                    res.send({
                        isOk: false,
                        message: '对不起，暂时不支持该链接地址！'
                    })
                }
            });
        });
});

module.exports = router;