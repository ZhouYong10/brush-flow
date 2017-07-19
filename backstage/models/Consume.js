/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Consume = new Class();


Consume.extend(db);

Consume.extend({
    open: function() {
        return Consume.openCollection('Consume');
    },
    getConsumeTotal: function(obj) {
        return new Promise(function(resolve, reject) {
            Consume.open().find(obj).then(function(results) {
                var count = 0;
                results.forEach(function (result) {
                    count += parseFloat(result.Consume);
                });
                resolve(count.toFixed(4));
            })
        })
    }
});

Consume.include({

});


module.exports = Consume;