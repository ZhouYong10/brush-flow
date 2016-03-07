/**
 * Created by zhouyong10 on 1/25/16.
 */
/**
 * Created by zhouyong10 on 1/24/16.
 */
var Product = require('../models/Product');

var router = require('express').Router();

function viewForumItem(smallType, res, obj) {
    Product.open().find({type: 'forum', smallType: smallType})
        .then(function (products) {
            obj.products = products;
            res.render('forumTemplate', obj);
        });
}


router.get('/video', function (req, res) {
    var user = req.session.user;
    viewForumItem('video', res, {
        title: '视频站点',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/complex', function (req, res) {
    var user = req.session.user;
    viewForumItem('complex', res, {
        title: '综合社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/female', function (req, res) {
    var user = req.session.user;
    viewForumItem('female', res, {
        title: '女性时尚',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/car', function (req, res) {
    var user = req.session.user;
    viewForumItem('car', res, {
        title: '汽车社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/estate', function (req, res) {
    var user = req.session.user;
    viewForumItem('estate', res, {
        title: '房产社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/IT', function (req, res) {
    var user = req.session.user;
    viewForumItem('IT', res, {
        title: 'IT科技类',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/blog', function (req, res) {
    var user = req.session.user;
    viewForumItem('blog', res, {
        title: '博客类',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/child', function (req, res) {
    var user = req.session.user;
    viewForumItem('mother', res, {
        title: '母婴社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/news', function (req, res) {
    var user = req.session.user;
    viewForumItem('news', res, {
        title: '新闻门户',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/travel', function (req, res) {
    var user = req.session.user;
    viewForumItem('travel', res, {
        title: '旅游社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/finance', function (req, res) {
    var user = req.session.user;
    viewForumItem('economic', res, {
        title: '财经社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/games', function (req, res) {
    var user = req.session.user;
    viewForumItem('games', res, {
        title: '游戏社区',
        money: req.session.funds,
        role: user.role,
        username: user.username
    });
});

router.get('/taskHistory', function (req, res) {
    res.render('forumTaskHistory', {title: '论坛业务历史记录', money: req.session.funds})
});

module.exports = router;