/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/like', function (req, res) {
    res.render('WBlike', {title: '微博高级点赞任务', money: req.session.funds})
});

router.get('/like/add', function (req, res) {
    res.render('WBlikeAdd', {title: '添加微博高级点赞任务', money: req.session.funds})
});

router.get('/vote', function (req, res) {
    res.render('WBvote', {title: '微博投票任务', money: req.session.funds});
});

router.get('/vote/add', function (req, res) {
    res.render('WBvoteAdd', {title: '添加微博投票任务', money: req.session.funds});
});

router.get('/fans', function (req, res) {
    res.render('WBfans', {title: '微博粉丝任务', money: req.session.funds});
});

router.get('/fans/add', function (req, res) {
    res.render('WBfansAdd', {title: '添加微博粉丝任务', money: req.session.funds});
});

router.get('/forward', function (req, res) {
    res.render('WBforward', {title: '微博转发任务', money: req.session.funds});
});

router.get('/forward/add', function (req, res) {
    res.render('WBforwardAdd', {title: '添加微博转发任务', money: req.session.funds});
});

module.exports = router;