/**
 * Created by ubuntu64 on 3/15/16.
 */
var Vue = require('vue');
Vue.use(require('vue-resource'));
var Utils = require('utils');

var ordersAdd = Vue.extend({
    template: __inline('ordersAdd.html'),
    props: ['view', 'price', 'price2'],
    data: function(){
        return {
            itemsTxt: ''
        };
    },
    methods: {
        parseTxt: function() {
            var self = this;
            console.log('parseTxt');
            var orders = [];
            var items = self.itemsTxt.split(/[\r\n]/);
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                var orderData = item.split(/[ ]+/);
                var order = {errMsg: '', noErr: true, price: self.price, price2: self.price2};
                order.address = orderData[0];
                order.num = orderData[1];
                order.num2 = orderData[2];
                checkOrder(order, self.$http);
                orders.push(order);
            }



            console.log(orders);
            this.view = 'tables';
        },
        parseExcel: function() {
            console.log('parseExcel');
            console.log(this.itemsTxt);


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
        readPrice: '',
        likePrice: '',
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

function checkOrder(order, $http) {
    if(!/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(order.address)) {
        order.noErr = false;
        order.errMsg += '请填写合法的url地址. ';
    }
    Utils.wxParseAddress($http, order.address)
        .then(function (title) {
            order.title = title;
        }, function (message) {
            order.errMsg += message + '. ';
        });
    if(!Utils.isNum(order.num)){
        order.noErr = false;
        order.errMsg += '阅读数量必须是数字. ';
    }
    if(!Utils.isNum(order.num2)){
        order.noErr = false;
        order.errMsg += '点赞数量必须是数字. ';
    }
    if(Utils.isNum(order.num) && Utils.isNum(order.num2) && !(parseInt(order.num2) <= parseInt(order.num / 25 * 2))) {
        order.noErr = false;
        order.errMsg += '点赞数量不能大于阅读数量的8%. ';
    }

    order.totalPrice = (order.price * order.num + order.price2 * order.num2).toFixed(4);
}