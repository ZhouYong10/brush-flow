/**
 * Created by Administrator on 2015/12/21.
 */

var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);


var App = Vue.extend();

var router = new VueRouter();

router.map({
    '/': {
        component: require('login')
    },
    '/login': {
        component: {
            template: '<h1>跳转到/login</h1>'
        }
    }
});

router.redirect({
    // 重定向任意未匹配路径到 /home
    '*': '/'
});

router.start(App, '#app');
