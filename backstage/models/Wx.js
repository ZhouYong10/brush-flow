/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Wx = new Class();


Wx.extend(db);

Wx.open = function() {
    return Wx.openCollection('Wx');
};

Wx.include({

});


module.exports = Wx;