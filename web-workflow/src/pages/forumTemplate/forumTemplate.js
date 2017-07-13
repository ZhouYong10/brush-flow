/**
 * Created by ubuntu64 on 4/13/16.
 */
var Utils = require('utils');

function isAddress() {
    return new Promise(function (resolve, reject) {
        var $address = $('#address');
        var $title = $('#title');
        var $remark = $('#remark');
        var address = $address.val();
        if (Utils.isHttp(address)) {
            $address.css({color: 'green'});
            resolve();
            $.post('/parse/forum/title/by/address', {address: address}, function (data) {
                if (data.isOk) {
                    $title.val(data.title).css({color: 'green'});
                    $('#showPrice').val('￥ ' + data.price + ' /条').css({color: 'green'});
                    $('#price').val(data.price);
                    $('#smallType').val(data.smallType);
                    $remark.attr({placeholder: data.remark});
                } else {
                    $title.val(data.message).css({color: 'red'});
                }
            })
        } else {
            $address.css({color: 'red'});
            layer.tips('请输入正确的任务地址!', '#address', {
                tips: [1, '#f00'],
                time: 4000
            });
            reject();
        }
    });
}

function checkTime() {
    var $min = $('#min');
    var $max = $('#max');
    var min = $min.val();
    var max = $max.val();
    if(Utils.isNum(min)){
        $min.css({color: 'green'});
        if(Utils.isNum(max)){
            $max.css({color: 'green'});
            return true;
        }else{
            $max.css({color: 'red'});
            layer.tips('必须为正整数!', '#max', {
                tips: [1, '#f00'],
                time: 4000
            });
            return false;
        }
    }else{
        $min.css({color: 'red'});
        layer.tips('必须为正整数!', '#min', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }
}

function remark() {
    var $total = $('#total');
    var userFunds = $('#userFunds').val();
    var price = $('#price').val();
    var content = $('#remark').val().trim();
    if(content == ''){
        layer.tips('评论内容不能为空!', '#remark', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }
    var num = content.split('\n').length;
    $('#num').val(num);
    $('#showNum').text('合计: ' + num + '条');
    var totalPrice = (price * num).toFixed(4);
    if(totalPrice < 0.5) {
        $total.val(0.5)
    }else {
        $total.val(totalPrice);
    }
    if(parseFloat(totalPrice) > parseFloat(userFunds)){
        $total.css({color: 'red'});
        layer.tips('余额不足，请充值!', '#total', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }else{
        $total.css({color: 'green'});
        return true;
    }
}

$(function () {
    $('#address').change(function () {
        isAddress();
    });

    $('#min').keyup(function () {
        checkTime();
    });

    $('#max').keyup(function () {
        checkTime();
    });

    $('#remark').blur(function() {
        remark();
    });


    $('#commit').click(function (e) {
        isAddress().then(function () {
            if (!(checkTime() && remark())) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, function () {
            e.stopPropagation();
            e.preventDefault();
        })
    })
});