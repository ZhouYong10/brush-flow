/**
 * Created by ubuntu64 on 2/26/16.
 */
var Vue = require('vue');
Vue.use(require('vue-validator'));
Vue.use(require('vue-resource'));

var Utils = require('utils');


new Vue({
    el: '#recharge',
    data: {
        num: ''
    },
    methods: {
        commit: function() {
            console.log(this.num);
            this.$http.post('/user/recharge', {
                alipayId: this.num
            }).then(function(res) {
                if(res.data.isOK) {
                    $('<a href="' + res.data.path + '" ></a>').get(0).click();
                }else{
                    layer.msg(res.data.message);
                }
            });
        }
    },
    validators: {
        isnum: Utils.isNum
    }
});

$(function() {
    $('#commit').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        var $alipayNum = $('#rechargeNum');
        var alipayNum = $alipayNum.val();
        var numLen = alipayNum.length;
        if(Utils.isNum(alipayNum) && numLen ==32){
            $.post('/user/recharge', {
                alipayId: alipayNum
            }).then(function(data) {
                console.log(data, '====================');
                if(data.isOK) {
                    $('<a href="' + data.path + '" ></a>').get(0).click();
                }else{
                    layer.msg(data.message);
                }
            });
        }else{
            layer.tips('请输入合法的支付宝交易号!', '#rechargeNum', {
                tips: [1, '#f00'],
                time: 4000
            });
        }
    })
})