/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Profit = new Class();


Profit.extend(db);

Profit.extend({
    open: function() {
        return Profit.openCollection('Profit');
    },
    getProfitByUserId: function(id) {
        return new Promise(function(resolve, reject) {
            Profit.open().find({userId: id}).then(function(results) {
                var count = 0;
                results.forEach(function (result) {
                    count += parseFloat(result.profit);
                });
                resolve(count.toFixed(4));
            })
        })
    }
});

Profit.include({

});


module.exports = Profit;