/**
 * Created by zhouyong10 on 2/2/16.
 */

var bcrypt = require('bcryptjs');
var moment = require('moment');

var initUsers = [{
    username: 'admin',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
    funds: 0,
    role: '管理员',
    status: '正常',
    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
}, {
    username: 'yanshi',
    password: bcrypt.hashSync('yanshi', bcrypt.genSaltSync(10)),
    funds: 0,
    role: '顶级代理',
    status: '正常',
    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
}];

var userUpdatePrices = [{
    type: 'upToSuper',
    name: '升级到超级',
    price: 500,
    toParent: 300
}, {
    type: 'upToTop',
    name: '升级到顶级',
    price: 800,
    toParent: 500
}];


exports.initUser = function(User) {
    initUsers.map(function(user) {
        User.findOne({username: user.username, role: user.role}, function(error, result) {
            if(error) {
                return console.log('初始化查询用户信息失败： ' + error);
            }
            if(result) {
                user = result;
                delete user._id;
            }
            User.findAndModify({
                username: user.username
            }, [], {$set: user}, {
                new: true,
                upsert: true
            }, function(error, result) {
                if(error) {
                    console.log('添加初始化账户失败： ' + error);
                }else{
                    console.log('添加初始化账户成功!');
                }
            })
        })
    })
};

exports.initUserUpdatePrice = function(UserUpdatePrice) {
    userUpdatePrices.map(function(userUpdatePrice) {
        UserUpdatePrice.findOne({type: userUpdatePrice.type}, function(error, result) {
            if(error) {
                return console.log('初始化查询用户信息失败： ' + error);
            }
            if(result) {
                userUpdatePrice = result;
                delete userUpdatePrice._id;
            }
            UserUpdatePrice.findAndModify({
                type: userUpdatePrice.type
            }, [], {$set: userUpdatePrice}, {
                new: true,
                upsert: true
            }, function(error, result) {
                if(error) {
                    console.log('添加初始化账户失败： ' + error);
                }else{
                    console.log('添加初始化账户升级价格成功!');
                }
            })
        })
    })
};
