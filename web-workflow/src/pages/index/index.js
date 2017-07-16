/**
 * Created by Administrator on 2015/12/21.
 */
$(function () {
    var loginInfo = Cookies.get('loginInfo');
    if (loginInfo) {
        $.post('/login', JSON.parse(Cookies.get('loginInfo'))).then(function (data) {
            if (data.isOK) {
                location.href = data.path;
            } else {
                layer.msg(data.message);
            }
        });
    }

    $('#changeImg').click(function () {
        $(this).attr({src: '/securityImg?' + new Date().getTime()})
    });

    $('#commit').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $username = $('#username');
        var $password = $('#password');
        var $checkCode = $('#checkCode');
        var username = $username.val().trim();
        var password = $password.val().trim();
        var checkCode = $checkCode.val().trim();
        var saveMe = $('#saveMe').prop('checked');
        if (username == '') {
            layer.tips('请输入用户名!', '#username', {
                tips: [1, '#f00'],
                time: 4000
            });
            return;
        }
        if (password == '') {
            layer.tips('请输入密码!', '#password', {
                tips: [1, '#f00'],
                time: 4000
            });
            return;
        }
        if (checkCode == '' || checkCode.length != 4) {
            layer.tips('请输入４位验证码!', '#checkCode', {
                tips: [1, '#f00'],
                time: 4000
            });
            return;
        }
        if (saveMe) {
            Cookies.set('loginInfo', {
                username: username,
                password: password,
                isAuto: true
            }, {expires: 14, path: '/'});
        }
        $.post('/login', {
            username: username,
            password: password,
            securityCode: checkCode
        }).then(function (data) {
            if (data.isOK) {
                location.href = data.path;
            } else {
                layer.msg(data.message);
            }
        });
    })
});
