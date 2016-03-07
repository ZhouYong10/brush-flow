/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/friend', function (req, res) {
    var user = req.session.user;
    res.render('WXfriend', {
        title: '微信个人好友',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/friend/add', function (req, res) {
    var user = req.session.user;
    res.render('WXfriendAdd', {
        title: '添加微信粉丝',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/fans', function (req, res) {
    var user = req.session.user;
    res.render('WXfans', {
        title: '微信公众粉丝',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/fans/add', function (req, res) {
    var user = req.session.user;
    res.render('WXfansAdd', {
        title: '添加微信公众粉丝任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/share', function (req, res) {
    var user = req.session.user;
    res.render('WXshare', {
        title: '微信原文/分享/收藏',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/share/add', function (req, res) {
    var user = req.session.user;
    res.render('WXshareAdd', {
        title: '添加微信原文/分享/收藏任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/like', function (req, res) {
    var user = req.session.user;
    res.render('WXlike', {
        title: '图文阅读/点赞',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/like/add', function (req, res) {
    var user = req.session.user;
    res.render('WXlikeAdd', {
        title: '添加微信图文点赞任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

module.exports = router;