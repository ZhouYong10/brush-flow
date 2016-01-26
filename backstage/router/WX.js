/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/friend', function (req, res) {
    res.render('WXfriend', {title: '微信个人好友', money: 10.01})
});

router.get('/fans', function (req, res) {
    res.render('WXfans', {title: '微信公众粉丝', money: 111});
});

router.get('/share', function (req, res) {
    res.render('WXshare', {title: '微信原文/分享/收藏', money: 22});
});

router.get('/like', function (req, res) {
    res.render('WXlike', {title: '图文阅读/点赞', money: 33});
});

module.exports = router;