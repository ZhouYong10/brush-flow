/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var User = require('./User');
var Product = require('./Product');
var Profit = require('./Profit');
var request = require('request');
var cheerio = require('cheerio');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
var moment = require('moment');


var Order = new Class();


Order.extend(db);

Order.open = function() {
    return Order.openCollection('Order');
};

/*
 * wx read and like
 * */
var post_key = '';
var firstItemId = '';
var task_time = 1000 * 20;
var wxReadIsOpen = 'no';
var cookieInfo ;
var valIndex ;

function startInterval() {
    var random = (Math.random() / 3 * 100).toFixed(0);
    task_time = random >= 5 ? random * 1000 : 5 * 1000;
    return setInterval(function() {
        noKey(clearTime);
    }, task_time);
}

function clearTime() {
    clearInterval(valIndex);
    valIndex = startInterval();
}

function noKey(callback) {
    request.get({
        url:'http://120.25.203.122/tuike_sys.php',
        headers:{
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate, sdch',
            "Accept-Language": 'zh-CN,zh;q=0.8',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Cookie": cookieInfo,
            "Host": '120.25.203.122',
            "Referer": 'http://120.25.203.122/login.html',
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
        }
    },function(err,res,body){
        if(err) {
            return console.log(err);
        }
        var $ = cheerio.load(body);
        post_key = $('#post_key').val();
        firstItemId = $('tbody').last().children().children().first().text().split('/')[0];
        yesKey(callback);
    });
}

function yesKey(callback) {
    var forwardNum = global.forwardNum ? global.forwardNum : 5000;
    Order.open().findOne({
        status: '未处理',
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        num: {$gt: forwardNum}
    }).then(function (result) {
        if (result) {
            request.post({
                url:'http://120.25.203.122/tuike_sys.php',
                headers:{
                    "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    "Accept-Encoding": 'gzip, deflate, sdch',
                    "Accept-Language": 'zh-CN,zh;q=0.8',
                    "Cache-Control": 'max-age=0',
                    "Connection": 'keep-alive',
                    "Cookie": cookieInfo,
                    "Host": '120.25.203.122',
                    "Referer": 'http://120.25.203.122/tuike_sys.php',
                    "Upgrade-Insecure-Requests": 1,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
                },
                formData: {
                    url: result.address,
                    speed: result.speed ? result.speed : 167,
                    read_cnt: result.num,
                    post_key: post_key,
                    like_cnt: result.num2 ? result.num2 : 0,
                    like: (result.num2 / result.num).toFixed(3)
                }
            },function(err,res,body){
                if(err) {
                    return console.log(err);
                }
                var $ = cheerio.load(body);
                var secondItemId = $('tbody').last().children().next().children().first().text().split('/')[0];
                if(secondItemId == firstItemId) {
                    var resultInstance = Order.wrapToInstance(result);
                    resultInstance.remote = 'tuike';
                    resultInstance.complete(function() {
                        console.log('自动处理订单完成了, href = ' + result.address);
                        callback();
                    })
                }
            });
        }else {
            callback();
        }
    });
}


/*
* wx fans
* */
var wxFansCookieInfo ;
var wxSetIntIndex ;
var wxFansIsOpen = 'no';

function startFans() {
    return setInterval(function() {
        Order.open().findOne({
            status: '未处理',
            type: 'wx',
            smallType: {$in: ['friend', 'fans']},
            isWait: undefined
        }).then(function(result) {
            if(result) {
                commitFans(result);
            }else {
                Order.open().findOne({
                    status: '未处理',
                    type: 'wx',
                    smallType: {$in: ['friend', 'fans']},
                    isWait: 'wait'
                }).then(function (result) {
                    if (result) {
                        commitFans(result);
                    } else {
                        freshFansCookie();
                    }
                });
            }
        })
    }, 1000 * 30);
}

function commitFans(result) {
    request.post({
        url:'http://178.rocks/weixin/user?page=guanzhu',
        headers:{
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate',
            "Accept-Language": 'zh-CN,zh;q=0.8',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Content-Type": 'application/x-www-form-urlencoded',
            "Cookie": wxFansCookieInfo,
            "Host": '178.rocks',
            "Origin": 'http://178.rocks',
            "Referer": 'http://178.rocks/weixin/user?page=guanzhu',
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
        },
        formData: {
            gongzh: result.account,
            guanzhusl: result.num,
            immediate: 1,
            method: 0
        }
    },function(err,res,body){
        if(err) {
            return console.log(err);
        }
        wxFansCookieInfo = res.headers['set-cookie'][0].split(';')[0];
        var $ = cheerio.load(body);
        var aimItem = $('table').children().last();
        var account = aimItem.children().first().next().text();
        var num = aimItem.children().first().next().next().text();
        if(account == result.account && num == result.num){
            var resultInstance = Order.wrapToInstance(result);
            resultInstance.complete(function() {
                console.log('自动处理订单完成了, account = ' + result.account);
            })
        }else {
            console.log('有一个订单没有提交： account = ' + result.account);
            result.isWait = 'wait';
            Order.open().updateById(result._id, result);
        }
    });
}

function freshFansCookie() {
    request.get({
        url:'http://178.rocks/weixin/user?page=guanzhu',
        headers:{
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate, sdch',
            "Accept-Language": 'zh-CN,zh;q=0.8',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Cookie": wxFansCookieInfo,
            "Host": '178.rocks',
            "Referer": 'http://178.rocks/weixin/user?page=guanzhu',
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
        }
    },function(err,res,body){
        if(err) {
            return console.log(err);
        }
        wxFansCookieInfo = res.headers['set-cookie'][0].split(';')[0];
        console.log('刷新页面了。。。。。。。。。。。。。。。');
    });
}

function stopFans() {
    clearInterval(wxSetIntIndex);
}

Order.extend({
    addSchedule: function(orders, speedNum) {
        for(var i in orders) {
            var order = orders[i];
            if(order.status == '已处理'){
                var dealTime = order.dealTime, num = (order.type == 'flow' ? order.realNum : order.num),
                    delay = 3 * 60 * 1000, speed = order.speed ? order.speed : speedNum;
                var allTimes = (parseInt(num / speed) + ((num % speed == 0) ? 0 : 1)) * 60 * 1000;
                var currentTimes = new Date().getTime() - new Date(dealTime).getTime() - delay;

                if(currentTimes > 0) {
                    var percent = (currentTimes / allTimes).toFixed(4);
                    if(percent < 1) {
                        percent = (percent * 100).toFixed(2) + '%';
                        order.status = '执行中';
                    }else {
                        percent = '100%';
                        order.status = '已完成';
                    }
                    order.schedule = percent;
                }else {
                    order.status = '未处理';
                }
            }
        }
        return orders;
    },
    openWXReadAuto: function(cookie) {
        cookieInfo = cookie;
        wxReadIsOpen = 'yes';
        valIndex = startInterval();
    },
    closeWXReadAuto: function() {
        wxReadIsOpen = 'no';
        clearInterval(valIndex);
    },
    wxReadIsOpen: function() {
        return wxReadIsOpen;
    },
    openWXFansAuto: function(cookie) {
        wxFansCookieInfo = cookie;
        wxFansIsOpen = 'yes';
        wxSetIntIndex = startFans();
    },
    closeWXFansAuto: function() {
        wxFansIsOpen = 'no';
        stopFans();
    },
    wxFansIsOpen: function() {
        return wxFansIsOpen;
    }
});

Order.include({
    save: function(callback) {
        var self = this;
        Order.open().insert(self)
            .then(function () {
                User.open().updateById(self.userId, {$set: {funds: self.funds}})
                    .then(function () {
                        callback(self);
                    });
            });
    },
    handleCreateAndSave: function(user, info) {
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info)
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    if(!self.price || parseFloat(self.price) < parseFloat(myPrice)) {
                        self.price = myPrice;
                    }
                    self.totalPrice = (self.price * self.num).toFixed(4);
                    if((self.totalPrice - user.funds) > 0) {
                        return reject();
                    }
                    self.realPrice = self.price;
                    self.user = user.username;
                    self.userId = user._id;
                    self.name = product.name;
                    self.type = product.type;
                    self.typeName = product.typeName;
                    self.smallType = product.smallType;
                    self.smallTypeName = product.smallTypeName;
                    self.status = '未处理';
                    self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    self.funds = (user.funds - self.totalPrice).toFixed(4);
                    self.description = self.typeName + self.smallTypeName + '执行' + self.num;
                    self.handleCountParentProfit(user, product, function(obj) {
                        resolve(obj);
                    });
                });
        });
    },
    handleCreateAndSaveTwo: function(user, info1, info2) {
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info1)
                .then(function(result1) {
                    var product1 = Product.wrapToInstance(result1);
                    Product.open().findOne(info2)
                        .then(function (result2) {
                            var product2 = Product.wrapToInstance(result2);
                            var myPrice1 = product1.getPriceByRole(user.role);
                            var myPrice2 = product2.getPriceByRole(user.role);
                            if(!self.price || parseFloat(self.price) < parseFloat(myPrice1)) {
                                self.price = myPrice1;
                            }
                            if(!self.price2 || parseFloat(self.price2) < parseFloat(myPrice2)) {
                                self.price2 = myPrice2;
                            }
                            self.totalPrice = (self.price * self.num + self.price2 * self.num2).toFixed(4);
                            if ((self.totalPrice - user.funds) > 0) {
                                return reject();
                            }
                            self.realPrice = self.price;
                            self.realPrice2 = self.price2;
                            self.surplus = self.totalPrice;
                            self.user = user.username;
                            self.userId = user._id;
                            self.name = product1.name;
                            self.type = product1.type;
                            self.typeName = product1.typeName;
                            self.smallType = product1.smallType;
                            self.smallTypeName = product1.smallTypeName;
                            self.status = '未处理';
                            self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            self.funds = (user.funds - self.totalPrice).toFixed(4);
                            self.description = self.typeName + self.smallTypeName + '执行' + self.num + '; ' +
                                product2.typeName + product2.smallTypeName + '执行' + self.num2;

                            self.handleCountParentProfitTwo(user, product1, product2, function(obj) {
                                resolve(obj);
                            });
                        });
                });
        });
    },
    handleCountParentProfit: function(user, product, callback) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    var selfPrice = product.getPriceByRole(user.role);
                    var parentPrice = product.getPriceByRole(parent.role);
                    var profit = selfPrice - parentPrice;
                    self[name] = profit.toFixed(4);
                    self.realPrice = (self.realPrice - profit).toFixed(4);
                    self.handleCountParentProfit(parent, product, callback);
                })
        }else {
            var adminPer = product.getPerByRole('管理员'), topPer = product.getPerByRole('顶级代理'),
                superPer = product.getPerByRole('超级代理'), goldPer = product.getPerByRole('金牌代理');
            self.adminPerPrice = (self.realPrice * adminPer).toFixed(2);
            self.topPerPrice = (self.realPrice * topPer).toFixed(2);
            self.superPerPrice = (self.realPrice * superPer).toFixed(2);
            self.goldPerPrice = (self.realPrice * goldPer).toFixed(2);
            self.save(callback);
        }
    },
    handleCountParentProfitTwo: function(user, product1, product2, callback) {
        var self = this;
        var profit = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            profit = 'adminProfit';
                            break;
                        case '顶级代理':
                            profit = 'topProfit';
                            break;
                        case '超级代理':
                            profit = 'superProfit';
                            break;
                        case '金牌代理':
                            profit = 'goldProfit';
                            break;
                    }
                    var selfPrice1 = product1.getPriceByRole(user.role);
                    var selfPrice2 = product2.getPriceByRole(user.role);
                    var parentPrice1 = product1.getPriceByRole(parent.role);
                    var parentPrice2 = product2.getPriceByRole(parent.role);

                    var profit1 = selfPrice1 - parentPrice1;
                    var profit2 = selfPrice2 - parentPrice2;
                    self[profit] = (profit1 + profit2).toFixed(4);

                    self.realPrice = (self.realPrice - profit1).toFixed(4);
                    self.realPrice2 = (self.realPrice2 - profit2).toFixed(4);
                    self.handleCountParentProfitTwo(parent, product1, product2, callback);
                })
        }else {
            var adminPer1 = product1.getPerByRole('管理员'), adminPer2 = product2.getPerByRole('管理员'),
                topPer1 = product1.getPerByRole('顶级代理'), topPer2 = product2.getPerByRole('顶级代理'),
                superPer1 = product1.getPerByRole('超级代理'), superPer2 = product2.getPerByRole('超级代理'),
                goldPer1 = product1.getPerByRole('金牌代理'), goldPer2 = product2.getPerByRole('金牌代理');
            self.adminPerPrice = (self.realPrice * adminPer1 + self.realPrice2 * adminPer2).toFixed(2);
            self.topPerPrice = (self.realPrice * topPer1 + self.realPrice2 * topPer2).toFixed(2);
            self.superPerPrice = (self.realPrice * superPer1 + self.realPrice2 * superPer2).toFixed(2);
            self.goldPerPrice = (self.realPrice * goldPer1 + self.realPrice2 * goldPer2).toFixed(2);
            self.save(callback);
        }
    },
    handleRelease: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            Order.open().updateById(self._id, {
                $set: {
                    status: '已发布',
                    releaseTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            }).then(function() {
                resolve();
            })
        })
    },
    createAndSave: function(user, info) {
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info)
                .then(function(result) {
                    var product = Product.wrapToInstance(result);
                    var myPrice = product.getPriceByRole(user.role);
                    self.totalPrice = (myPrice * self.num).toFixed(4);
                    if(product.type == 'forum'){
                        if(self.totalPrice < 0.5) {
                            self.totalPrice = 0.5;
                        }
                    }
                    if((self.totalPrice - user.funds) > 0) {
                        return reject();
                    }
                    self.price = myPrice;
                    self.user = user.username;
                    self.userId = user._id;
                    self.name = product.name;
                    self.type = product.type;
                    self.typeName = product.typeName;
                    self.smallType = product.smallType;
                    self.smallTypeName = product.smallTypeName;
                    self.status = '未处理';
                    self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    self.funds = (user.funds - self.totalPrice).toFixed(4);
                    self.description = self.typeName + self.smallTypeName + '执行' + self.num;
                    self.countParentProfit(user, product, function(obj) {
                        resolve(obj);
                    });
                });
        });
    },
    createAndSaveTwo: function(user, info1, info2){
        var self = this;
        return new Promise(function(resolve, reject) {
            Product.open().findOne(info1)
                .then(function(result1) {
                    var product1 = Product.wrapToInstance(result1);
                    Product.open().findOne(info2)
                        .then(function (result2) {
                            var product2 = Product.wrapToInstance(result2);
                            var myPrice1 = product1.getPriceByRole(user.role);
                            var myPrice2 = product2.getPriceByRole(user.role);
                            if(!self.price || parseFloat(self.price) < parseFloat(myPrice1)) {
                                self.price = myPrice1;
                            }
                            if(!self.price2 || parseFloat(self.price2) < parseFloat(myPrice2)) {
                                self.price2 = myPrice2;
                            }
                            self.totalPrice = (self.price * self.num + self.price2 * self.num2).toFixed(4);
                            if(product1.type == 'handle' && product1.smallType == 'WXfans' && !self.isReply){
                                self.totalPrice = (self.price * self.num).toFixed(4);
                            }
                            if ((self.totalPrice - user.funds) > 0) {
                                return reject();
                            }
                            self.surplus = self.totalPrice;
                            self.user = user.username;
                            self.userId = user._id;
                            self.name = product1.name;
                            self.type = product1.type;
                            self.typeName = product1.typeName;
                            self.smallType = product1.smallType;
                            self.smallTypeName = product1.smallTypeName;
                            self.status = '未处理';
                            self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            self.funds = (user.funds - self.totalPrice).toFixed(4);
                            self.description = self.typeName + self.smallTypeName + '执行' + self.num + '; ' +
                                               product2.typeName + product2.smallTypeName + '执行' + self.num2;
                            self.countParentProfitTow(user, product1, product2, function(obj) {
                                resolve(obj);
                            });
                        });
                });
        });
    },
    countParentProfit: function (user, product, callback) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    var selfPrice = product.getPriceByRole(user.role);
                    var parentPrice = product.getPriceByRole(parent.role);
                    var profit = selfPrice - parentPrice;
                    self[name] = (profit * self.num).toFixed(4);
                    self.countParentProfit(parent, product, callback);
                })
        }else {
            self.save(callback);
        }
    },
    countParentProfitTow: function (user, product1, product2, callback) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    var selfPrice1 = product1.getPriceByRole(user.role);
                    var selfPrice2 = product2.getPriceByRole(user.role);
                    var parentPrice1 = product1.getPriceByRole(parent.role);
                    var parentPrice2 = product2.getPriceByRole(parent.role);

                    var profit1 = selfPrice1 - parentPrice1;
                    var profit2 = selfPrice2 - parentPrice2;
                    self[name] = (profit1 * self.num + profit2 * self.num2).toFixed(4);
                    if(product1.type == 'handle' && product1.smallType == 'WXfans' && !self.isReply){
                        self[name] = (profit1 * self.num).toFixed(4);
                    }
                    self.surplus -= self[name];
                    self.countParentProfitTow(parent, product1, product2, callback);
                })
        }else {
            self.save(callback);
        }
    },
    complete: function(callback) {
        var self = this;
        User.open().findById(self.userId)
            .then(function(user) {
                self.profitToParent(user, user, function(order) {
                    if(self.remote){
                        Order.open().updateById(self._id, {
                            $set: {
                                remote: self.remote,
                                status: '已处理',
                                dealTime:  moment().format('YYYY-MM-DD HH:mm:ss')
                            }
                        }).then(function () {
                            callback();
                        });
                    }else {
                        Order.open().updateById(self._id, {
                            $set: {
                                status: '已处理',
                                dealTime:  moment().format('YYYY-MM-DD HH:mm:ss')
                            }
                        }).then(function () {
                            callback();
                        });
                    }
                });
            })
    },
    profitToParent: function(orderUser, child, callback) {
        var self = this;
        var name = '';
        if(child.parentID) {
            User.open().findById(child.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminProfit';
                            break;
                        case '顶级代理':
                            name = 'topProfit';
                            break;
                        case '超级代理':
                            name = 'superProfit';
                            break;
                        case '金牌代理':
                            name = 'goldProfit';
                            break;
                    }
                    parent.funds = (parseFloat(self[name]) + parseFloat(parent.funds)).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: parent.funds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderUserId: orderUser._id,
                                orderUsername: orderUser.username,
                                typeName: self.typeName,
                                smallTypeName: self.smallTypeName,
                                profit: self[name],
                                orderId: self._id,
                                status: 'success',
                                createTime: self.createTime
                            }).then(function (profit) {
                                self.profitToParent(orderUser, parent, callback);
                            })
                        });
                })
        }else {
            callback(self);
        }
    },
    refund: function(info, callback) {
        var self = this;
        self.status = '已退款';
        self.error = '已处理';
        self.refundInfo = info;
        Order.open().updateById(self._id, self)
            .then(function () {
                User.open().findById(self.userId)
                    .then(function (user) {
                        user.funds = (parseFloat(self.totalPrice) + parseFloat(user.funds)).toFixed(4);
                        User.open().updateById(user._id, {$set: {funds: user.funds}})
                            .then(function () {
                                callback();
                            });
                    });
            });
    },
    refundProfit: function(info, callback) {
        var self = this;
        self.refund(info, function() {
            Profit.open().find({orderId: self._id})
                .then(function(profits) {
                    profits.forEach(function(profit) {
                        User.open().findById(profit.userId)
                            .then(function(user) {
                                user.funds = (parseFloat(user.funds) - parseFloat(profit.profit)).toFixed(4);
                                User.open().updateById(user._id, {$set: {funds: user.funds}})
                                    .then(function() {
                                        Profit.open().updateById(profit._id, {$set: {status: 'refund'}});
                                    })
                            })
                    });
                    callback();
                })
        })
    },
    orderError: function(info, callback) {
        Order.open().updateById(this._id, {
            $set: {
                error: '未处理',
                errorInfo: info,
                errorTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }).then(function() {
            callback();
        })
    },
    dealError: function(info, callback) {
        Order.open().updateById(this._id, {$set: {error: '已处理', errorDealInfo: info}})
            .then(function() {
                callback();
            })
    }
});

module.exports = Order;