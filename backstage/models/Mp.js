/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Mp = new Class();


Mp.extend(db);

Mp.open = function() {
    return Mp.openCollection('Mp');
};

Mp.include({

});


module.exports = Mp;