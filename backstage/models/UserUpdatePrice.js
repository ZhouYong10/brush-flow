/**
 * Created by zhouyong10 on 2/3/16.
 */
var dbWrap = require('../dbWrap');
var Class = require('./Class');


var UserUpdatePrice = new Class();

UserUpdatePrice.extend(dbWrap);

UserUpdatePrice.extend({
    open: function() {
        return UserUpdatePrice.openCollection('UserUpdatePrice');
    }
});

UserUpdatePrice.include({
    types:{
        upToSuper: 'upToSuper',
        upToTop: 'upToTop'
    }
});


module.exports = UserUpdatePrice;