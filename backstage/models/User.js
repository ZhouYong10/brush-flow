/**
 * Created by zhouyong10 on 2/3/16.
 */
var dbWrap = require('../dbWrap');
var Class = require('./Class');
var bcrypt = require('bcryptjs');
//var moment = require('moment');


var User = new Class();

User.colName = 'User';

User.extend(dbWrap);

User.open = function() {
    return User.openCollection('User');
};

User.include({
    isAdmin: function() {
        if(this.role === '管理员'){
            return true;
        }
        return false;
    },
    samePwd: function(pwd) {
        return bcrypt.compareSync(pwd, this.password);
    }
});


module.exports = User;