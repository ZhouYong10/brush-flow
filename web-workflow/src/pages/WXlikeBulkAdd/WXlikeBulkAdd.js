/**
 * Created by ubuntu64 on 3/15/16.
 */
var Vue = require('vue');
Vue.use(require('vue-resource'));
var Utils = require('utils');

var ordersAdd = Vue.extend({
    template: __inline('ordersAdd.html'),
    props: ['view', 'price', 'price2', 'orders'],
    data: function(){
        return {
            itemsTxt: ''
        };
    },
    methods: {
        parseTxt: function() {
            var self = this;
            if(self.itemsTxt == '') {
                return alert('请填写要提交的订单信息！');
            }

            console.log('parseTxt');
            var orders = self.orders;
            var items = self.itemsTxt.split(/[\r\n]/);
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                var orderData = item.split(/[ ]+/);
                var $order = new Vue({data: {
                    errMsg: '',
                    noErr: true,
                    price: self.price,
                    price2: self.price2,
                    totalPrice: 0,
                    title: ''
                }});
                $order.address = orderData[0];
                $order.num = orderData[1];
                $order.num2 = orderData[2];
                checkOrder($order);
                (function(order) {
                    Utils.wxParseAddress(self.$http, $order.address)
                        .then(function (title) {
                            order.title =  title;
                        }, function (message) {
                            order.errMsg = order.errMsg + message + '. ';
                        });
                })($order);

                orders.push($order);
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
    template: __inline('ordersTable.html'),
    props: ['orders'],
    methods: {
        edit: function(order) {
            order.noErr = 'edit';
        },
        save: function(order) {
            order.noErr = true;
            order.errMsg = '';
            checkOrder(order);
        },
        commit: function(order) {

        }
    }
});

//Vue.use(require('vue-validator'));

new Vue({
    el: '#wxLike',
    data: {
        readPrice: '',
        likePrice: '',
        currentView: 'add',
        orders: []
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

function checkOrder(order) {
    if(!/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(order.address)) {
        order.$set('noErr', false);
        order.$set('errMsg', order.errMsg + '请填写合法的url地址. ');
    }
    if(!Utils.isNum(order.num)){
        order.$set('noErr', false);
        order.$set('errMsg', order.errMsg + '阅读数量必须是数字. ');
    }
    if(!Utils.isNum(order.num2)){
        order.$set('noErr', false);
        order.$set('errMsg', order.errMsg + '点赞数量必须是数字. ');
    }
    if(Utils.isNum(order.num) && Utils.isNum(order.num2) && !(parseInt(order.num2) <= parseInt(order.num / 25 * 2))) {
        order.$set('noErr', false);
        order.$set('errMsg', order.errMsg + '点赞数量不能大于阅读数量的8%. ');
    }
    order.$set('totalPrice', (order.price * order.num + order.price2 * order.num2).toFixed(4));
}