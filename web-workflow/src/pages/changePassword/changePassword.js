/**
 * Created by zhouyong10 on 2/18/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

new Vue({
    el: '#changePassword',
    data: {
        newpwd: ''
    },
    validators: {
        same: function(pwd) {
            return pwd === this.newpwd;
        }
    }
});