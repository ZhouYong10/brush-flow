/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Withdraw = new Class();


Withdraw.extend(db);

Withdraw.open = function() {
    return Withdraw.openCollection('Withdraw');
};

Withdraw.include({

});


module.exports = Withdraw;