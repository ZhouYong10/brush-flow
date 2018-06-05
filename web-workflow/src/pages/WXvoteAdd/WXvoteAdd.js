/**
 * Created by ubuntu64 on 3/15/16.
 */
var Utils = require('utils');

function isAddress(callback) {
    var $address = $('#address');
    var address = $address.val();
    if (Utils.isHttp(address)) {
        $address.css({color: 'green'});
        callback();
    } else {
        $address.css({color: 'red'});
        layer.tips('请输入正确的微信投票地址!', '#address', {
            tips: [1, '#f00'],
            time: 4000
        });
        callback(new Error('请输入正确的微信文章地址!'));
    }
}

function checkReadLike() {
    var price = $('#price').val();
    var userFunds = $('#userFunds').val();
    var $voteNum = $('#voteNum');
    var voteNum = $voteNum.val();
    var totalPrice = 0;
    var $total = $('#total');
    if (Utils.isNum(voteNum)) {
        totalPrice = (voteNum * price).toFixed(4);
        $total.val('￥ ' + totalPrice).css({color: 'green'});
        if(Utils.min100(voteNum)) {
            $voteNum.css({color: 'green'});
            if(parseFloat(totalPrice) > parseFloat(userFunds)){
                $total.val('￥ ' + totalPrice).css({color: 'red'});
                return 'errTotal';
            }
            return 'ok';
        }else{
            $voteNum.css({color: 'red'});
            return 'errVote';
        }
    } else {
        $voteNum.css({color: 'red'});
        return 'errVote';
    }
}

function noAim() {
    var $voteAim = $('#voteAim');
    var voteAim = $.trim($voteAim.val());
    return voteAim == '';
}

$(function () {
    $('.radioLable').click(function () {
        var model = $(this).find('input').val();
        $.get('/WX/vote/model', {model: model}, function (data) {
            $('#priceShow').val('￥ ' + data.price + '/个');
            $('#price').val(data.price);
            checkReadLike();
        })
    });

    $('#address').change(function () {
        isAddress(function(err) {});
    });

    $('#voteNum').keyup(function () {
        checkReadLike();
    }).blur(function () {
        var result = checkReadLike();
        if (result != 'ok') {
            switch (result){
                case 'errTotal':
                    layer.tips('账户余额不足，请充值!', '#total', {
                        tips: [1, '#f00'],
                        time: 4000
                    });
                    break;
                case 'errVote':
                    layer.tips('投票数必须是正整数，且不小于100!', '#voteNum', {
                        tips: [1, '#f00'],
                        time: 4000
                    });
                    break;
            }
        }
    });

    $('#voteAim').blur(function () {
        if (noAim()) {
            layer.tips('投票选手不能为空!', '#voteAim', {
                tips: [1, '#f00'],
                time: 4000
            });
        }
    });

    $('#commit').click(function (e) {
        isAddress(function(err) {
            if(err) {
                e.stopPropagation();
                e.preventDefault();
                return ;
            }

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
                    case 'errVote':
                        layer.tips('投票数必须是正整数，且不小于100!', '#voteNum', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                        break;
                }
                return ;
            }

            if(noAim()) {
                e.stopPropagation();
                e.preventDefault();
                layer.tips('投票选手不能为空!', '#voteAim', {
                    tips: [1, '#f00'],
                    time: 4000
                });
            }
        })
    })
});