/**
 * Created by ubuntu64 on 2/26/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');

var User = require('./VipUser');
var moment = require('moment');


var Recharge = new Class();


Recharge.extend(db);

Recharge.extend({
    open: function() {
        return Recharge.openCollection('VipRecharge');
    },
    vipDays: function(funds) {
        var vipDays = 0;
        var money = parseInt(funds);
        if(money >= 3) {
            var years = Math.floor(money / 368);
            var yu = money % 368;
            var threeMonth = Math.floor(yu / 126);
            yu %= 126;
            var month = Math.floor(yu / 56);
            yu %= 56;
            var week = Math.floor(yu / 18);
            yu %= 18;
            var day = Math.floor(yu / 3);
            vipDays = years * 365 + threeMonth * 90 + month * 30 + week * 7 + day;
        }
        return vipDays;
    },
    yzfAutoInsert: function(info) {
        return new Promise(function (resolve) {
            var vipDays = Recharge.vipDays(info.money);
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
                                    var vipTime;
                                    if(User.isVip(user)){
                                        vipTime = moment(user.vipTime).add('days', vipDays).format('YYYY-MM-DD HH:mm:ss');
                                    }else{
                                        vipTime = moment().add('days', vipDays).format('YYYY-MM-DD HH:mm:ss')
                                    }
                                    var profitToParent = (parseFloat(info.money) * 0.2).toFixed(4);
                                    if(user.parentId) {
                                        User.open().findById(user.parentId).then(function(parent) {
                                            User.open().updateById(parent._id, {
                                                $set: {
                                                    childrenProfit: (parseFloat(parent.childrenProfit) + parseFloat(profitToParent)).toFixed(4),
                                                    canWithdraw: (parseFloat(parent.canWithdraw) + parseFloat(profitToParent)).toFixed(4)
                                                }
                                            });
                                        })
                                    }
                                    User.open().updateById(user._id, {$set: {
                                        funds: (parseFloat(user.funds) + parseFloat(info.money)).toFixed(4),
                                        profitToParent: (parseFloat(user.profitToParent) + parseFloat(profitToParent)).toFixed(4),
                                        vipTime: vipTime
                                    }}).then(function() {
                                        Recharge.open().updateById(alipay._id, {$set: {
                                            isRecharge: true,
                                            vipDays: vipDays,
                                            status: '成功',
                                            funds: parseFloat(info.money),
                                            alipayTime: info.PayTime,
                                            profitToParent: profitToParent,
                                            userNowFunds : (parseFloat(alipay.userOldFunds) + parseFloat(info.money)).toFixed(4)
                                        }}).then(function() {
                                            resolve();
                                        })
                                    })
                                }else{
                                    //如果用户不存在，则不处理
                                    resolve();
                                }
                            })
                        } else {
                            resolve();
                        }
                    }
                } else {
                    var username = info.uid ? info.uid.replace(/(^\s*)|(\s*$)/g, "") : null;
                    //如果充值记录不存在，则通过用户名查询用户
                    User.open().findOne({
                        username: username
                    }).then(function (user) {
                        //如果用户存在则直接充值
                        if(user) {
                            var vipTime;
                            if(User.isVip(user)){
                                vipTime = moment(user.vipTime).add('days', vipDays).format('YYYY-MM-DD HH:mm:ss');
                            }else{
                                vipTime = moment().add('days', vipDays).format('YYYY-MM-DD HH:mm:ss')
                            }
                            var profitToParent = (parseFloat(info.money) * 0.2).toFixed(4);
                            if(user.parentId) {
                                User.open().findById(user.parentId).then(function(parent) {
                                    User.open().updateById(parent._id, {
                                        $set: {
                                            childrenProfit: (parseFloat(parent.childrenProfit) + parseFloat(profitToParent)).toFixed(4),
                                            canWithdraw: (parseFloat(parent.canWithdraw) + parseFloat(profitToParent)).toFixed(4)
                                        }
                                    });
                                })
                            }
                            User.open().updateById(user._id, {$set: {
                                funds: (parseFloat(user.funds) + parseFloat(info.money)).toFixed(4),
                                profitToParent: (parseFloat(user.profitToParent) + parseFloat(profitToParent)).toFixed(4),
                                vipTime: vipTime
                            }}).then(function() {
                                Recharge.open().insert({
                                    username:  user.username,
                                    userId: user._id,
                                    userOldFunds: user.funds,
                                    createTime: info.PayTime,
                                    alipayId: info.orderid,
                                    alipayTime: info.PayTime,
                                    funds: parseFloat(info.money),
                                    vipDays: vipDays,
                                    isRecharge: true,
                                    status: '成功',
                                    profitToParent: profitToParent,
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
                                vipDays: vipDays,
                                isRecharge: false
                            }).then(function (obj) {
                                resolve();
                            });
                        }
                    });
                }
            });
        });
    }
});



module.exports = Recharge;