/**
 * Created by zhouyong10 on 2/3/16.
 */
var dbWrap = require('../dbWrap');
var Class = require('./Class');

var moment = require('moment');


var Feedback = new Class();


Feedback.extend(dbWrap);

Feedback.extend({
    open: function() {
        return Feedback.openCollection('Feedback');
    },
    createFeedback: function(feedback) {
        feedback.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        feedback.status = '未处理';

        return Feedback.open().insert(feedback);
    }
});

User.include({

});


module.exports = Feedback;