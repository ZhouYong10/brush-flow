/**
 * Created by ubuntu64 on 3/8/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));

new Vue({
    el: '#wxFans',
    data: {
        myPrice: '',
        num: '',
        count: 0
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
        min100: function(val) {
            return parseInt(val) >= 100;
        }
    }
});