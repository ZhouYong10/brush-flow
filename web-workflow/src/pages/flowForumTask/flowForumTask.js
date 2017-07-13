/**
 * Created by ubuntu64 on 4/18/16.
 */
var Utils = require('utils');

function isAddress() {
    return new Promise(function (resolve, reject) {
        var $address = $('#address');
        var address = $address.val();
        if (Utils.isHttp(address)) {
            $address.css({color: 'green'});
            resolve();
            $.post('/parse/flow/forum/address', {address: address}, function (data) {
                if(data.isFlow){
                    alert('检测到您提交的是视频地址，请到视频流量任务提交订单！！')
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

function checkReadLike() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $readNum = $('#readNum');
    var readNum = $readNum.val();
    var totalPrice = 0;
    var $total = $('#total');
    if (Utils.isNum(readNum) && readNum > 0) {
        $readNum.css({color: 'green'});
        if(parseInt(readNum) <= 10000){
            readNum = 10000;
        }else{
            readNum = parseInt(readNum / 5000) * 5000 + (readNum % 5000 > 0 ? 1 : 0) * 5000;
        }
        totalPrice = (readNum / 5000 * price).toFixed(4);
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
    $('#address').change(function () {
        isAddress();
    });

    $('#readNum').keyup(function () {
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
                    case 'errRead':
                        layer.tips('必须为正整数!', '#readNum', {
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