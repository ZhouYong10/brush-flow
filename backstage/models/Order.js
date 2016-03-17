/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var User = require('./User');
var Product = require('./Product');
var Profit = require('./Profit');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
var moment = require('moment');


var Order = new Class();


Order.extend(db);

Order.open = function() {
    return Order.openCollection('Order');
};

Order.include({
    createAndSave: function(user, info) {
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info)
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    self.totalPrice = (myPrice * self.num).toFixed(4);
                    if((self.totalPrice - user.funds) > 0) {
                        return reject();
                    }
                    self.price = myPrice;
                    self.user = user.username;
                    self.userId = user._id;
                    self.type = product.type;
                    self.typeName = product.typeName;
                    self.smallType = product.smallType;
                    self.smallTypeName = product.smallTypeName;
                    self.status = '未处理';
                    self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    self.funds = (user.funds - self.totalPrice).toFixed(4);
                    self.description = self.typeName + self.smallTypeName + '执行' + self.num;
                    self.countParentProfit(user, product, function(obj) {
                        Order.open().insert(obj)
                            .then(function () {
                                User.open().updateById(user._id, {$set: {funds: obj.funds}})
                                    .then(function () {
                                        resolve();
                                    });
                            });
                    });
                });
        });
    },
    createAndSaveTwo: function(user, info1, info2){
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info1)
                .then(function(result1) {
                    var product1 = Product.wrapToInstance(result1);
                    Product.open().findOne(info2)
                        .then(function (result2) {
                            var product2 = Product.wrapToInstance(result2);
                            var myPrice1 = product1.getPriceByRole(user.role);
                            var myPrice2 = product2.getPriceByRole(user.role);
                            self.totalPrice = (myPrice1 * self.num + myPrice2 * self.num2).toFixed(4);
                            if ((self.totalPrice - user.funds) > 0) {
                                return reject();
                            }
                            self.price = myPrice1;
                            self.price2 = myPrice2;
                            self.user = user.username;
                            self.userId = user._id;
                            self.type = product1.type;
                            self.typeName = product1.typeName;
                            self.smallType = product1.smallType;
                            self.smallTypeName = product1.smallTypeName;
                            self.status = '未处理';
                            self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            self.funds = (user.funds - self.totalPrice).toFixed(4);
                            self.description = self.typeName + self.smallTypeName + '执行' + self.num + '; ' +
                                               product2.typeName + product2.smallTypeName + '执行' + self.num2;

                            self.countParentProfitTow(user, product1, product2, function(obj) {
                                Order.open().insert(obj)
                                    .then(function () {
                                        User.open().updateById(user._id, {$set: {funds: obj.funds}})
                                            .then(function () {
                                                resolve();
                                            });
                                    });
                            });
                        });
                });
        });
    },
    countParentProfit: function (user, product, callback) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    var selfPrice = product.getPriceByRole(user.role);
                    var parentPrice = product.getPriceByRole(parent.role);
                    var profit = selfPrice - parentPrice;
                    self[name] = (profit * self.num).toFixed(4);
                    self.countParentProfit(parent, product, callback);
                })
        }else {
            callback(self);
        }
    },
    countParentProfitTow: function (user, product1, product2, callback) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    var selfPrice1 = product1.getPriceByRole(user.role);
                    var selfPrice2 = product2.getPriceByRole(user.role);
                    var parentPrice1 = product1.getPriceByRole(parent.role);
                    var parentPrice2 = product2.getPriceByRole(parent.role);

                    var profit1 = selfPrice1 - parentPrice1;
                    var profit2 = selfPrice2 - parentPrice2;
                    self[name] = (profit1 * self.num + profit2 * self.num2).toFixed(4);
                    self.countParentProfitTow(parent, product1, product2, callback);
                })
        }else {
            callback(self);
        }
    },
    complete: function(callback) {
        var self = this;
        User.open().findById(self.userId)
            .then(function(user) {
                self.profitToParent(user, user, function(order) {
                    Order.open().updateById(self._id, {$set: {status: '已处理'}})
                        .then(function () {
                            callback();
                        });
                });
            })
    },
    profitToParent: function(orderUser, child, callback) {
        var self = this;
        var name = '';
        if(child.parentID) {
            User.open().findById(child.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    parent.funds = (parseFloat(self[name]) + parseFloat(parent.funds)).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: parent.funds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderUserId: orderUser._id,
                                orderUsername: orderUser.username,
                                typeName: self.typeName,
                                smallTypeName: self.smallTypeName,
                                profit: self[name],
                                orderId: self._id,
                                createTime: self.createTime
                            }).then(function (profit) {
                                console.log(profit, '============================');
                                self.profitToParent(orderUser, parent, callback);
                            })
                        });
                })
        }else {
            callback(self);
        }
    }
});


module.exports = Order;