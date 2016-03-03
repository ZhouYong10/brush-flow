/**
 * Created by ubuntu64 on 3/3/16.
 */
$(function () {
    $.get('/admin/update/header/nav', function (obj) {
        updateNav(obj);
    });

    var socket = io();
    socket.on('updateNav', function(obj) {
        updateNav(obj);
    })
});

function updateNav(obj) {
    for(var key in obj) {
        if(obj[key] > 0) {
            $('.tips.' + key).css('display', 'inline');
            $('.updateNum.' + key).text(' ( ' + obj[key] + ' ) ');
        }else {
            $('.tips.' + key).css('display', 'none');
        }
    }
}