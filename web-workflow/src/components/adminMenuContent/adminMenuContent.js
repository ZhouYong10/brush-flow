/**
 * Created by ubuntu64 on 3/3/16.
 */
$(function () {
    $.get('/admin/update/header/nav', function (obj) {
        updateNav(obj);
    });

    var socket = io();
    socket.on('updateNav', function(obj) {
        updateNav(obj, true);
    })
});

function updateNav(obj, isAdd) {
    for(var key in obj) {
        if(isAdd) {
            obj[key] = parseInt(obj[key]) + parseInt($('.updateNum.' + key).text().split(' ')[2]);
        }
        if(obj[key] > 0) {
            $('.tips.' + key).css('display', 'inline');
        }else {
            $('.tips.' + key).css('display', 'none');
        }
        $('.updateNum.' + key).text(' ( ' + obj[key] + ' ) ');
    }
}