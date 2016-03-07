/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/like', function (req, res) {
    var user = req.session.user;
    res.render('WBlike', {
        title: '微博高级点赞任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/like/add', function (req, res) {
    var user = req.session.user;
    res.render('WBlikeAdd', {
        title: '添加微博高级点赞任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/vote', function (req, res) {
    var user = req.session.user;
    res.render('WBvote', {
        title: '微博投票任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/vote/add', function (req, res) {
    var user = req.session.user;
    res.render('WBvoteAdd', {
        title: '添加微博投票任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/fans', function (req, res) {
    var user = req.session.user;
    res.render('WBfans', {
        title: '微博粉丝任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/fans/add', function (req, res) {
    var user = req.session.user;
    res.render('WBfansAdd', {
        title: '添加微博粉丝任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/forward', function (req, res) {
    var user = req.session.user;
    res.render('WBforward', {
        title: '微博转发任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/forward/add', function (req, res) {
    var user = req.session.user;
    res.render('WBforwardAdd', {
        title: '添加微博转发任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

module.exports = router;