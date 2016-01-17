
var Vue = require('vue');
var VueValidator = require('vue-validator');
Vue.use(VueValidator);

module.exports = Vue.extend({
    template: __inline('./login.html'),
    data: () => {
        return {
            username: '',
            password: '',
            securityCode: ''
        };
    },
    methods: {
        onLogin: function() {  //使用es6语法,获取不到相应的数据,例如this.username,得不到数据.
            console.log(this.username);
            console.log(this.password);
            console.log(this.securityCode);
        }
    },
    route: {
        canReuse: function() {
            console.log('canRuse Foo');
        },
        canDeactivate: function() {
            console.log('canDeactivate Foo');
        },
        canActivate: function() {
            console.log('canActivate Foo');
        },
        deactivate: function() {
            console.log('deactivate Foo');
        },
        activate: function() {
            console.log('activate Foo');
        },
        data: function() {
            console.log('data Foo');
        }
    }
});

