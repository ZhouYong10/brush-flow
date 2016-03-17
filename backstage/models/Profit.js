/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Profit = new Class();


Profit.extend(db);

Profit.open = function() {
    return Profit.openCollection('Profit');
};

Profit.include({

});


module.exports = Profit;