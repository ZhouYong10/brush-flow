/**
 * Created by ubuntu64 on 3/10/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

new Vue({
    el: '#wxReply',
    data: {
        myPrice: '',
        num: '',
        count: 0,
        funds: ''
    },
    methods: {
        total: function() {
            this.count = this.myPrice * this.num;
        }
    },
    validators: {
        isnum: function(val) {
            if(val == ''){
                return true;
            }else{
                return /^[0-9]*[1-9][0-9]*$/.test(val);
            }
        },
        min20: function(val) {
            return parseInt(val) >= 20;
        },
        maxprice: function(num) {
            return this.myPrice * num <= this.funds;
        },
        minnum: function(val) {
            return true;
        }
    }
});