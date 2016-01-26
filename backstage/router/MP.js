/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/like', function (req, res) {
    res.render('MPlike', {title: '美拍点赞任务', money: 10.01})
});

router.get('/comment', function (req, res) {
    res.render('MPcomment', {title: '美拍评论任务', money: 111});
});

router.get('/attention', function (req, res) {
    res.render('MPattention', {title: '美拍关注任务', money: 22});
});

router.get('/forward', function (req, res) {
    res.render('MPforward', {title: '美拍转发任务', money: 33});
});

module.exports = router;