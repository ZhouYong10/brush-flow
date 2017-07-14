/**
 * Created by ubuntu64 on 3/16/16.
 */
var Utils = require('utils');

function getPrice() {
    var userFunds = $('#userFunds').val();
    var totalPrice = 0;
    var $total = $('#total');
    var readNum = $('#readNum').val();
    readNum = Utils.isNum(readNum) ? readNum : 0;
    var type = $('#taskPrice').val();
    $.get('/wb/get/price/by/type', {type: type}, function(data) {
        $('#showPrice').text('价格为￥ ' + data.price + '/个');
        $('#price').val(data.price);
        totalPrice = (readNum * data.price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $total.val('￥ ' + totalPrice).css({color: 'red'});
        }else{
            $total.val('￥ ' + totalPrice).css({color: 'green'});
        }
    })
}

function isAddress() {
    var $address = $('#address');
    var address = $address.val().trim();
    if (address == '') {
        $address.css({color: 'red'});
        layer.tips('请输入关注地址或微博ID!', '#address', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    } else {
        $address.css({color: 'green'});
        return true;
    }
}

function checkReadLike() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $readNum = $('#readNum');
    var readNum = $readNum.val();
    var totalPrice = 0;
    var $total = $('#total');
    if (Utils.isNum(readNum) && Utils.min100(readNum)) {
        $readNum.css({color: 'green'});
        totalPrice = (readNum * price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $total.val('￥ ' + totalPrice).css({color: 'red'});
            return 'errTotal';
        }
        $total.val('￥ ' + totalPrice).css({color: 'green'});
        return 'ok';
    } else {
        $readNum.css({color: 'red'});
        return 'errRead';
    }
}

$(function () {
    $('#taskPrice').change(function () {
        getPrice();
    });

    $('#address').change(function () {
        isAddress();
    });

    $('#readNum').keyup(function () {
        checkReadLike();
    }).blur(function () {
        checkReadLike();
    });

    $('#commit').click(function (e) {
        if(isAddress()){
            var result = checkReadLike();
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
                        layer.tips('阅读数必须是正整数，且不小于500!', '#readNum', {
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