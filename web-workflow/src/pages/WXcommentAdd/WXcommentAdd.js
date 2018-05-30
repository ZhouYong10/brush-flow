/**
 * Created by ubuntu64 on 4/13/16.
 */
var Utils = require('utils');

function isAddress(callback) {
    var $address = $('#address');
    var address = $address.val();
    if (Utils.isWXhttp(address)) {
        callback(null);
    } else {
        $address.css({color: 'red'});
        layer.tips('请输入正确的微信文章地址!', '#address', {
            tips: [1, '#f00'],
            time: 4000
        });
        callback(new Error('请输入正确的微信文章地址!'));
    }
}

function checkCommentLine() {
    var $content = $('#contentSelf');
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var content = $content.val();
    var contents = content.split('\n');
    var num = 0;
    var totalPrice = 0;
    for(var i = 0; i < contents.length; i++) {
        var comment = $.trim(contents[i]);
        if(comment != ''){
            num++;
        }
    }
    if(num > 0 && num < 5) {
        num = 5;
    }
    totalPrice = (parseFloat(price) * num).toFixed(4);

    $('#totalPrice').text(totalPrice);
    $('#num').text(num);
    return parseFloat(userFunds) > totalPrice;
}

function showMoneyMsg() {
    var enoughMoney = checkCommentLine();
    if (!enoughMoney) {
        layer.tips('账户余额不足，请充值!', '#showTotalPrice', {
            tips: [1, '#f00'],
            time: 4000
        });
        $('#showTotalPrice').css('color', 'red');
        return true;
    }else{
        $('#showTotalPrice').css('color', 'green');
        return false;
    }
}

function checkContentEmpty() {
    var isEmpty = $.trim($('#contentSelf').val()) == '';
    if(isEmpty) {
        layer.tips('评论内容不能为空!', '#contentSelf', {
            tips: [1, '#f00'],
            time: 4000
        });
    }
    return isEmpty;
}

$(function () {
    $('.radioLable').click(function () {
        var model = $(this).find('input').val();
        $.get('/WX/comment/model', {model: model}, function (data) {
            $('#priceShow').val('￥ ' + data.price + '/个');
            $('#price').val(data.price);
            showMoneyMsg()
        })
    });

    $('#address').blur(function () {
        isAddress(function(err) {
            if(!err) {
                var $address = $('#address');
                var $title = $('#title');
                $address.css({color: 'green'});
                $.post('/parse/wx/title/by/address', {address: $address.val()}, function (data) {
                    if (data.isOk) {
                        $title.val(data.title).css({color: 'green'});
                        $('#commitTitle').val(data.title);
                    } else {
                        $title.val(data.message).css({color: 'red'});
                    }
                })
            }
        });
    });

    $('#contentSelf').keyup(function () {
        checkCommentLine();
    }).blur(function () {
        checkContentEmpty();
        showMoneyMsg();
    });

    $('#commit').click(function (e) {
        isAddress(function (err) {
            if (err || checkContentEmpty() || showMoneyMsg()) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
        });
    })
});