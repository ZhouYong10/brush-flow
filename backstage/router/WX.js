/**
 * Created by zhouyong10 on 1/24/16.
 */

var User = require('../models/User');
var Product = require('../models/Product');
var Order = require('../models/Order');

var moment = require('moment');
var Formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Address = require('../models/Address');
var router = require('express').Router();

Object.defineProperty(global, 'codeDir', {
    value: path.join(__dirname, '../public/codes/'),
    writable: false,
    configurable: false
});

router.get('/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'friend'
            }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('WXfriend', {
                        title: '公众粉丝(1000以上)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/friend'
                    })
                })
        });
});

router.get('/account/search/friend', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'friend',
                    account: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function(obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXfriend', {
                        title: '公众粉丝(1000以上)',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/friend'
                    })
                })
        });
});

router.get('/friend/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'friend'})
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    Order.getRandomStr(req).then(function(orderFlag) {
                        res.render('WXfriendAdd', {
                            title: '添加公众粉丝(1000以上)',
                            money: user.funds,
                            username: user.username,
                            userStatus: user.status,
                            role: user.role,
                            price: myPrice,
                            orderFlag: orderFlag
                        })
                    })
                });
        });
});

router.post('/friend/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.account){
        return res.send('<h1>微信公众平台账号或ID不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 1000) {
        return res.send('<h1>需要添加的粉丝数量不能为空,且必须是正整数， 最低1000起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }

    orderInfo.account = orderInfo.account.replace(/(^\s*)|(\s*$)/g, "");
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.checkRandomStr(req).then(function() {
                order.createAndSave(user, {type: 'wx', smallType: 'friend'})
                    .then(function () {
                        socketIO.emit('updateNav', {'wxFriend': 1});
                        res.redirect('/WX/friend');
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！!</h1>')
                    });
            }, function(msg) {
                res.redirect('/WX/friend');
            })
        });
});

router.get('/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'fans'
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('WXfans', {
                        title: '微信粉丝',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/fans'
                    })
                });
        });
});

router.post('/account/search/fans', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'fans',
                    account: req.body.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXfans', {
                        title: '微信粉丝',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/fans'
                    })
                });
        });
});

router.get('/fans/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'fans'})
                .then(function(fans) {
                    var fansIns = Product.wrapToInstance(fans);
                    var myFansPrice = fansIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'fansReply'})
                        .then(function(reply) {
                            var replyIns = Product.wrapToInstance(reply);
                            var myReplyPrice = replyIns.getPriceByRole(user.role);
                            Order.getRandomStr(req).then(function(orderFlag) {
                                res.render('WXfansAdd', {
                                    title: '添加微信粉丝',
                                    money: user.funds,
                                    username: user.username,
                                    userStatus: user.status,
                                    role: user.role,
                                    fansPrice: myFansPrice,
                                    replyPrice: myReplyPrice,
                                    orderFlag: orderFlag
                                });
                            })
                        });
                });
        });
});

router.post('/fans/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.account){
        return res.send('<h1>微信公众平台账号或ID不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 100) {
        return res.send('<h1>需要添加的粉丝数量不能为空,且必须是正整数， 最低100起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }

    orderInfo.account = orderInfo.account.replace(/(^\s*)|(\s*$)/g, "");
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.checkRandomStr(req).then(function() {
                order.createAndSave(user, {type: 'wx', smallType: 'fans'})
                    .then(function () {
                        socketIO.emit('updateNav', {'wxReply': 1});
                        res.redirect('/WX/fans');
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }, function(msg) {
                res.redirect('/WX/fans');
            })
        });
});

router.get('/share', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: {$in: ['article', 'share', 'collect']}
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXshare', {
                        title: '微信原文/分享/收藏',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/share'
                    });
                });
        });
});

router.get('/account/search/share', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: {$in: ['article', 'share', 'collect']},
                    address: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXshare', {
                        title: '微信原文/分享/收藏',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/share'
                    });
                });
        });
});

router.get('/share/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.getRandomStr(req).then(function(orderFlag) {
                res.render('WXshareAdd', {
                    title: '添加微信原文/分享/收藏任务',
                    money: user.funds,
                    username: user.username,
                    userStatus: user.status,
                    role: user.role,
                    orderFlag: orderFlag
                });
            })
        });
});

router.post('/share/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.smallType){
        return res.send('<h1>需要提交的任务类型不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.address){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 30) {
        return res.send('<h1>需要添加的粉丝数量不能为空,且必须是正整数， 最低30起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }

    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.checkRandomStr(req).then(function() {
                order.createAndSave(user, {type: 'wx', smallType: orderInfo.smallType})
                    .then(function () {
                        socketIO.emit('updateNav', {'wxArticle': 1});
                        res.redirect('/WX/share');
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }, function(msg) {
                res.redirect('/WX/share');
            })
        });
});

router.get('/get/price/by/type', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: req.query.type})
                .then(function(result) {
                    var productIns = Product.wrapToInstance(result);
                    var myPrice = productIns.getPriceByRole(user.role);
                    res.send({price: myPrice});
                });
        });
});

router.get('/dianzan', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'likeQuick'
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXdianzan', {
                        title: '微信-文章点赞',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/dianzan'
                    })
                });
        });
});

router.post('/account/search/dianzan', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: 'likeQuick',
                address: req.body.account
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXdianzan', {
                        title: '微信-文章点赞',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/dianzan'
                    })
                });
        });
});

router.get('/dianzan/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'likeQuick'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myDianzanPrice = readIns.getPriceByRole(user.role);
                    Order.getRandomStr(req).then(function(orderFlag) {
                        res.render('WXdianzanAdd', {
                            title: '添加微信文章点赞',
                            money: user.funds,
                            username: user.username,
                            userStatus: user.status,
                            role: user.role,
                            price: myDianzanPrice,
                            orderFlag: orderFlag
                        });
                    })
                });
        });
});

router.post('/dianzan/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.address){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo.num < 100 || orderInfo.num >25000) {
        return res.send('<h1>点赞数量不能为空,且必须是正整数，最低100起，最高25000.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    orderInfo.num = parseInt(orderInfo.num);
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            socketIO.emit('updateNav', {'wxDianzan': 1});
            var order = Order.wrapToInstance(orderInfo);
            if(orderInfo.orderFlag) {
                order.checkRandomStr(req).then(function() {
                    order.createAndSave(user, {type: 'wx', smallType: 'likeQuick'})
                        .then(function () {
                            res.redirect('/WX/dianzan');
                        }, function() {
                            res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                        });
                }, function(msg) {
                    res.redirect('/WX/dianzan');
                })
            }else {
                order.createAndSave(user, {type: 'wx', smallType: 'likeQuick'})
                    .then(function (result) {
                        res.send({funds: result.funds, msg: '提交成功！'});
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }
        });
});


router.get('/vote', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: {$in: ['vote','fansVote']}
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 1);
                    res.render('WXvote', {
                        title: '微信投票',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/vote'
                    })
                });
        });
});

router.post('/account/search/vote', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: {$in: ['vote','fansVote']},
                address: req.body.account
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXvote', {
                        title: '微信投票',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/vote'
                    })
                });
        });
});

router.get('/vote/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'vote'})
                .then(function(vote) {
                    var voteIns = Product.wrapToInstance(vote);
                    var myVotePrice = voteIns.getPriceByRole(user.role);
                    Order.getRandomStr(req).then(function(orderFlag) {
                        res.render('WXvoteAdd', {
                            title: '添加微信投票任务',
                            money: user.funds,
                            username: user.username,
                            userStatus: user.status,
                            role: user.role,
                            price: myVotePrice,
                            orderFlag: orderFlag
                        });
                    })
                });
        });
});

router.get('/vote/model', function (req, res) {
    var model = req.query.model;
    var voteType;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            if (model == 'normal') {
                voteType = 'vote';
            } else {
                voteType = 'fansVote';
            }
            Product.open().findOne({type: 'wx', smallType: voteType})
                .then(function (vote) {
                    var voteIns = Product.wrapToInstance(vote);
                    var myVotePrice = voteIns.getPriceByRole(user.role);
                    res.send({
                        price: myVotePrice
                    });
                });
        });
});

router.post('/vote/add', function (req, res) {
    var orderInfo = req.body;
    var voteType;
    if(!orderInfo.address){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 10) {
        return res.send('<h1>需要添加的投票数量不能为空,且必须是正整数， 最低10起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    orderInfo.num = parseInt(orderInfo.num);
    if (orderInfo.model == 'normal') {
        voteType = 'vote';
        socketIO.emit('updateNav', {'wxVote': 1});
    } else {
        voteType = 'fansVote';
        socketIO.emit('updateNav', {'wxVote': 1});
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            if(orderInfo.orderFlag) {
                order.checkRandomStr(req).then(function() {
                    order.createAndSave(user, {type: 'wx', smallType: voteType})
                        .then(function () {
                            res.redirect('/WX/vote');
                        }, function() {
                            res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                        });
                }, function(msg) {
                    res.redirect('/WX/vote');
                })
            }else {
                order.createAndSave(user, {type: 'wx', smallType: voteType})
                    .then(function (result) {
                        res.send({funds: result.funds, msg: '提交成功！'});
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }
        });
});



router.get('/like', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                userId: user._id,
                type: 'wx',
                smallType: {$in: ['read','readQuick']}
            }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXlike', {
                        title: '微信阅读',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like'
                    })
                });
        });
});

router.post('/account/search/like', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: {$in: ['read','readQuick']},
                    address: req.body.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXlike', {
                        title: '微信阅读',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like'
                    })
                });
        });
});

router.get('/like/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'read'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'like'})
                        .then(function(like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            Order.getRandomStr(req).then(function(orderFlag) {
                                res.render('WXlikeAdd', {
                                    title: '添加微信阅读',
                                    money: user.funds,
                                    username: user.username,
                                    userStatus: user.status,
                                    role: user.role,
                                    price: myReadPrice,
                                    price2: myLikePrice,
                                    orderFlag: orderFlag
                                });
                            })
                        });
                });
        });
});

router.get('/like/model', function (req, res) {
    var model = req.query.model;
    var readType, likeType;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            if (model == 'normal') {
                readType = 'read';
                likeType = 'like';
            } else {
                readType = 'readQuick';
                likeType = 'likeQuick';
            }
            Product.open().findOne({type: 'wx', smallType: readType})
                .then(function (read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: likeType})
                        .then(function (like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            res.send({
                                price: myReadPrice,
                                price2: myLikePrice
                            });
                        });
                });
        });
});

router.post('/like/add', function (req, res) {
    var orderInfo = req.body;
    var readType, likeType;
    if(!orderInfo.address){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 500) {
        return res.send('<h1>需要添加的粉丝数量不能为空,且必须是正整数， 最低500起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(orderInfo.num2 && orderInfo.num2 > (orderInfo.num *0.5/100)) {
        return res.send('<h1>点赞数量必须为正整数,且不能大于阅读数量的0.5%!.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    orderInfo.num = parseInt(orderInfo.num);
    if(orderInfo.num2 == ''){
        //orderInfo.num2 = parseInt(orderInfo.num * 5 / 1000);
        orderInfo.num2 = 0;
    }
    if (orderInfo.model == 'normal') {
        readType = 'read';
        likeType = 'like';
        socketIO.emit('updateNav', {'wxLike': 1});
    } else {
        readType = 'readQuick';
        likeType = 'likeQuick';
        socketIO.emit('updateNav', {'wxLikeQuick': 1});
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            if(orderInfo.orderFlag) {
                order.checkRandomStr(req).then(function() {
                    order.createAndSaveTwo(user, {type: 'wx', smallType: readType}, {type: 'wx', smallType: likeType})
                        .then(function () {
                            res.redirect('/WX/like');
                        }, function() {
                            res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                        });
                }, function(msg) {
                    res.redirect('/WX/like');
                })
            }else {
                order.createAndSaveTwo(user, {type: 'wx', smallType: readType}, {type: 'wx', smallType: likeType})
                    .then(function (result) {
                        res.send({funds: result.funds, msg: '提交成功！'});
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }
        });
});

router.get('/like/bulk/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'read'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'like'})
                        .then(function(like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            Order.getRandomStr(req).then(function(orderFlag) {
                                res.render('WXlikeBulkAdd', {
                                    title: '批量添加微信图文阅读点赞任务',
                                    money: user.funds,
                                    username: user.username,
                                    userStatus: user.status,
                                    role: user.role,
                                    price: myReadPrice,
                                    price2: myLikePrice,
                                    orderFlag: orderFlag
                                });
                            })
                        });
                });
        });
});

router.get('/order/quit', function(req, res) {
    Order.open().findById(req.query.id).then(function(order) {
        if(order.status == '执行中'){
            Order.open().updateById(order._id, {$set: {isQuit: true}});
            socketIO.emit('updateNav', {'wxLikeQuit': 1});
            res.send('撤单中');
        }else{
            res.send('该订单不在执行中，不能执行撤单操作！');
        }
    })
})




router.get('/like/quick', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'readQuick',
                    quick: true
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 250);
                    res.render('WXlikeQuick', {
                        title: '图文阅读/点赞快速任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like/quick'
                    })
                });
        });
});

router.get('/account/search/like/quick', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'readQuick',
                    quick: true,
                    address: req.query.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 100);
                    res.render('WXlikeQuick', {
                        title: '图文阅读/点赞快速任务',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/like/quick'
                    })
                });
        });
});

router.get('/like/quick/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'readQuick'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'likeQuick'})
                        .then(function(like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            Order.getRandomStr(req).then(function(orderFlag) {
                                res.render('WXlikeQuickAdd', {
                                    title: '添加微信图文阅读点赞快速任务',
                                    money: user.funds,
                                    username: user.username,
                                    userStatus: user.status,
                                    role: user.role,
                                    price: myReadPrice,
                                    price2: myLikePrice,
                                    orderFlag: orderFlag
                                });
                            })
                        });
                });
        });
});

router.post('/like/quick/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.address){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.num || !/^[0-9]*[1-9][0-9]*$/.test(orderInfo.num) || orderInfo < 500) {
        return res.send('<h1>需要添加的粉丝数量不能为空,且必须是正整数， 最低500起.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(orderInfo.num2 && orderInfo.num2 > (orderInfo.num*0.5/100)) {
        return res.send('<h1>点赞数量必须为正整数,且不能大于阅读数量的0.5%!.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }

    orderInfo.quick = true;
    orderInfo.num = parseInt(orderInfo.num);
    if(orderInfo.num2 == ''){
        //orderInfo.num2 = parseInt(orderInfo.num * 5 / 1000);
        orderInfo.num2 = 0;
    }

    Address.parseWxTitle(orderInfo.address)
        .then(function (obj) {
            orderInfo.title = obj.title;
            User.open().findById(req.session.passport.user)
                .then(function (user) {
                    var order = Order.wrapToInstance(orderInfo);
                    if(orderInfo.orderFlag) {
                        order.checkRandomStr(req).then(function() {
                            order.createAndSaveTwo(user, {type: 'wx', smallType: 'readQuick'}, {type: 'wx', smallType: 'likeQuick'})
                                .then(function () {
                                    socketIO.emit('updateNav', {'wxLikeQuick': 1});
                                    res.redirect('/WX/like/quick');
                                }, function() {
                                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                                });
                        }, function(msg) {
                            res.redirect('/WX/like/quick');
                        })
                    }else {
                        order.createAndSaveTwo(user, {type: 'wx', smallType: 'readQuick'}, {type: 'wx', smallType: 'likeQuick'})
                            .then(function (result) {
                                socketIO.emit('updateNav', {'wxLikeQuick': 1});
                                res.send({funds: result.funds, msg: '提交成功！'});
                            }, function() {
                                res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                            });
                    }
                });
        });
});

router.get('/like/quick/bulk/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'readQuick'})
                .then(function(read) {
                    var readIns = Product.wrapToInstance(read);
                    var myReadPrice = readIns.getPriceByRole(user.role);
                    Product.open().findOne({type: 'wx', smallType: 'likeQuick'})
                        .then(function(like) {
                            var likeIns = Product.wrapToInstance(like);
                            var myLikePrice = likeIns.getPriceByRole(user.role);
                            Order.getRandomStr(req).then(function(orderFlag) {
                                res.render('WXlikeQuickBulkAdd', {
                                    title: '批量添加微信图文阅读点赞快速任务',
                                    money: user.funds,
                                    username: user.username,
                                    userStatus: user.status,
                                    role: user.role,
                                    price: myReadPrice,
                                    price2: myLikePrice,
                                    orderFlag: orderFlag
                                });
                            })
                        });
                });
        });
});




router.get('/read/check', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            res.render('WXreadCheck', {
                title: '微信阅读查询',
                money: user.funds,
                username: user.username,
                userStatus: user.status,
                role: user.role
            })
        });
});

router.get('/check/read/num', function (req, res) {
    Address.readNum(req.query.address).then(function (num) {
        User.open().findById(req.session.passport.user)
            .then(function (user) {
                var nowFunds = (user.funds - 0.01).toFixed(4);
                User.open().updateById(user._id, {$set: {
                    funds: nowFunds
                }}).then(function() {
                    res.send({
                        isOk: true,
                        num: num,
                        funds: nowFunds
                    });
                })
            });
    }, function (msg) {
        res.send({
            isOk: false,
            msg: msg
        });
    });
});



router.get('/comment', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'comment'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 0.5);
                    res.render('WXcomment', {
                        title: '微信/图文评论',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/comment'
                    })
                });
        });
});

router.get('/comment/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'comment'})
                .then(function(comment) {
                    var commentIns = Product.wrapToInstance(comment);
                    var myCommentPrice = commentIns.getPriceByRole(user.role);
                    Order.getRandomStr(req).then(function(orderFlag) {
                        res.render('WXcommentAdd', {
                            title: '添加微信图文评论任务',
                            money: user.funds,
                            username: user.username,
                            userStatus: user.status,
                            role: user.role,
                            price: myCommentPrice,
                            orderFlag: orderFlag
                        });
                    })
                });
        });
});

router.get('/comment/model', function (req, res) {
    var smallType = req.query.model;
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: smallType})
                .then(function (commentType) {
                    var commentTypeIns = Product.wrapToInstance(commentType);
                    var myCommentPrice = commentTypeIns.getPriceByRole(user.role);
                    res.send({
                        price: myCommentPrice
                    });
                });
        });
});

// { orderFlag: 'ksgbupk181fko6r',
//     model: 'comment',
//     address: 'https://mp.weixin.qq.com/s/DJWrgTgRuCCbe7sdggOPQw',
//     title: '哈里王子大婚，各品牌上演蹭热点大戏，可以说是非常有趣了',
//     content: '航空喊口号\r\n很快很快\r\n航空喊口号\r\n好看好看好看\r\n航空喊口号\r\n很快快更公开' }

router.post('/comment/add', function (req, res) {
    var orderInfo = req.body;
    if(!orderInfo.address || orderInfo.address.replace(/(^\s*)|(\s*$)/g, "") == ''){
        return res.send('<h1>任务地址不能为空不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    if(!orderInfo.content || orderInfo.content.replace(/(^\s*)|(\s*$)/g, "") == '') {
        return res.send('<h1>评论内容不能为空.请不要跳过前端验证,如果是浏览器兼容性不好导致前端验证失效，推荐使用谷歌浏览器！！！</h1>');
    }
    var contents = orderInfo.content.split('\n');
    orderInfo.num = 0;
    for(var i = 0; i < contents.length; i++) {
        var comment = contents[i].replace(/(^\s*)|(\s*$)/g, "");
        if(comment != ''){
            orderInfo.num += 1;
        }
    }
    if(orderInfo.num < 5) {
        orderInfo.num = 5;
    }
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            var order = Order.wrapToInstance(orderInfo);
            order.checkRandomStr(req).then(function() {
                order.createAndSave(user, {type: 'wx', smallType: orderInfo.model})
                    .then(function () {
                        socketIO.emit('updateNav', {'wxComment': 1});
                        res.redirect('/WX/comment');
                    }, function() {
                        res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                    });
            }, function(msg) {
                res.redirect('/WX/comment');
            })
        });
});

router.post('/account/search/comment', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'comment',
                    address: req.body.account
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results);
                    res.render('WXcomment', {
                        title: '微信/图文评论',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/comment'
                    })
                });
        });
});



router.get('/code', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'code'
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 50);
                    res.render('WXcode', {
                        title: '扫码关注',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/code'
                    })
                });
        });
});

router.post('/date/search/code', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Order.open().findPages({
                    userId: user._id,
                    type: 'wx',
                    smallType: 'code',
                    createTime: new RegExp(req.body.createTime)
                }, (req.query.page ? req.query.page : 1))
                .then(function (obj) {
                    Order.addSchedule(obj.results, 10);
                    res.render('WXcode', {
                        title: '扫码关注',
                        money: user.funds,
                        username: user.username,
                        userStatus: user.status,
                        role: user.role,
                        orders: obj.results,
                        pages: obj.pages,
                        path: '/WX/code'
                    })
                });
        });
});

router.get('/code/add', function (req, res) {
    User.open().findById(req.session.passport.user)
        .then(function (user) {
            Product.open().findOne({type: 'wx', smallType: 'code'})
                .then(function(fans) {
                    var fansIns = Product.wrapToInstance(fans);
                    var myFansPrice = fansIns.getPriceByRole(user.role);
                    Order.getRandomStr(req).then(function(orderFlag) {
                        res.render('WXcodeAdd', {
                            title: '添加扫码关注任务',
                            money: user.funds,
                            username: user.username,
                            userStatus: user.status,
                            role: user.role,
                            fansPrice: myFansPrice,
                            orderFlag: orderFlag
                        });
                    })
                });
        });
});

router.post('/code/add', function (req, res) {
    var order = {};
    var form = new Formidable.IncomingForm();
    form.maxFieldsSize = 1024 * 1024;
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.hash = 'md5';
    var logoDir = form.uploadDir = global.codeDir;

    if(!fs.existsSync(logoDir)){
        fs.mkdirSync(logoDir);
    }
    form.on('error', function(err) {
            res.end(err); //各种错误
        }).on('field', function(field, value) {
            order[field] = value;
        }).on('file', function(field, file) { //上传文件
            var filePath = file.path;
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            var newFileName = file.hash + fileExt;
            var newFilePath = path.join(logoDir + newFileName);
            fs.rename(filePath, newFilePath, function (err) {
                order[field] = '/codes/' + newFileName;
                User.open().findById(req.session.passport.user)
                    .then(function (user) {
                        var orderIns = Order.wrapToInstance(order);
                        orderIns.checkRandomStr(req).then(function() {
                            orderIns.createAndSave(user, {type: 'wx', smallType: 'code'})
                                .then(function () {
                                    socketIO.emit('updateNav', {'wxCode': 1});
                                    res.redirect('/WX/code');
                                }, function() {
                                    res.send('<h1>您的余额不足，请充值！ 顺便多说一句，请不要跳过页面非法提交数据。。。不要以为我不知道哦！！</h1>')
                                });
                        }, function(msg) {
                            res.redirect('/WX/code');
                        })
                    });
            });
        });
    form.parse(req);
});

module.exports = router;