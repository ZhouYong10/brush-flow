/**
 * Created by ubuntu64 on 4/7/17.
 */
var User = require('../models/User');
var Order = require('../models/Order');
var Recharge = require('../models/Recharge');
var Withdraw = require('../models/Withdraw');
var Profit = require('../models/Profit');
var Product = require('../models/Product');
var Task = require('../models/Task');
var moment = require('moment');

var router = require('express').Router();



//人工平台充值接口
router.get('/recharge', function (req, res) {
    Recharge.record(req.query)
        .then(function (alipayFunds) {
            res.send({
                isOK: true,
                alipayFunds: alipayFunds
            });
        }, function (errInfo) {
            res.send(errInfo);
        });
});

router.get('/recharge/history', function (req, res) {
    var info = {
        query: {
            type: req.query.type,
            userId: req.query.userId
        },
        page: req.query.page
    };
    Recharge.history(info).then(function (obj) {
        res.send(obj);
    }, function(errMsg) {
        res.send(errMsg);
    });
});

router.get('/search/recharge', function (req, res) {
    var query = {
        type: req.query.type,
        userId: req.query.userId
    };
    if(req.query.funds) {
        query.funds = parseFloat(req.query.funds);
    }
    if(req.query.createTime) {
        query.createTime = new RegExp(req.query.createTime);
    }
    var info = {
        query: query,
        page: req.query.page
    };
    Recharge.history(info).then(function (obj) {
        res.send(obj);
    }, function(errMsg) {
        res.send(errMsg);
    });
});

//获取人工平台的充值记录列表
router.get('/manage/recharge', function (req, res) {
    Recharge.open().findPages({type: req.query.type}, req.query.page, {'createTime': -1})
        .then(function (obj) {
            res.send(obj);
        }, function (error) {
            res.send('查询充值记录失败： ' + error);
        })
});

router.get('/search/recharge/by/alipayId', function (req, res) {
    Recharge.open().find({
        type: req.query.type,
        alipayId: req.query.alipayId
    }).then(function(obj) {
        res.send(obj);
    }, function(error) {
        res.send('查询充值记录失败： ' + error);
    })
});

router.get('/hand/recharge', function (req, res) {
    var info = req.query;
    Recharge.open().findById(info.alipayId).then(function (record) {
        if (record.isRecharge) {
            res.send({
                isOk: false
            });
        } else {
            Recharge.open().updateById(record._id, {
                $set: {
                    funds: parseFloat(info.funds),
                    isRecharge: true,
                    status: '成功',
                    userNowFunds: (parseFloat(record.userOldFunds) + parseFloat(info.funds)).toFixed(4)
                }
            }).then(function () {
                res.send({
                    isOk: true,
                    userId: record.userId
                });
            });
        }
    });
});

router.get('/hand/recharge/refuse', function (req, res) {
    var info = req.query;
    Recharge.handRefuse(info.alipayId, info.msg).then(function() {
        res.end();
    })
});


module.exports = router;