/**
 * Created by ubuntu64 on 5/11/16.
 */
var User = require('../models/User');
var Order = require('../models/Order');
var Task = require('../models/Task');

var router = require('express').Router();


router.get('/all', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    type: 'handle',
                    status: '已发布',
                    taskUsers: {$not: {$all: [user._id]}}
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('handleTaskAll', {
                        title: '任务大厅',
                        money: user.funds,
                        role: user.role,
                        userStatus: user.status,
                        username: user.username,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/forum/taskHistory'
                    });
                });
        });
});

router.get('/type', function (req, res) {
    var smallType = req.query.type;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    type: 'handle',
                    smallType: smallType,
                    status: '已发布'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('handleTaskAll', {
                        title: '任务大厅',
                        money: user.funds,
                        role: user.role,
                        userStatus: user.status,
                        username: user.username,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/forum/taskHistory'
                    });
                });
        });
});

router.get('/show', function (req, res) {
    var orderId = req.query.id;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findById(orderId)
                .then(function(order) {
                    res.render('handleTaskShow', {
                        money: user.funds,
                        role: user.role,
                        userStatus: user.status,
                        username: user.username,
                        order: order
                    });
                })
        });
});

router.post('/show', function (req, res) {
    Order.getOrder(req).then(function (info) {
        info.userId = req.session.passport.user;
        Task.createTask(info).then(function(task) {
            res.redirect('/task/all');
        })
    }, function() {
        res.end('提交表单失败： ',err); //各种错误
    });
});

router.get('/alre', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Task.open().findPages({
                    taskUserId: user._id
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    res.render('handleTaskAlre', {
                        title: '我做过的任务',
                        money: user.funds,
                        role: user.role,
                        userStatus: user.status,
                        username: user.username,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/forum/taskHistory'
                    });
                });
        });
});

router.get('/complaints', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'forum'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 1);
                    res.render('handleTaskComplaints', {
                        title: '我被投诉的任务',
                        money: user.funds,
                        role: user.role,
                        userStatus: user.status,
                        username: user.username,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/forum/taskHistory'
                    });
                });
        });
});

router.get('/account', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('handleTaskAccount', {
                title: '我做任务的微信账户',
                money: user.funds,
                user: user,
                username: user.username,
                userStatus: user.status,
                role: user.role
            });
        }, function (error) {
            res.send('获取用户详细信息失败： ' + error);
        });
});

router.post('/account', function (req, res) {
    var update = req.body;
    User.open().updateById(req.session.passport.user, {
        $set: {
            taskAccount: update.taskAccount,
            taskName: update.taskName
        }
    }).then(function (user) {
        res.redirect('/task/account');
    }, function (error) {
        res.send('更新用户信息失败： ' + error);
    });
});

module.exports = router;
