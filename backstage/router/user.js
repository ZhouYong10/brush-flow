/**
 * Created by zhouyong10 on 1/24/16.
 */
var User = require('../models/User');
var router = require('express').Router();

router.get('/recharge', function (req, res) {
    res.render('recharge', {title: '在线充值', money: 10.01})
});

router.get('/recharge/history', function (req, res) {
    res.render('rechargeHistory', {title: '充值记录', money: 10.01})
});

router.get('/consume/history', function (req, res) {
    res.render('consumeHistory', {title: '消费记录', money: 10.01})
});

router.get('/info', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('userInfo', {title: '我的详细信息', money: 10.01, user: user});
        }, function (error) {
            res.send('获取用户详细信息失败： ' + error);
        });
});

router.post('/info', function (req, res) {
    var update = req.body;
    User.open().updateById(req.session.passport.user, {
        $set: {
            QQ: update.QQ,
            phone: update.phone,
            email: update.email
        }
    }).then(function (user) {
        res.redirect('/user/info');
    }, function (error) {
        res.send('更新用户信息失败： ' + error);
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/changePwd', function (req, res) {
    res.render('changePassword', {title: '修改账号密码', money: 22.22});
});

router.post('/changePwd', function (req, res) {
    var info = req.body;
    var oldPwd = info.oldpwd,
        newPwd = info.newpwd,
        repeatPwd = info.repeatpwd;

    //res.render('changePassword', {title: '修改账号密码', money: 22.22});
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

router.get('/withdraw/add', function (req, res) {
    res.render('withdrawAdd', {title: '申请提现', money: 100});
});

router.get('/errorSummary', function (req, res) {
    res.render('errorSummary', {title: '错误信息汇总', money: 200});
});   

module.exports = router;