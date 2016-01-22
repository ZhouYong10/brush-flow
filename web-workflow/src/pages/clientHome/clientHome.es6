var Vue = require('vue');

new Vue({
    el: '#app',
    components: {
        'app-header': require('header'),
        'app-mune': require('menu')
    }
});