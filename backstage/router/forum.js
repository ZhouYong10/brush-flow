/**
 * Created by zhouyong10 on 1/25/16.
 */
/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/video', function (req, res) {
    res.render('forumTemplate', {title: '视频', money: 10.01})
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/changePwd', function (req, res) {
    res.render('changePassword', {title: '修改账号密码', money: 22.22});
});

router.get('/lowerUser', function (req, res) {
    res.render('lowerUser', {title: '我的下级用户', money: 33.33});
});

router.get('/addLowerUser', function (req, res) {
    res.render('addLowerUser', {title: '添加下级用户', money: 11});
});

router.get('/feedback', function (req, res) {
    res.render('feedback', {title: '问题反馈', money: 33});
});

router.get('/withdraw', function (req, res) {
    res.render('withdraw', {title: '我要提现', money: 100});
});

router.get('/errorSummary', function (req, res) {
    res.render('errorSummary', {title: '错误信息汇总', money: 200});
});

module.exports = router;