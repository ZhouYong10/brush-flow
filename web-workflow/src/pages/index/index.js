/**
 * Created by Administrator on 2015/12/21.
 */
$(function () {
    var loginInfo = Cookies.get('loginInfo');
    if (loginInfo) {
        $.post('/login', JSON.parse(loginInfo)).then(function (data) {
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

    // 我要注册
    $('#btnLogup').click(function () {
        // 隐藏登陆按钮，我要注册按钮
        $('#usernameWrap').css("display", "none");
        $('#commitWrap').css("display", "none");
        $('#btnLogup').css("display", "none");

        // 显示重复密码框，我要登陆按钮，注册按钮
        $('#logupUsernameWrap').css("display", "block");
        $('#repasswordWrap').css("display", "block");
        $('#btnLogin').css("display", "inline-block");
        $('#logupWrap').css("display", "block");


    });

    // 我要登陆
    $('#btnLogin').click(function () {
        // 显示登陆按钮，我要注册按钮
        $('#usernameWrap').css("display", "block");
        $('#commitWrap').css("display", "block");
        $('#btnLogup').css("display", "inline-block");

        // 隐藏重复密码框，我要登陆按钮，注册按钮
        $('#logupUsernameWrap').css("display", "none");
        $('#repasswordWrap').css("display", "none");
        $('#btnLogin').css("display", "none");
        $('#logupWrap').css("display", "none");
    });

    //提交登陆
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

    function userName($userName) {
        return new Promise(function (resolve) {
            var userName = $userName.val().trim();
            if(userName == ''){
                layer.tips('用户名不能为空!', '#logupUsername', {
                    tips: [1, '#f00'],
                    time: 4000
                });
            }else{
                $.post('/username/notrepeat', {username: userName})
                    .then(function (data) {
                        if(data.notRepeat) {
                            $userName.css({color: 'green'});
                            resolve();
                        }else{
                            $userName.css({color: 'red'});
                            layer.tips('该用户名已经存在!', '#logupUsername', {
                                tips: [1, '#f00'],
                                time: 4000
                            });
                        }
                    });
            }
        });
    }

    //验证注册名是否已经存在
    $('#logupUsername').blur(function () {
        userName($(this));
    });

    //验证两次输入的密码是否一致
    $('#repassword').blur(function () {
        var $repassword = $(this);
        var password = $('#password').val();
        var repassword = $repassword.val();

        if(password != repassword) {
            layer.tips('两次输入的密码不一致!', '#repassword', {
                tips: [1, '#f00'],
                time: 4000
            });
        }
    });

    //提交注册
    $('#logup').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $logupUsername = $('#logupUsername');
        var $password = $('#password');
        var $repassword = $('#repassword');
        var $checkCode = $('#checkCode');

        var username = $logupUsername.val().trim();
        var password = $password.val();
        var repassword = $repassword.val();
        var checkCode = $checkCode.val().trim();

        var saveMe = $('#saveMe').prop('checked');

        userName($logupUsername).then(function () {
            if (password == '') {
                layer.tips('密码不能为空!', '#password', {
                    tips: [1, '#f00'],
                    time: 4000
                });
                return;
            }

            if(password != repassword) {
                layer.tips('两次输入的密码不一致!', '#repassword', {
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


        });




        // $.post('/login', {
        //     username: username,
        //     password: password,
        //     securityCode: checkCode
        // }).then(function (data) {
        //     if (data.isOK) {
        //         location.href = data.path;
        //     } else {
        //         layer.msg(data.message);
        //     }
        // });
    })


    if(location.search) {
        console.log(location.search, '===================');
        $('#btnLogup').click();
    }else {
        $('#btnLogin').click();
    }
});
