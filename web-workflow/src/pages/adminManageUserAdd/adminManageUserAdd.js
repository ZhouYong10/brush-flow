/**
 * Created by zhouyong10 on 2/2/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));

new Vue({
    el: '#addUser',
    data: {
        username: '',
        notrepeat: true
    },
    methods: {
        notRepeat: function() {
            var self = this;
            self.$http.post('/user/username/notrepeat', {username: self.username})
                .then(function (res) {
                    if(res.data.notRepeat) {
                        self.notrepeat = true;
                    }else{
                        self.notrepeat = false;
                    }
                });
        }
    }
});