var Vue = require('vue');

module.exports = Vue.extend({
    template: __inline('./header.html'),
    data: function() {
        return {
            title: '网络营销系统'
        }
    }
});