/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var User = require('./User');
var Product = require('./Product');

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
                    self.totalPrice = myPrice * self.num;
                    if(self.totalPrice > user.funds) {
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
                    self.countParentProfit(user, product, function(obj) {
                        Order.open().insert(obj)
                            .then(function () {
                                resolve();
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
                    self[name] = profit * self.num;
                    self.countParentProfit(parent, product, callback);
                })
        }else {
            callback(self);
        }
    }

});


module.exports = Order;