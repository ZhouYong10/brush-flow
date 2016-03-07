/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/like', function (req, res) {
    var user = req.session.user;
    res.render('MPlike', {
        title: '美拍点赞任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/like/add', function (req, res) {
    var user = req.session.user;
    res.render('MPlikeAdd', {
        title: '添加美拍点赞任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    })
});

router.get('/comment', function (req, res) {
    var user = req.session.user;
    res.render('MPcomment', {
        title: '美拍评论任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/comment/add', function (req, res) {
    var user = req.session.user;
    res.render('MPcommentAdd', {
        title: '添加美拍评论任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/attention', function (req, res) {
    var user = req.session.user;
    res.render('MPattention', {
        title: '美拍关注任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/attention/add', function (req, res) {
    var user = req.session.user;
    res.render('MPattentionAdd', {
        title: '添加美拍关注任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/forward', function (req, res) {
    var user = req.session.user;
    res.render('MPforward', {
        title: '美拍转发任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});

router.get('/forward/add', function (req, res) {
    var user = req.session.user;
    res.render('MPforwardAdd', {
        title: '添加美拍转发任务',
        money: req.session.funds,
        username: user.username,
        role: user.role
    });
});
module.exports = router;