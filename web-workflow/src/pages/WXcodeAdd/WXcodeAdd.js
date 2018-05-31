/**
 * Created by ubuntu64 on 3/8/16.
 */
var Utils = require('utils');

function checkFansNum() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $fansNum = $('#fansNum');
    var fansNum = $fansNum.val();

    var totalPrice = 0;
    var $totalPrice = $('#totalPrice');

    if (Utils.isNum(fansNum) && Utils.min100(fansNum)){
        $fansNum.css({color: 'green'});

        totalPrice = (fansNum * price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $totalPrice.val('￥ ' + totalPrice).css({color: 'red'});
            return 'errTotal';
        }
        $totalPrice.val('￥ ' + totalPrice).css({color: 'green'});
        return 'ok';
    } else {
        $fansNum.css({color: 'red'});
        return 'errLike';
    }
}

$(function () {

    $('#fansNum').keyup(function () {
        checkFansNum();
    }).blur(function () {
        checkFansNum();
    });

    $('#commit').click(function (e) {
        if($('#codeImg').val() == ''){
            e.stopPropagation();
            e.preventDefault();
            layer.tips('请选择二维码图片!', '#codeImg', {
                tips: [1, '#f00'],
                time: 4000
            });
            return;
        }

        var result = checkFansNum();
        if (result != 'ok') {
            e.stopPropagation();
            e.preventDefault();
            switch (result) {
                case 'errTotal':
                    layer.tips('账户余额不足， 请充值!', '#totalPrice', {
                        tips: [1, '#f00'],
                        time: 4000
                    });
                    break;
                case 'errLike':
                    layer.tips('单次下单最少100, 且必须为正整数!', '#fansNum', {
                        tips: [1, '#f00'],
                        time: 4000
                    });
                    break;
            }
        }
    })
});