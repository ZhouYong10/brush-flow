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
    }
});

router.start(App, '#app');
