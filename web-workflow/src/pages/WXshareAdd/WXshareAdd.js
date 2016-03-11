/**
 * Created by ubuntu64 on 3/8/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

var Utils = require('utils');

new Vue({
    el: '#wxshare',
    data: {
        myPrice: '',
        num: '',
        count: 0,
        funds: ''
    },
    methods: {
        total: function() {
            this.count = (this.myPrice * this.num).toFixed(4);
        }
    },
    validators: {
        isaddress: function(val) {
            return /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(val);
        },
        isnum: Utils.isNum,
        min30: Utils.min30,
        maxprice: function(num) {
            return this.myPrice * num <= this.funds;
        }
    }
});