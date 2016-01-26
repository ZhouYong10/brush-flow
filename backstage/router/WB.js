/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/like', function (req, res) {
    res.render('WBlike', {title: '微博高级点赞任务', money: 10.01})
});

router.get('/vote', function (req, res) {
    res.render('WBvote', {title: '微博投票任务', money: 111});
});

router.get('/fans', function (req, res) {
    res.render('WBfans', {title: '微博粉丝任务', money: 22});
});

router.get('/forward', function (req, res) {
    res.render('WBforward', {title: '微博转发任务', money: 33});
});

module.exports = router;