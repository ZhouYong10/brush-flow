/**
 * Created by ubuntu64 on 3/21/16.
 */
var Utils = require('utils');

function checkFunds() {
    var userFunds = $('#userFunds').val();
    var $funds = $('#funds');
    var funds = $funds.val();
    if(Utils.isfloat(funds) && funds >=1) {
        if(parseFloat(funds) > parseFloat(userFunds)){
            $funds.css({color: 'red'});
            layer.tips('账户余额不足', '#funds', {
                tips: [1, '#f00'],
                time: 4000
            });
            return false;
        }
        $funds.css({color: 'green'});
        return true;
    }else{
        $funds.css({color: 'red'});
        layer.tips('请输入合法金额，且不能小于1', '#funds', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }
}

function checkCount() {
    var $aliCount = $('#aliCount');
    var aliCount = $aliCount.val().trim();
    if(aliCount == ''){
        layer.tips('请输入支付宝账户', '#aliCount', {
            tips: [1, '#f00'],
            time: 4000
        });
    }else{
        $aliCount.css({color: 'green'});
        return true;
    }
}

function checkName() {
    var $aliName = $('#aliName');
    var aliName = $aliName.val().trim();
    if(aliName == ''){
        layer.tips('请输入支付宝昵称', '#aliName', {
            tips: [1, '#f00'],
            time: 4000
        });
    }else{
        $aliName.css({color: 'green'});
        return true;
    }
}

$(function () {

    $('#funds').blur(function () {
        checkFunds();
    });

    $('#aliCount').blur(function () {
        checkCount();
    });

    $('#aliName').blur(function () {
        checkName();
    });

    $('#commit').click(function (e) {
        if (!(checkFunds() && checkCount() &&  checkName())) {
            e.stopPropagation();
            e.preventDefault();
        }
    })
});