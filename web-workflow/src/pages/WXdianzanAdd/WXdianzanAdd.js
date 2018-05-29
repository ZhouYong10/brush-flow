/**
 * Created by ubuntu64 on 3/15/16.
 */
var Utils = require('utils');

function isAddress(callback) {
    var $address = $('#address');
    var $title = $('#title');
    var address = $address.val();
    if (Utils.isWXhttp(address)) {
        $address.css({color: 'green'});
        callback(null);
        $.post('/parse/wx/title/by/address', {address: address}, function (data) {
            if (data.isOk) {
                $title.val(data.title).css({color: 'green'});
            } else {
                $title.val(data.message).css({color: 'red'});
            }
        })
    } else {
        $address.css({color: 'red'});
        layer.tips('请输入正确的微信文章地址!', '#address', {
            tips: [1, '#f00'],
            time: 4000
        });
        callback(new Error('请输入正确的微信文章地址!'));
    }
}

function checkReadLike() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $likeNum = $('#likeNum');
    var likeNum = $likeNum.val();
    var totalPrice = 0;
    var $total = $('#total');
    if (Utils.isNum(likeNum) && Utils.min100(likeNum) && Utils.max25000(likeNum)){
        $likeNum.css({color: 'green'});
        totalPrice = (likeNum * price).toFixed(4);
        if(parseFloat(totalPrice) > parseFloat(userFunds)){
            $total.val('￥ ' + totalPrice).css({color: 'red'});
            return 'errTotal';
        }
        $total.val('￥ ' + totalPrice).css({color: 'green'});
        return 'ok';
    } else {
        $likeNum.css({color: 'red'});
        return 'errLike';
    }
}

$(function () {
    $('.radioLable').click(function () {
        var model = $(this).find('input').val();
        $.get('/WX/like/model', {model: model}, function (data) {
            $('#priceShow').val('阅读￥ ' + data.price + '/个, 点赞￥ ' + data.price2 + '/个');
            $('#price').val(data.price);
            $('#price2').val(data.price2);
        })
    });

    $('#address').blur(function () {
        isAddress(function() {});
    });

    $('#likeNum').keyup(function () {
        checkReadLike();
    }).blur(function () {
        checkReadLike();
    });

    $('#commit').click(function (e) {
        isAddress(function (err) {
            if (err) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            var result = checkReadLike();
            if (result != 'ok') {
                e.stopPropagation();
                e.preventDefault();
                switch (result) {
                    case 'errTotal':
                        layer.tips('账户余额不足，请充值!', '#total', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                    case 'errLike':
                        layer.tips('单次下单最少100，最大25000!', '#likeNum', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                }
            }

        });
    })
});