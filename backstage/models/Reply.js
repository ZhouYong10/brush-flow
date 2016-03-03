/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Reply = new Class();


Reply.extend(db);

Reply.open = function() {
    return Reply.openCollection('Reply');
};

Reply.include({

});


module.exports = Reply;