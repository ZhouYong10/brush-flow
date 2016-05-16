/**
 * Created by ubuntu64 on 3/8/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

var Utils = require('utils');

new Vue({
    el: '#wxFans',
    data: {
        fansPrice: '',
        replyPrice: '',
        num: '',
        isReply: '',
        count: 0,
        funds: ''
    },
    methods: {
        total: function() {
            if(this.isReply){
                this.count = ((parseFloat(this.fansPrice) + parseFloat(this.replyPrice)) * parseInt(this.num)).toFixed(4);
            }else {
                this.count = (parseFloat(this.fansPrice) * parseInt(this.num)).toFixed(4);
            }
        }
    },
    validators: {
        isnum: Utils.isNum,
        min100: Utils.min100,
        maxprice: function(num) {
            if(this.isReply){
                return (parseFloat(this.fansPrice) + parseFloat(this.replyPrice)) * parseInt(num) <= parseFloat(this.funds);
            }else {
                return parseFloat(this.fansPrice) * parseInt(num) <= parseFloat(this.funds);
            }
        },
        isfloat: Utils.isfloat,
        minfansprice: function(price) {
            return parseFloat(price) >= parseFloat(this.fansPrice);
        },
        minreplyprice: function(price) {
            return parseFloat(price) >= parseFloat(this.replyPrice);
        }
    }
});