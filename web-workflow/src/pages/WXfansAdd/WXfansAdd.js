/**
 * Created by ubuntu64 on 3/10/16.
 */
var Utils = require('utils');

function fansID() {
    var $fansID = $('#fansID');
    var fansID = $fansID.val().trim();
    if(fansID == ''){
        $fansID.css({color: 'red'});
        layer.tips('请输入正确的微信ID!', '#fansID', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }
    $fansID.css({color: 'green'});
    return true;
}

function checkNum() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $fansNum = $('#fansNum');
    var fansNum = $fansNum.val();
    var totalPrice = 0;
    var $total = $('#total');

    if (Utils.isNum(fansNum) && Utils.min100(fansNum)) {
        $fansNum.css({color: 'green'});
        totalPrice = (fansNum * price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $total.val('￥ ' + totalPrice).css({color: 'red'});
            return 'errTotal';
        }
        $total.val('￥ ' + totalPrice).css({color: 'green'});
        return 'ok';
    } else {
        $fansNum.css({color: 'red'});
        return 'errRead';
    }
}

$(function () {
    $('#fansID').change(function () {
        fansID();
    });

    $('#fansNum').keyup(function () {
        checkNum();
    }).blur(function () {
        checkNum();
    });

    $('#commit').click(function (e) {
        if(fansID()){
            var result = checkNum();
            if (result != 'ok') {
                e.stopPropagation();
                e.preventDefault();
                switch (result){
                    case 'errTotal':
                        layer.tips('账户余额不足，请充值!', '#total', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                    case 'errRead':
                        layer.tips('必须为正整数，且不小于１00!', '#fansNum', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                }
            }
        }else{
            e.stopPropagation();
            e.preventDefault();
        }
    })
});