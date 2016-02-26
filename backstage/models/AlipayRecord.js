/**
 * Created by ubuntu64 on 2/26/16.
 */
var db = require('../dbWrap');
var Class = require('./Class');



var AlipayRecord = new Class();


AlipayRecord.extend(db);

AlipayRecord.open = function() {
    return AlipayRecord.openCollection('AlipayRecord');
};

AlipayRecord.include({

});


module.exports = AlipayRecord;