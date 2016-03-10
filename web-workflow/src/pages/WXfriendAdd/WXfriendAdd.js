/**
 * Created by ubuntu64 on 3/8/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

var Utils = require('utils');

new Vue({
    el: '#wxFans',
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
        isnum: Utils.isNum,
        min100: Utils.min100,
        maxprice: function(num) {
            return this.myPrice * num <= this.funds;
        }
    }
});