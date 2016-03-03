/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
//var moment = require('moment');


var Flow = new Class();


Flow.extend(db);

Flow.open = function() {
    return Flow.openCollection('Flow');
};

Flow.include({

});


module.exports = Flow;