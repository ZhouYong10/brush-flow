/**
 * Created by zhouyong10 on 1/25/16.
 */
/**
 * Created by zhouyong10 on 1/24/16.
 */
var Product = require('../models/Product');

var router = require('express').Router();

router.get('/video', function (req, res) {

    res.render('forumTemplate', {title: '视频站点', money: req.session.funds})
});

router.get('/complex', function (req, res) {
    res.render('forumTemplate', {title: '综合社区', money: req.session.funds})
});

router.get('/female', function (req, res) {
    res.render('forumTemplate', {title: '女性时尚', money: req.session.funds})
});

router.get('/car', function (req, res) {
    res.render('forumTemplate', {title: '汽车社区', money: req.session.funds})
});

router.get('/estate', function (req, res) {
    res.render('forumTemplate', {title: '房产社区', money: req.session.funds})
});

router.get('/IT', function (req, res) {
    res.render('forumTemplate', {title: 'IT科技类', money: req.session.funds})
});

router.get('/blog', function (req, res) {
    res.render('forumTemplate', {title: '博客类', money: req.session.funds})
});

router.get('/child', function (req, res) {
    res.render('forumTemplate', {title: '母婴社区', money: req.session.funds})
});

router.get('/news', function (req, res) {
    res.render('forumTemplate', {title: '新闻门户', money: req.session.funds})
});

router.get('/travel', function (req, res) {
    res.render('forumTemplate', {title: '旅游社区', money: req.session.funds})
});

router.get('/finance', function (req, res) {
    res.render('forumTemplate', {title: '财经社区', money: req.session.funds})
});

router.get('/games', function (req, res) {
    res.render('forumTemplate', {title: '游戏社区', money: req.session.funds})
});

router.get('/taskHistory', function (req, res) {
    res.render('forumTaskHistory', {title: '论坛业务历史记录', money: req.session.funds})
});

module.exports = router;