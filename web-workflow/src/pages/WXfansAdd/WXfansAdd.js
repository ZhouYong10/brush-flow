/**
 * Created by ubuntu64 on 3/10/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

var Utils = require('utils');

new Vue({
    el: '#wxReply',
    data: {
        fansPrice: '',
        replyPrice: '',
        num: '',
        replyNum: '',
        count: 0,
        funds: ''
    },
    methods: {
        total: function() {
            this.count = (this.fansPrice * this.num + this.replyPrice * this.replyNum).toFixed(4);
        }
    },
    validators: {
        isnum: Utils.isNum,
        min20: Utils.min20,
        maxprice: function() {
            return this.fansPrice * this.num + this.replyPrice * this.replyNum <= this.funds;
        },
        minnum: function(val) {
            return val - this.num <= 0;
        }
    }
});