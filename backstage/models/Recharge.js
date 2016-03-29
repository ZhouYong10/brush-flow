/**
 * Created by ubuntu64 on 2/26/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');

var User = require('./User');
var moment = require('moment');


var Recharge = new Class();


Recharge.extend(db);


Recharge.extend({
    open: function() {
        return Recharge.openCollection('Recharge');
    },
    record: function(record) {
        return new Promise(function(resolve, reject) {
            record.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
            record.isRecharge = false;
            record.status = '充值中';
            Recharge.open().insert(record)
                .then(function(result) {
                    resolve(result);
                })
        })
    },
    getAlipayIds: function() {
        return new Promise(function(resolve, reject) {
            Recharge.open().find({isRecharge: false})
                .then(function (results) {
                    var alipayIds = [];
                    for (var i = 0, len = results.length; i < len; i++) {
                        var result = results[i];
                        alipayIds.push(result.alipayId);
                    }
                    var sendStr = 'id:' + alipayIds.join(',');
                    resolve(sendStr);
                });
        })
    },
    updateRecord: function(result) {
        return new Promise(function(resolve, reject) {
            var ALIPAY_AUTH_KEY = 'c7a4ec69faed7e1a99c9752d6b5a21a9';
            /*
             * 结果的格式中有’N’,’F’,’S’等状态,现在顺带做个说明。
             201304180000100089005XXX6446|N|0         不存在这个交易号
             201304180000100089005XXX6446|F|0         订单交易号存在但是代表交易不成功
             201304180000100089005XXX6446|S|10.00  订单交易号存在且交易成功，交易金额是10元
             * */
            var checkInfo = result.split('|'), aliplayId = checkInfo[0],
                status = checkInfo[1], funds = checkInfo[2], key = checkInfo[3];
            if(key === ALIPAY_AUTH_KEY) {
                switch (status) {
                    case "N":
                        Recharge.open().update({alipayId: aliplayId}, {
                            $set: {
                                dec: '交易号不存在，请转账后再充值!',
                                isRecharge: true,
                                status: '失败'
                            }
                        }).then(function () {
                            resolve();
                        });
                        break;
                    case "F":
                        Recharge.open().update({alipayId: aliplayId}, {
                            $set: {
                                dec: '充值失败，请联系管理员!',
                                status: '失败'
                            }
                        }).then(function () {
                            resolve();
                        });
                        break;
                    case "S":
                        Recharge.open().findOne({alipayId: aliplayId})
                            .then(function (record) {
                                if(record.isRecharge) {
                                    resolve('已经充值过了还来，滚犊子...');
                                }else {
                                    Recharge.open().updateById(record._id, {
                                        $set: {
                                            funds: funds,
                                            isRecharge: true,
                                            dec: '充值成功!',
                                            status: '成功'
                                        }
                                    }).then(function () {
                                        User.open().findById(record.userId)
                                            .then(function (user) {
                                                var fundsNow = (parseFloat(user.funds) + parseFloat(funds)).toFixed(4);
                                                User.open().updateById(user._id, {
                                                    $set: {
                                                        funds: fundsNow
                                                    }
                                                }).then(function () {
                                                    resolve();
                                                });
                                            });
                                    });
                                }
                            });
                        break;
                }
            }else {
                resolve('滚犊子。。。');
            }
        })
    }
});


Recharge.include({

});


module.exports = Recharge;