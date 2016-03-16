/**
 * Created by ubuntu64 on 3/16/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));

var Utils = require('utils');

new Vue({
    el: '#mpAttention',
    data: {
        price: '',
        address: '',
        articleTitle: '',
        totalPrice: 0,
        num: '',
        funds: 0
    },
    methods: {
        parseAddress: function() {
            var self = this;
            Utils.parseAddress(self.$http, self.address)
                .then(function(title) {
                    self.articleTitle = title;
                },function(message) {
                    alert(message);
                })
        },
        total: function() {
            this.totalPrice = (this.price * this.num).toFixed(4);
        }
    },
    validators: {
        isaddress: function(val) {
            return /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(val);
        },
        isnum: Utils.isNum,
        min30: Utils.min30,
        maxprice: function() {
            return this.price * this.num <= this.funds;
        }
    }
});