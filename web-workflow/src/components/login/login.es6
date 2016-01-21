
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));
Vue.use(require('vue-async-data'));

var Layer = layer;

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
        changeImg: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('.getSecurityCode').get(0).src = '/securityImg?' + new Date().getTime();
        },
        onLogin: function(e) {  //使用es6语法,获取不到相应的数据,例如this.username,得不到数据.
            e.stopPropagation();
            e.preventDefault();
            var router = this.$route.router;

            this.$http.post('/login', {
                username: this.username,
                password: this.password,
                securityCode: this.securityCode
            }).then((res) => {
                console.log(res.data.isOK);
                if(res.data.isOK) {
                    router.go('/home');
                }else{
                    Layer.msg(res.data.message);
                }
            });
            //this.$route.router.go('/login');
        }
    },
    //asyncData: function(resolve, reject) {
    //    this.$http.get('/securityImg').then((res) => {
    //        console.log(res);
    //        resolve({
    //            securityImg: res
    //        })
    //    })
    //},
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

