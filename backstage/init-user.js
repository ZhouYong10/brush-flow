/**
 * Created by zhouyong10 on 2/2/16.
 */

var initUsers = [{
    username: 'admin',
    password: hash('admin'),
    role: '管理员'
}, {
    username: '演示',
    password: hash('yanshi'),
    role: '顶级代理'
}];


function hash(password) {
    var bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

exports.initUser = function(User) {
    initUsers.map(function(user) {
        User.findAndModify({
            username: user.username,
            role: user.role
        }, [], user, {
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
