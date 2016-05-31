/**
 * Created by ubuntu64 on 5/31/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');
var Order = require('./Order');
var User = require('./User');
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
                            delete order._id;
                            order.taskUserId = user._id;
                            order.taskUser = user.username;
                            order.taskUserRole = user.role;
                            order.taskPhoto = info.taskPhoto;
                            order.taskCreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
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

    getPriceByRole: function(role) {
        var price ;
        switch (role) {
            case '管理员':
                price = this.adminPrice;
                break;
            case '顶级代理':
                price = this.topPrice;
                break;
            case '超级代理':
                price = this.superPrice;
                break;
            case '金牌代理':
                price = this.goldPrice;
                break;
        }
        return price;
    },
    getPerByRole: function(role) {
        var per ;
        switch (role) {
            case '管理员':
                per = this.adminPer;
                break;
            case '顶级代理':
                per = this.topPer;
                break;
            case '超级代理':
                per = this.superPer;
                break;
            case '金牌代理':
                per = this.goldPer;
                break;
        }
        return per;
    }
});


module.exports = Task;