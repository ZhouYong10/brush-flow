/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var User = require('./User');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Order = new Class();


Order.extend(db);

Order.open = function() {
    return Order.openCollection('Order');
};

Order.include({
    countParentProfit: function (user, product) {
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
                    self.countParentProfit(parent, product);
                })
        }
    }

});


module.exports = Order;