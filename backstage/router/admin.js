/**
 * Created by zhouyong10 on 1/24/16.
 */

var router = require('express').Router();

router.get('/home', function (req, res) {
    res.render('adminHome', {title: '管理员公告', money: 10.01})
});

module.exports = router;