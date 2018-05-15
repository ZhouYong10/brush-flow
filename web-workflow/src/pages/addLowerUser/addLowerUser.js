var Utils = require('utils');

function userName() {
    return new Promise(function (resolve) {
        var $userName = $('#userName');
        var userName = $userName.val().trim();
        if(userName == ''){
            layer.tips('用户名不能为空!', '#userName', {
                tips: [1, '#f00'],
                time: 4000
            });
        }else{
            $.post('/user/username/notrepeat', {username: userName})
                .then(function (data) {
                    if(data.notRepeat) {
                        $userName.css({color: 'green'});
                        resolve();
                    }else{
                        $userName.css({color: 'red'});
                        layer.tips('该用户名已经存在!', '#userName', {
                            tips: [1, '#f00'],
                            time: 4000
                        });
                    }
                });
        }
    });
}

function password() {
    var $password = $('#password');
    var password = $password.val().trim();
    if(password == ''){
        layer.tips('密码不能为空！', '#password', {
            tips: [1, '#f00'],
            time: 4000
        });
        return false;
    }else{
        return true;
    }
}

$(function () {
    Utils.clipboard();

    $('#userName').blur(function () {
        userName();
    });

    $('#password').blur(function () {
        password();
    });

    $('#commit').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        userName().then(function () {
            if (password()) {
                $.post('/user/addLowerUser', {
                    username: $('#userName').val(),
                    password: $('#password').val(),
                    qq: $('#qq').val(),
                    phone: $('#phone').val(),
                    remark: $('#remark').val()
                }).then(function (data) {
                        if(data.isOK) {
                            $('<a href="' + data.url + '" ></a>').get(0).click();
                        }else{
                            layer.msg(data.info);
                        }
                    });
            }
        })
    })
});