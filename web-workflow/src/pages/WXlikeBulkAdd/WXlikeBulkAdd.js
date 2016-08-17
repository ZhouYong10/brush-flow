/**
 * Created by ubuntu64 on 3/15/16.
 */
var Vue = require('vue');
Vue.use(require('vue-resource'));
var Utils = require('utils');

var ordersAdd = Vue.extend({
    template: __inline('ordersAdd.html'),
    props: ['view'],
    data: function(){
        return {orders: ''};
    },
    methods: {
        parseTxt: function() {
            console.log('parseTxt');
            console.log(this.orders);


            this.view = 'tables';
        },
        parseExcel: function() {
            console.log('parseExcel');
            console.log(this.orders);


            this.view = 'tables';
        }
    }
});

var ordersTable = Vue.extend({
    template: __inline('ordersTable.html')
});

//Vue.use(require('vue-validator'));

new Vue({
    el: '#wxLike',
    data: {
        currentView: 'add'
    },
    components: {
        add: ordersAdd,
        tables: ordersTable
    }

    //methods: {
    //    parseAddress: function() {
    //        var self = this;
    //        Utils.wxParseAddress(self.$http, self.address)
    //            .then(function(title) {
    //                self.articleTitle = title;
    //            },function(message) {
    //                alert(message);
    //            })
    //    },
    //    total: function() {
    //        this.totalPrice = (this.price * this.num + this.price2 * this.num2).toFixed(4);
    //    }
    //},
    //validators: {
    //    isaddress: function(val) {
    //        return /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(val);
    //    },
    //    minnum: function(val) {
    //        var like = val ? val : 0;
    //        var read = this.num ? this.num : 0;
    //        return parseInt(like) <= parseInt(read/10);
    //    },
    //    isnum: Utils.isNum,
    //    min200: Utils.min200,
    //    maxprice: function() {
    //        return parseFloat(this.price * this.num + this.price2 * this.num2) <= parseFloat(this.funds);
    //    }
    //}
});