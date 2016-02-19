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
    },
    removeUser: function(req, res, path) {
        if(req.query.parentID) {
            User.open().findById(req.query.parentID)
                .then(function (result) {
                    var parent = User.wrapToInstance(result);
                    parent.removeChild(req.query.id);
                    User.open().updateById(parent._id, {$set: parent})
                        .then(function () {
                            remove(req.query.id);
                        }, function(error) {
                            throw new Error('更新父用户信息失败： ' + error);
                        })
                }, function(error) {
                    res.send(error);
                });
        }else{
            remove(req.query.id);
        }

        function remove(id) {
            User.open().removeById(req.query.id)
                .then(function (user) {
                    res.redirect(path);
                }, function (error) {
                    throw new Error('删除用户失败： ' + error);
                });
        }
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
        this.childNum = this.children.length;
    },
    removeChild: function(id) {
        var index;
        for(var i = 0; i < this.children.length; i++) {
            if(this.children[i] === id) {
                index = i;
            }
        }
        this.children.splice(index, 1);
        this.childNum = this.children.length;
    }
});


module.exports = User;