/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/taskHistory', function (req, res) {
    res.render('flowTaskHistory', {title: '流量业务任务历史', money: 10.01})
});

router.get('/forumTask', function (req, res) {
    res.render('forumFlowTask', {title: '论坛流量任务', money: 10.01})
});

router.get('/videoTask', function (req, res) {
    res.render('videoFlowTask', {title: '视频流量任务', money: 22});
});

module.exports = router;