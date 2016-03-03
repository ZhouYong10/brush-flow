/**
 * Created by ubuntu64 on 3/3/16.
 */
$(function () {
    $.get('/admin/update/header/nav', function (obj) {
        console.log(obj);
    });


    var socket = io();

    console.log(socket, '===============');
});

function updateNav(obj) {

}