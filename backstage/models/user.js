/**
 * Created by zhouyong10 on 2/3/16.
 */
var userDB = require('../db').getCollection('User');
var bcrypt = require('bcryptjs');
var moment = require('moment');


function User() {

}

User.findOne = function(obj) {
    
};