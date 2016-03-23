/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');

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
            res.render('flowForumTask', {
                title: '论坛流量任务',
                money: user.funds,
                userStatus: user.status,
                username: user.username,
                role: user.role
            })
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

module.exports = router;