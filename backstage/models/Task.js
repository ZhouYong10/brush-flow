/**
 * Created by ubuntu64 on 5/31/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');
var Order = require('./Order');
var User = require('./User');
var Profit = require('./Profit');
var moment = require('moment');


var Task = new Class();


Task.extend(db);
Task.extend({
    createTask: function(info) {
        return new Promise(function(resolve, reject) {
            User.open().findById(info.userId)
                .then(function (user) {
                    Order.open().findOne({
                        _id: db.toObjectID(info.orderId),
                        status: '已发布'
                    }).then(function(order) {
                        if(order) {
                            order.orderId = order._id + '';
                            delete order._id;
                            order.taskAccount = user.taskAccount;
                            order.taskName = user.taskName;
                            order.taskUserId = user._id;
                            order.taskUser = user.username;
                            order.taskUserRole = user.role;
                            order.taskPhoto = info.taskPhoto;
                            order.taskCreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            order.taskStatus = '待审核';
                            Task.open().insert(order).then(function(tasks) {
                                var updateInfo ;
                                if((order.num - (order.taskNum ? order.taskNum : 0)) > 1) {
                                    updateInfo = {
                                        $inc: {taskNum: 1},
                                        $push: {taskUsers: user._id}
                                    };
                                }else {
                                    updateInfo = {
                                        $set: {status: '已完成'},
                                        $inc: {taskNum: 1},
                                        $push: {taskUsers: user._id}
                                    };
                                }
                                Order.open().updateById(info.orderId, updateInfo)
                                    .then(function(result) {
                                    resolve(tasks[0]);
                                })
                            })
                        }else {
                            reject('不好意思，任务已经结束了，下次动作要快点哦！');
                        }
                    })
                });
        })
    }
});

Task.open = function() {
    return Task.openCollection('Task');
};

Task.include({
    success: function() {
            var self = this;
        return new Promise(function(resolve, reject) {
            User.open().findById(self.taskUserId).then(function(user) {
                console.log(parseFloat(self.getPriceByRole(user.role)),'111111111111111111111111111111111111111111111');
                User.open().updateById(self.taskUserId, {
                    $set: {
                        funds: (parseFloat(self.getPriceByRole(user.role)) + parseFloat(user.funds)).toFixed(4)
                    }
                }).then(function() {
                    console.log('2222222222222222222222222222222222222222222222222222');
                    self.profitToTaskUser(user, function() {
                        console.log('3333333333333333333333333333333333333333333333333');
                        User.open().findById(self.userId).then(function(orderUser) {
                            self.profitToOrderUser(orderUser, function() {
                                console.log('4444444444444444444444444444444444444444444444444444444');
                                Task.open().updateById(self._id, {$set: {
                                    taskStatus: '完成',
                                    successTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }}).then(function() {
                                    console.log('55555555555555555555555555555555555555555555555555555555555');
                                    Order.open().findById(self.orderId).then(function(order) {
                                        var surplus = (parseFloat(order.surplus) - parseFloat(self.releasePrice)).toFixed(4);
                                        Order.open().updateById(order._id, {$set: {
                                            surplus: surplus
                                        }}).then(function() {
                                            resolve();
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    profitToTaskUser: function(user, cb) {
        var self = this;
        console.log(user.role, 'user.role ======================================');
        console.log(user.parentID, 'user.parentID ======================================');
        if(user.parentID) {
            User.open().findById(user.parentID).then(function(parent) {
                    var userPrice = self.getPriceByRole(user.role);
                    var parentPrice = self.getPriceByRole(parent.role);
                    var profit = (parseFloat(parentPrice) - parseFloat(userPrice)).toFixed(2);
                    var funds = (parseFloat(profit) + parseFloat(parent.funds)).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: funds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderUserId: self.taskUserId,
                                orderUsername: self.taskUser,
                                typeName: self.typeName,
                                smallTypeName: self.smallTypeName,
                                profit: profit,
                                orderId: self._id + '',
                                status: 'success',
                                createTime: self.createTime
                            }).then(function (profit) {
                                self.profitToTaskUser(parent, cb);
                            })
                        });
                })
        }else {
            cb();
        }
    },
    profitToOrderUser: function(user, cb) {
        var self = this;
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    var profit = self.getProfitByRole(parent.role);
                    var funds = (parseFloat(profit) + parseFloat(parent.funds)).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: funds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderUserId: self.taskUserId,
                                orderUsername: self.taskUser,
                                typeName: self.typeName,
                                smallTypeName: self.smallTypeName,
                                profit: profit,
                                orderId: self._id + '',
                                status: 'success',
                                createTime: self.createTime
                            }).then(function (profit) {
                                self.profitToOrderUser(parent, cb);
                            })
                        });
                })
        }else {
            cb();
        }
    },
    getProfitByRole: function(role) {
        var profit ;
        switch (role) {
            case '管理员':
                profit = this.adminProfit;
                break;
            case '顶级代理':
                profit = this.topProfit;
                break;
            case '超级代理':
                profit = this.superProfit;
                break;
            case '金牌代理':
                profit = this.goldProfit;
                break;
        }
        return profit;
    },
    getPriceByRole: function(role) {
        var price ;
        switch (role) {
            case '管理员':
                price = this.adminPerPrice;
                break;
            case '顶级代理':
                price = this.topPerPrice;
                break;
            case '超级代理':
                price = this.superPerPrice;
                break;
            case '金牌代理':
                price = this.goldPerPrice;
                break;
        }
        return price;
    }
});


module.exports = Task;