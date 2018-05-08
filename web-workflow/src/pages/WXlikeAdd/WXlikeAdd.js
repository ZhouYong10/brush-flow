/**
 * Created by ubuntu64 on 3/15/16.
 */
var Utils = require('utils');

function isAddress() {
    return new Promise(function (resolve, reject) {
        var $address = $('#address');
        var $title = $('#title');
        var address = $address.val();
        if (Utils.isWXhttp(address)) {
            $address.css({color: 'green'});
            resolve();
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
            reject();
        }
    });
}

function checkReadLike() {
    var price = $('#price').val();
    var price2 = $('#price2').val();
    var userFunds = $('#userFunds').val();
    var $readNum = $('#readNum');
    var $likeNum = $('#likeNum');
    var readNum = $readNum.val();
    var likeNum = $likeNum.val();
    var totalPrice = 0;
    var $total = $('#total');
    if (Utils.isNum(readNum) && Utils.min500(readNum)) {
        $readNum.css({color: 'green'});
        if(likeNum == '') {
            totalPrice = (readNum * price).toFixed(4);
            if(parseFloat(totalPrice) > parseFloat(userFunds)){
                $total.val('￥ ' + totalPrice).css({color: 'red'});
                return 'errTotal';
            }
            $total.val('￥ ' + totalPrice).css({color: 'green'});
            return 'ok';
        }else{
            if(Utils.isNum(likeNum) && parseInt(likeNum) <= parseInt(readNum*0.5/100)){
                $likeNum.css({color: 'green'});
                totalPrice = (readNum * price + likeNum * price2).toFixed(4);
                if(parseFloat(totalPrice) > parseFloat(userFunds)){
                    $total.val('￥ ' + totalPrice).css({color: 'red'});
                    return 'errTotal';
                }
                $total.val('￥ ' + totalPrice).css({color: 'green'});
                return 'ok';
            }else{
                $likeNum.css({color: 'red'});
                return 'errLike';
            }
        }
    } else {
        $readNum.css({color: 'red'});
        return 'errRead';
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

    $('#address').change(function () {
        isAddress();
    });

    $('#readNum').keyup(function () {
        checkReadLike();
    }).blur(function () {
        checkReadLike();
    });

    $('#likeNum').keyup(function () {
        checkReadLike();
    }).blur(function () {
        checkReadLike();
    });

    $('#commit').click(function (e) {
        isAddress().then(function () {
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
                    case 'errLike':
                        layer.tips('点赞数必须是正整数，且不能大于阅读数的0.5%!', '#likeNum', {
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
        }, function () {
            e.stopPropagation();
            e.preventDefault();
        })
    })
});