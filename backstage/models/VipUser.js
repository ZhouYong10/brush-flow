/**
 * Created by zhouyong10 on 2/3/16.
 */
var dbWrap = require('../dbWrap');
var Class = require('./Class');


var User = new Class();

User.extend(dbWrap);

User.extend({
    open: function() {
        return User.openCollection('VipUser');
    },
    isVip: function(user) {
        var vipTime = Date.parse(user.vipTime);
        var nowTime = new Date().getTime();
        return vipTime > nowTime;
    }
});


module.exports = User;