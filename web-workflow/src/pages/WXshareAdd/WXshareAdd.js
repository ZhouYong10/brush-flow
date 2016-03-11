/**
 * Created by ubuntu64 on 3/8/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));

var Utils = require('utils');

new Vue({
    el: '#wxshare',
    data: {
        type: '',
        price: '',
        address: '',
        articleTitle: '',
        totalPrice: 0,
        num: '',
        count: 0,
        funds: ''
    },
    methods: {
        selectType: function() {
            var self = this;
            this.$http.get('/wx/get/price/by/type', {type: this.type})
                .then(function (res) {
                    self.price = res.data.price;
                });
        },
        parseAddress: function() {
            var self = this;
            Utils.parseAddress(self.$http, self.address)
                .then(function(title) {
                    self.articleTitle = title;
                    console.log(title, '==================');
                },function(message) {
                    alert(message);
                })
        },
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