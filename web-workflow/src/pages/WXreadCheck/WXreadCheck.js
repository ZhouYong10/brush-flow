/**
 * Created by ubuntu64 on 3/25/16.
 */
$(function () {
    $('#checkButton').click(function () {
        var address = $('#address').val();
        $.get('/WX/check/read/num', {address: address}, function (data) {
            if (data.isOk) {
                $('#msg').html('文章当前阅读量为：　<strong style="color: red;">' + data.num + '</strong>');
                $('.userCash').text(data.funds);
            } else {
                $('#msg').text(data.msg);
            }
        })
    })
});