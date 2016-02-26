/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');



var Recharge = new Class();


Recharge.extend(db);

Recharge.open = function() {
    return Recharge.openCollection('Recharge');
};

Recharge.include({

});


module.exports = Recharge;