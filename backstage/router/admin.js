/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/home', function (req, res) {
    res.render('adminHome', {title: '管理员公告', money: 10.01})
});


router.get('/recharge/history', function (req, res) {
    res.render('adminRechargeHistory', {title: '资金管理 / 充值记录', money: 10.01})
});

router.get('/withdraw/wait', function (req, res) {
    res.render('adminWithdrawWait', {title: '资金管理 / 提现管理 / 待处理', money: 10.01})
});

router.get('/withdraw/already', function (req, res) {
    res.render('adminWithdrawAlre', {title: '资金管理 / 提现管理 / 已处理', money: 10.01})
});

router.get('/manage/user', function (req, res) {
    res.render('adminManageUser', {title: '设置 / 用户管理', money: 10.01})
});



router.get('/price/forum', function (req, res) {
    res.render('adminPriceForum', {title: '价格&状态管理 / 论坛模块', money: 10.01})
});

router.get('/price/flow', function (req, res) {
    res.render('adminPriceFlow', {title: '价格&状态管理 / 流量模块', money: 10.01})
});

router.get('/price/WX/MP/WB', function (req, res) {
    res.render('adminPriceWXMPWB', {title: '价格&状态管理 / 微信、美拍、微博', money: 10.01})
});


router.get('/placard/send', function (req, res) {
    res.render('adminPlacardSend', {title: '公告管理 / 发布公告', money: 10.01})
});

router.get('/placard/history', function (req, res) {
    res.render('adminPlacardHistory', {title: '公告管理 / 历史公告', money: 10.01})
});

router.get('/placard/add', function (req, res) {
    res.render('adminPlacardAdd', {title: '公告管理 / 添加公告类型', money: 10.01})
});



router.get('/reply/wait', function (req, res) {
    res.render('adminReplyWait', {title: '回复订单管理 / 待处理订单', money: 10.01})
});

router.get('/reply/already', function (req, res) {
    res.render('adminReplyAlre', {title: '回复订单管理 / 已处理订单', money: 10.01})
});

router.get('/flow/wait', function (req, res) {
    res.render('adminFlowWait', {title: '流量订单管理 / 待处理订单', money: 10.01})
});

router.get('/flow/already', function (req, res) {
    res.render('adminFlowAlre', {title: '流量订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/article/wait', function (req, res) {
    res.render('adminWXarticleWait', {title: '微信原文类订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/article/already', function (req, res) {
    res.render('adminWXarticleAlre', {title: '微信原文类订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/like/wait', function (req, res) {
    res.render('adminWXlikeWait', {title: '微信阅读点赞订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/like/already', function (req, res) {
    res.render('adminWXlikeAlre', {title: '微信阅读点赞订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/reply/wait', function (req, res) {
    res.render('adminWXreplyWait', {title: '微信公众粉丝回复订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/reply/already', function (req, res) {
    res.render('adminWXreplyAlre', {title: '微信公众粉丝回复订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/friend/wait', function (req, res) {
    res.render('adminWXfriendWait', {title: '微信个人好友订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/friend/already', function (req, res) {
    res.render('adminWXfriendAlre', {title: '微信个人好友订单管理 / 已处理订单', money: 10.01})
});

router.get('/WX/code/wait', function (req, res) {
    res.render('adminWXcodeWait', {title: '微信好友地区扫码订单管理 / 待处理订单', money: 10.01})
});

router.get('/WX/code/already', function (req, res) {
    res.render('adminWXcodeAlre', {title: '微信好友地区扫码订单管理 / 已处理订单', money: 10.01})
});

router.get('/MP/wait', function (req, res) {
    res.render('adminMPWait', {title: '美拍订单管理 / 待处理订单', money: 10.01})
});

router.get('/MP/already', function (req, res) {
    res.render('adminMPAlre', {title: '美拍订单管理 / 已处理订单', money: 10.01})
});

router.get('/WB/wait', function (req, res) {
    res.render('adminWBWait', {title: '微博订单管理 / 待处理订单', money: 10.01})
});

router.get('/WB/already', function (req, res) {
    res.render('adminWBAlre', {title: '微博订单管理 / 已处理订单', money: 10.01})
});


router.get('/error/wait', function (req, res) {
    res.render('adminErrorWait', {title: '错误信息报告管理 / 待处理错误报告', money: 10.01})
});

router.get('/error/already', function (req, res) {
    res.render('adminErrorAlre', {title: '错误信息报告管理 / 待处理错误报告', money: 10.01})
});

router.get('/feedback/wait', function (req, res) {
    res.render('adminFeedbackWait', {title: '问题反馈信息管理 / 待处理问题反馈信息', money: 10.01})
});

router.get('/feedback/already', function (req, res) {
    res.render('adminFeedbackAlre', {title: '问题反馈信息管理 / 待处理问题反馈信息', money: 10.01})
});


module.exports = router;