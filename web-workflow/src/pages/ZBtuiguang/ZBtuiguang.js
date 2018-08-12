/**
 * Created by ubuntu64 on 2/26/16.
 */
var Utils = require('utils');


function checkNum() {
    var price = $('#price').val();
    if(!price) {
        layer.tips('请选择商品！', '#productType', {
            tips: [1, '#f00'],
            time: 4000
        });
    }
    var userFunds = $('#userFunds').val();
    var $num = $('#num');
    var num = $num.val();
    var totalPrice = 0;
    var $total = $('#total');

    if (Utils.isNum(num) && Utils.min100(num)) {
        $num.css({color: 'green'});
        totalPrice = (num * price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $total.val('￥ ' + totalPrice).css({color: 'red'});
            return 'errTotal';
        }
        $total.val('￥ ' + totalPrice).css({color: 'green'});
        return 'ok';
    } else {
        $num.css({color: 'red'});
        return 'errRead';
    }
}

$(function() {
    $('#productType').on('change', function (e) {
        var $selected = $(this).find('option:selected');
        var price = $selected.attr('data_price');
        $('#priceShow').val(price + ' 元/个');
        $('#price').val(price);
        checkNum();
    });

    $('#num').keyup(function () {
        checkNum();
    }).blur(function () {
        checkNum();
    });

    $('#commit').click(function (e) {
        var productType = $('#productType').val();

        if(productType){
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
                        layer.tips('数量必须是正整数，且不小于100!', '#num', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                }
            }
        }else{
            layer.tips('请选择商品！', '#productType', {
                tips: [1, '#f00'],
                time: 4000
            });
            e.stopPropagation();
            e.preventDefault();
        }
    })
})


