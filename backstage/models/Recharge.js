/**
 * Created by ubuntu64 on 2/26/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');

var User = require('./User');
var moment = require('moment');
var request = require('request');


var Recharge = new Class();


Recharge.extend(db);


Recharge.extend({
    open: function() {
        return Recharge.openCollection('Recharge');
    },
    handRefuse: function(id, info) {
        return new Promise(function(resolve) {
            Recharge.open().updateById(id, {
                $set: {
                    dec: info,
                    isRecharge: true,
                    status: '失败'
                }
            }).then(function () {
                resolve();
            });
        })
    },
    record: function(alipayInfo) {
        return new Promise(function(resolve, reject) {
            var alipayDate = alipayInfo.alipayId.substr(0, 8),
                today = moment().format('YYYYMMDD');
            if(alipayDate < (today)) {
                reject({
                    isOK: false,
                    message: '该交易号已经过期！'
                });
            }else if(!(/^[0-9]*[1-9][0-9]*$/.test(alipayInfo.alipayId)) || (alipayInfo.alipayId.length != 32 && alipayInfo.alipayId.length != 28)){
                reject({
                    isOK: false,
                    message: '请输入合法的支付宝交易号!'
                });
            } else {
                //查询充值记录是否存在
                Recharge.open().findOne({
                    alipayId: alipayInfo.alipayId
                }).then(function (alipay) {
                    //如果充值记录存在
                    if (alipay) {
                        if (alipay.isRecharge) {
                            reject({
                                isOK: false,
                                message: '该交易号已提交充值，不能重提交！'
                            });
                        } else {
                            if(alipay.funds) {
                                alipayInfo.isRecharge = true;
                                alipayInfo.status = '成功';
                                alipayInfo.userNowFunds = (parseFloat(alipay.funds) + parseFloat(alipayInfo.userOldFunds)).toFixed(4);
                                Recharge.open().updateById(alipay._id, {
                                    $set: alipayInfo
                                }).then(function () {
                                    resolve(alipay.funds);
                                });
                            }else{
                                reject({
                                    isOK: false,
                                    message: '该交易号已提交充值，不能重提交！'
                                });
                            }
                        }
                    } else {
                        alipayInfo.isRecharge = false;
                        alipayInfo.status = '充值中';
                        Recharge.open().insert(alipayInfo).then(function () {
                            reject({
                                isOK: true,
                                path: '/user/recharge/history'
                            });
                        });
                    }
                });
            }
        })
    },
    history: function(info){
        return new Promise(function(resolve, reject) {
            Recharge.open().findPages(info.query, info.page)
                .then(function (obj) {
                    resolve(obj);
                }, function (error) {
                    reject('查询充值记录失败： ' + error);
                });
        })
    },
    yzfAutoInsert: function(info) {
        return new Promise(function (resolve, reject) {
            //查询充值记录是否存在
            Recharge.open().findOne({
                alipayId: info.orderid
            }).then(function (alipay) {
                //如果充值记录存在
                if (alipay) {
                    //如果已充值，则不处理
                    if (alipay.isRecharge) {
                        resolve();
                    } else {
                        //如果未充值，则通过用户id查询用户
                        if (alipay.userId) {
                            User.open().findById(alipay.userId).then(function(user) {
                                //如果用户存在则直接充值
                                if(user) {
                                    User.open().updateById(user._id, {$set: {
                                        funds: (parseFloat(user.funds) + parseFloat(info.money)).toFixed(4)
                                    }}).then(function() {
                                        Recharge.open().updateById(alipay._id, {$set: {
                                            isRecharge: true,
                                            status: '成功',
                                            funds: parseFloat(info.money),
                                            alipayTime: info.PayTime,
                                            userNowFunds : (parseFloat(alipay.userOldFunds) + parseFloat(info.money)).toFixed(4)
                                        }}).then(function() {
                                            resolve();
                                        })
                                    })
                                }else{
                                    //如果用户不存在，则转到人工平台查询充值
                                    var url = 'http://www.677777778.cn/auto/recharge/to/user?' +
                                        'userId=' + alipay.userId +
                                        '&funds=' + info.money;
                                    request(url, function (err, resp, body) {
                                        if(body == 'ok'){
                                            Recharge.open().updateById(alipay._id, {$set: {
                                                isRecharge: true,
                                                status: '成功',
                                                funds: parseFloat(info.money),
                                                alipayTime: info.PayTime,
                                                userNowFunds : (parseFloat(alipay.userOldFunds) + parseFloat(info.money)).toFixed(4)
                                            }}).then(function() {
                                                resolve();
                                            })
                                        }else{
                                            resolve();
                                        }
                                    });
                                }
                            })
                        } else {
                            resolve();
                        }
                    }
                } else {
                    var username = info.uid.replace(/(^\s*)|(\s*$)/g, "");
                    //如果充值记录不存在，则通过用户名查询用户
                    User.open().findOne({
                        username: username
                    }).then(function (user) {
                        //如果用户存在则直接充值
                        if(user) {
                            User.open().updateById(user._id, {$set: {
                                funds: (parseFloat(user.funds) + parseFloat(info.money)).toFixed(4)
                            }}).then(function() {
                                Recharge.open().insert({
                                    type: 'brush',
                                    username:  user.username,
                                    userId: user._id,
                                    userOldFunds: user.funds,
                                    createTime: info.PayTime,
                                    alipayId: info.orderid,
                                    alipayTime: info.PayTime,
                                    funds: parseFloat(info.money),
                                    isRecharge: true,
                                    status: '成功',
                                    userNowFunds : (parseFloat(user.funds) + parseFloat(info.money)).toFixed(4)
                                }).then(function () {
                                    resolve();
                                });
                            })
                        }else{
                            //如果用户不存在，则保存一条未充值记录
                            Recharge.open().insert({
                                alipayId: info.orderid,
                                alipayTime: info.PayTime,
                                funds: parseFloat(info.money),
                                isRecharge: false
                            }).then(function () {
                                resolve();
                            });
                        }
                    });
                }
            });
        });
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
            /*
             * 结果的格式中有’N’,’F’,’S’等状态,现在顺带做个说明。
             201304180000100089005XXX6446|N|0         不存在这个交易号
             201304180000100089005XXX6446|F|0         订单交易号存在但是代表交易不成功
             201304180000100089005XXX6446|S|10.00  订单交易号存在且交易成功，交易金额是10元
             * */
            var checkInfo = result.split('|'), aliplayId = checkInfo[0],
                status = checkInfo[1], funds = checkInfo[2], key = checkInfo[3];
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
                    Recharge.open().findOne({alipayId: aliplayId, isRecharge: true})
                        .then(function (recordAlre) {
                            if(recordAlre) {
                                Recharge.open().update({alipayId: aliplayId, isRecharge: false}, {
                                    $set: {
                                        isRecharge: true,
                                        dec: '已经充值过了还来，滚犊子...!',
                                        status: '失败'
                                    }
                                }).then(function () {
                                    resolve('已经充值过了还来，滚犊子...');
                                });
                            }else {
                                Recharge.open().findOne({alipayId: aliplayId, isRecharge: false})
                                    .then(function (record) {
                                        User.open().findById(record.userId)
                                            .then(function (user) {
                                                var fundsNow = (parseFloat(user.funds) + parseFloat(funds)).toFixed(4);
                                                User.open().updateById(user._id, {
                                                    $set: {
                                                        funds: fundsNow
                                                    }
                                                }).then(function () {
                                                    Recharge.open().updateById(record._id, {
                                                        $set: {
                                                            funds: funds,
                                                            isRecharge: true,
                                                            dec: '充值成功!',
                                                            status: '成功',
                                                            userNowFunds: fundsNow
                                                        }
                                                    }).then(function () {
                                                        resolve();
                                                    });
                                                });
                                            });
                                    });
                            }
                        });
                    break;
            }
        })
    },
    findRechargeByUserId: function(userId, page) {
        return new Promise(function(resolve, reject) {
            Recharge.open().findPages({userId: db.toObjectID(userId)}, page)
                .then(function(obj) {
                    resolve(obj);
                }, function(error) {
                    reject(error);
                })
        })
    }
});


Recharge.include({

});


module.exports = Recharge;