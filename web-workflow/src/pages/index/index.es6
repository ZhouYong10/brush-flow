/**
 * Created by Administrator on 2015/12/21.
 */

var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));

new Vue({
    el: '#login',
    data:{
        username: '',
        password: '',
        securityCode: ''
    },
    methods: {
        changeImg: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.getSecurityCode').get(0).src = '/securityImg?' + new Date().getTime();
        },
        onLogin: function(e) {  //使用es6语法,获取不到相应的数据,例如this.username,得不到数据.
            e.stopPropagation();
            e.preventDefault();

            this.$http.post('/login', {
                username: this.username,
                password: this.password,
                securityCode: this.securityCode
            }).then((res) => {
                if(res.data.isOK) {
                    $('<a href="/admin/home" ></a>').get(0).click();
                    //$('<a href="/client/home" ></a>').get(0).click();
                }else{
                    layer.msg(res.data.message);
                }
            });
        }
    }
});
