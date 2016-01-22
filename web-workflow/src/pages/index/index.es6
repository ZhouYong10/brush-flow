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
    '/client/home': {
        component: {
            template: '<h1>发哈里了多少的收费和 老子登陆成功了。。。。。/home </h1>'
        }
    }
});

router.redirect({
    '*': '/'
});

router.start(App, '#app');
