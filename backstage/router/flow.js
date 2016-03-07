/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/taskHistory', function (req, res) {
    var user = req.session.user;
    res.render('flowTaskHistory', {
        title: '流量业务任务历史',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/forumTask', function (req, res) {
    var user = req.session.user;
    res.render('flowForumTask', {
        title: '论坛流量任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/videoTask', function (req, res) {
    var user = req.session.user;
    res.render('flowVideoTask', {
        title: '视频流量任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

module.exports = router;