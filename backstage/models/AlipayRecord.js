/**
 * Created by ubuntu64 on 2/26/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');

var moment = require('moment');


var AlipayRecord = new Class();


AlipayRecord.extend(db);


AlipayRecord.extend({
    open: function() {
        return AlipayRecord.openCollection('AlipayRecord');
    },
    record: function(record) {
        return new Promise(function(resolve, reject) {
            record.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
            record.isRecharge = false;
            AlipayRecord.open().insert(record)
                .then(function(result) {
                    resolve(result);
                })
        })
    }
});


AlipayRecord.include({

});


module.exports = AlipayRecord;