/**
 * Created by zhouyong10 on 6/3/16.
 */
$(function () {
    console.log($('.navTips').length, '======================');
    if($('.navTips').length) {
        $.get('/user/update/header/nav', function (obj) {
            console.log(obj, '======================');
            navUpdateNum(obj);
        });

        var socket = io();
        socket.on('navUpdateNum', function (obj) {
            navUpdateNum(obj, true);
        });
    }
});

function navUpdateNum(obj, isAdd) {
    for(var key in obj) {
        if(isAdd) {
            obj[key] = parseInt(obj[key]) + parseInt($('.navUpdateNum.' + key).text().split(' ')[2]);
        }
        if(obj[key] > 0) {
            $('.navTips.' + key).css('display', 'inline');
        }else {
            $('.navTips.' + key).css('display', 'none');
        }
        $('.navUpdateNum.' + key).text(' ( ' + obj[key] + ' ) ');
    }
}