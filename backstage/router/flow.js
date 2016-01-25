/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/taskHistory', function (req, res) {
    res.render('flowTaskHistory', {title: '流量业务任务历史', money: 10.01})
});


module.exports = router;