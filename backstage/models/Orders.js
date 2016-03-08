/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Orders = new Class();


Orders.extend(db);

Orders.open = function() {
    return Orders.openCollection('Orders');
};

Orders.include({

});


module.exports = Orders;