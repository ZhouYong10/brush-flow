/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');

var Class = require('./Class');

var User = require('./User');
var moment = require('moment');
//var bcrypt = require('bcryptjs');


var Withdraw = new Class();


Withdraw.extend(db);

Withdraw.open = function() {
    return Withdraw.openCollection('Withdraw');
};

Withdraw.extend({
    saveOne: function(withdraw, userId) {
        return new Promise(function(resolve, reject) {
            User.open().findById(userId)
                .then(function(user) {
                    withdraw.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    withdraw.status = '未处理';
                    withdraw.user = user.username;
                    withdraw.userId = user._id;
                        Withdraw.open().insert(withdraw)
                            .then(function(results) {
                                var result = results[0];
                                var userFunds = parseFloat(user.funds) - parseFloat(result.funds);
                                User.open().updateById(user._id, {$set: {funds: userFunds}})
                                    .then(function() {
                                        resolve();
                                    })
                            })
                })
        });
    },
    complete: function(id) {
       return new Promise(function(resolve, reject) {
           Withdraw.open().updateById(id, {$set: {
               status: '成功',
               endTime: moment().format('YYYY-MM-DD HH:mm:ss')
           }}).then(function() {
               resolve();
           })
       })
    },
    refused: function(id, info, funds, userId) {
        return new Promise(function(resolve, reject) {
            Withdraw.open().updateById(id, {$set: {
                status: '失败',
                endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                refuseInfo: info
            }}).then(function() {
                User.open().findById(userId)
                    .then(function (user) {
                        var userFunds = (parseFloat(user.funds) + parseFloat(funds)).toFixed(4);
                        User.open().updateById(user._id, {$set: {funds: userFunds}})
                            .then(function () {
                                resolve();
                            });
                    });
            })
        })
    }
});

Withdraw.include({

});


module.exports = Withdraw;