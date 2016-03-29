/**
 * Created by ubuntu64 on 2/26/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));


new Vue({
    el: '#recharge',
    data: {
        num: ''
    },
    methods: {
        commit: function() {
            console.log(this.num);
            this.$http.post('/user/recharge', {
                alipayId: this.num
            }).then(function(res) {
                layer.msg(res.data.message);
                if(res.data.isOK) {
                    this.num = '';
                }
            });
        }
    }
});