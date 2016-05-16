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
        replayPrice: '',
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
        min1000: Utils.min1000,
        maxprice: function(num) {
            return parseFloat(this.myPrice * num) <= parseFloat(this.funds);
        },
        isfloat: Utils.isfloat,
        minfansprice: function(price) {
            console.log(parseFloat(price),'================');
            console.log(parseFloat(this.fansPrice),'================');
            return parseFloat(price) >= parseFloat(this.fansPrice);
        },
        minreplyprice: function(price) {
            console.log(parseFloat(price),'================');
            console.log(parseFloat(this.replayPrice),'================');
            return parseFloat(price) >= parseFloat(this.replayPrice);
        }
    }
});