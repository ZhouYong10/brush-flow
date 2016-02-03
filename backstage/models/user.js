/**
 * Created by zhouyong10 on 2/3/16.
 */

var db = require('../db');
var userDB = db.getCollection('User');
var bcrypt = require('bcryptjs');
var moment = require('moment');


function User() {

}

function findOne(obj) {
    return new Promise(function(resolve, reject) {
        userDB.findOne(obj, function(error, result) {
            if(error) {
                reject('获取用户信息失败： ' + error);
            }
            resolve(result);
        })
    })
}

User.findById = function(id) {
    return findOne({
        _id: db.toObjectID(id)
    });
};

User.findOne = function(obj) {
    return findOne(obj);
};

User.find = function(obj) {
    var userObj = obj ? obj : null;
    return new Promise(function(resolve, reject) {
        userDB.find(userObj)
            .toArray(function(error, result) {
                if(error) {
                    reject('获取用户列表失败： ' + error);
                }
                resolve(result);
            })
    })
};

User.insert = function(obj) {
    return new Promise(function(resolve, reject) {
        userDB.insert(obj, function(error, result) {
            if(error) {
                reject('保存用户信息失败： ' + error);
            }
            resolve(result);
        })
    })
};



module.exports = User;