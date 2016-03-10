/**
 * Created by ubuntu64 on 3/10/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

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
            this.count = this.fansPrice * this.num + this.replyPrice * this.replyNum;
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
        maxprice: function() {
            return this.fansPrice * this.num + this.replyPrice * this.replyNum <= this.funds;
        },
        minnum: function(val) {
            return val <= this.num;
        }
    }
});