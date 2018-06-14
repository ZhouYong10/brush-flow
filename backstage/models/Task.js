/**
 * Created by ubuntu64 on 5/31/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');
var Order = require('./Order');
var User = require('./User');
var Profit = require('./Profit');
var Consume = require('./Consume');
var moment = require('moment');


var Task = new Class();

Task.extend(db);
Task.extend({
    getRandomStr: function(req) {
        return new Promise(function(resolve, reject) {
            var str = Math.random().toString(36).substr(2);
            req.session.orderFlag = str;
            resolve(str);
        })
    },
    checkRandomStr: function(req, info) {
        return new Promise(function(resolve, reject) {
            if(info.orderFlag == req.session.orderFlag) {
                req.session.orderFlag = '';
                resolve();
            }else {
                console.log('订单已经提交了，请勿重复提交！');
                reject();
            }
        })
    },
    getTaskFreezeFunds: function() {
        return new Promise(function(resolve, reject) {
            Task.open().find({
                taskStatus: {$in: ['待审核', '被投诉']}
            }).then(function(tasks) {
                var count = 0;
                tasks.forEach(function (task) {
                    count += parseFloat(task.releasePrice);
                });
                resolve(count.toFixed(4));
            })
        })
    },
    createTask: function(info) {
        return new Promise(function(resolve, reject) {
            User.open().findById(info.userId)
                .then(function (user) {
                    Order.open().findOne({
                        _id: db.toObjectID(info.orderId),
                        status: '已发布'
                    }).then(function(order) {
                        if(order) {
                            var flag = true;
                            for(var i = 0; i < order.taskUsers.length; i++) {
                                var taskUser = order.taskUsers[i];
                                if ((taskUser + '') == (user._id + '')) {
                                    flag = false;
                                    reject('您已经做过该任务了，不要以为我不知道哦！！！');
                                }
                            }
                            if(flag) {
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
                            }
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
            Task.open().updateById(self._id, {$set: {
                taskStatus: '完成',
                successTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }}).then(function() {
                Order.open().findById(self.orderId).then(function(order) {
                    var surplus = (parseFloat(order.surplus) - parseFloat(self.releasePrice)).toFixed(4);
                    Order.open().updateById(order._id, {$set: {
                        surplus: surplus
                    }}).then(function() {
                        User.open().findById(self.taskUserId).then(function(user) {
                            if(user) {
                                var orderTaskPrice = self.getPriceByRole(user.role);
                                var userNowFunds = (parseFloat(orderTaskPrice) + parseFloat(user.funds)).toFixed(4)
                                User.open().updateById(self.taskUserId, {
                                    $set: {
                                        funds: userNowFunds
                                    }
                                }).then(function() {
                                    self.profitToTaskUser(user, function() {
                                        console.log('self.userId:   ', self.userId);
                                        User.open().findById(self.userId).then(function(orderUser) {
                                            self.profitToOrderUser(orderUser, function() {
                                                Consume.open().insert({
                                                    userId: user._id,
                                                    username: user.username,
                                                    orderId: self.orderId,
                                                    type: self.type,
                                                    typeName: self.typeName,
                                                    smallType: self.smallType,
                                                    smallTypeName: self.smallTypeName,
                                                    funds: + orderTaskPrice,
                                                    userOldFunds: user.funds,
                                                    userNowFunds: userNowFunds,
                                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                    description: "做" + self.typeName + "/" + self.smallTypeName + ",赚取" + orderTaskPrice
                                                });
                                                resolve();
                                            })
                                        })
                                    })
                                })
                            }else{
                                Task.open().removeById(self._id).then(function() {
                                    console.log('订单用户已不存在。。。。,已删除该订单。。。');
                                    Order.open().updateById(self.orderId, {
                                        $set: {status: '已发布'},
                                        $inc: {taskNum: -1}
                                    }).then(function() {
                                        console.log('任务已做数量减1.。。。。。。。。。。。');
                                        resolve();
                                    })
                                })
                            }
                        })
                    })
                })
            })
        })
    },
    profitToTaskUser: function(user, cb) {
        var self = this;
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
                                orderId: self._id,
                                orderUserId: self.taskUserId,
                                orderUsername: self.taskUser,
                                type: self.type,
                                typeName: self.typeName,
                                smallType: self.smallType,
                                smallTypeName: self.smallTypeName,
                                funds: profit,
                                userOldFunds: parent.funds,
                                userNowFunds: funds,
                                profit: profit,
                                status: 'success',
                                createTime: self.createTime,
                                description: '任务方：' + self.taskUser + "做" + self.typeName + '/' + self.smallTypeName + '返利' + profit
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
                                orderId: self._id,
                                orderUserId: self.taskUserId,
                                orderUsername: self.taskUser,
                                type: self.type,
                                typeName: self.typeName,
                                smallType: self.smallType,
                                smallTypeName: self.smallTypeName,
                                funds: profit,
                                userOldFunds: parent.funds,
                                userNowFunds: funds,
                                profit: profit,
                                status: 'success',
                                createTime: self.createTime,
                                description: '发布方：' +　self.typeName + '/' + self.smallTypeName + '完成一次，返利' + profit
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

(function() {
   setInterval(function() {
       console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': 扫描了一次人工任务审核。');
       Task.open().find({
           taskStatus: '待审核'
       }).then(function(tasks) {
           followedByPayment(tasks);
       })
   }, 1000 * 60 * 10);
})();

function followedByPayment(tasks) {
   if(tasks.length > 0) {
       var task = tasks.shift();
       var taskCreateTime = task._id.getTimestamp();
       var timeNow = new Date().getTime();
       if((timeNow - taskCreateTime) > 1000 * 60 * 60 * 2) {
           var taskIns = Task.wrapToInstance(task);
           taskIns.success().then(function () {
               console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': 自动审核通过了任务' + task._id);
               followedByPayment(tasks);
           });
       }else{
           console.log('没有过期的审核任务，继续循环下一个任务。---------------------------------');
           followedByPayment(tasks);
       }
   }
}

module.exports = Task;