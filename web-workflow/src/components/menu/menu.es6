var Vue = require('vue');

module.exports = Vue.extend({
    template: __inline('./menu.html'),
    data: function() {
        return {
            items: [
                {
                    name: '公司',
                    subItems: [
                        {name: '公司'},
                        {name: '人物'},
                        {name: '趋势'},
                        {name: '投融资'},
                        {name: '创业公司'},
                        {name: '公司'},
                        {name: '创业人物'}
                    ]
                },
                {
                    name: '人物',
                    subItems: [
                        {name: '公司'},
                        {name: '人物'},
                        {name: '趋势'},
                        {name: '投融资'},
                        {name: '创业公司'},
                        {name: '公司'},
                        {name: '创业人物'}
                    ]
                },
                {
                    name: '趋势',
                    subItems: [
                        {name: '公司'},
                        {name: '人物'},
                        {name: '趋势'},
                        {name: '投融资'},
                        {name: '创业公司'},
                        {name: '公司'},
                        {name: '创业人物'}
                    ]
                },
                {
                    name: '投融资',
                    subItems: [
                        {name: '公司'},
                        {name: '人物'},
                        {name: '趋势'},
                        {name: '投融资'},
                        {name: '创业公司'},
                        {name: '公司'},
                        {name: '创业人物'}
                    ]
                }
            ]
        }
    }
});