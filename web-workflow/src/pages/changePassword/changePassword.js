/**
 * Created by zhouyong10 on 2/18/16.
 */
function oldPwd() {
    var $oldPwd = $('#oldPwd');
    var oldPwd = $oldPwd.val().trim();
    if(oldPwd == ''){
        layer.tips('不能为空！', '#oldPwd', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }else{
        return true;
    }
}

function newPwd() {
    var $newPwd = $('#newPwd');
    var newPwd = $newPwd.val().trim();
    if(newPwd == ''){
        layer.tips('不能为空！', '#newPwd', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }else{
        return true;
    }
}

function rNewPwd() {
    var newPwd = $('#newPwd').val().trim();
    var $rNewPwd = $('#rNewPwd');
    var rNewPwd = $rNewPwd.val().trim();
    if(newPwd != rNewPwd){
        layer.tips('两次输入的密码不一致！', '#rNewPwd', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }else{
        return true;
    }
}


$(function () {
    $('#oldPwd').blur(function () {
        oldPwd();
    });

    $('#newPwd').blur(function () {
        newPwd();
    });

    $('#rNewPwd').blur(function () {
        rNewPwd();
    });

    $('#commit').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(oldPwd() && newPwd() && rNewPwd()){
            $.post('/user/changePwd', {
                oldpwd: $('#oldPwd').val(),
                newpwd: $('#newPwd').val(),
                repeatpwd: $('#rNewPwd').val()
            }).then(function(data) {
                if(data.isOK) {
                    $('<a href="' + data.url + '" ></a>').get(0).click();
                }else{
                    layer.msg(data.info);
                }
            });
        }
    })
});