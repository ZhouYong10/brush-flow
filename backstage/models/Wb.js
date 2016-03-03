/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Wb = new Class();


Wb.extend(db);

Wb.open = function() {
    return Wb.openCollection('Wb');
};

Wb.include({

});


module.exports = Wb;