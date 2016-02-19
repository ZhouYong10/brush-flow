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


exports.initUser = function(User) {
    initUsers.map(function(user) {
        User.findAndModify({
            username: user.username,
            role: user.role
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
};
