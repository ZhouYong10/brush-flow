/**
 * Created by zhouyong10 on 2/3/16.
 */
var dbWrap = require('../dbWrap');
var Class = require('./Class');
var bcrypt = require('bcryptjs');
var moment = require('moment');


var User = new Class();

User.roles = ['管理员','顶级代理','超级代理','金牌代理'];

User.extend(dbWrap);

User.extend({
    open: function() {
        return User.openCollection('User');
    },
    createUser: function(user, resolve, reject) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        user.funds = 0;
        user.status = '正常';
        user.createTime = moment().format('YYYY-MM-DD HH:mm:ss');

        User.open().insert(user).then(function(result) {
            resolve(result);
        }, function(error) {
            reject(error);
        })
    }
});

User.include({
    isAdmin: function() {
        if(this.role === '管理员'){
            return true;
        }
        return false;
    },
    samePwd: function(pwd) {
        return bcrypt.compareSync(pwd, this.password);
    },
    childRole: function() {
        var roles = this.parent.roles;
        for(var i = 0; i < roles.length; i++) {
            if(roles[i] === this.role) {
                if(i + 1 < roles.length) {
                    return roles[i + 1];
                }
                return roles[i];
            }
        }
    },
    addChild: function(id) {
        if(this.children == undefined) {
            this.children = [];
        }
        this.children.unshift(id);
    }
});


module.exports = User;