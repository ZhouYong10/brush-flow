/**
 * Created by zhouyong10 on 2/3/16.
 */
var db = require('../dbWrap');
var User = require('./User');
var Product = require('./Product');
var Profit = require('./Profit');
var Address = require('./Address');
var Consume = require('./Consume');
var request = require('request');
var cheerio = require('cheerio');

var Class = require('./Class');

//var bcrypt = require('bcryptjs');
var moment = require('moment');

var Formidable = require('formidable');
var images = require('images');
var fs = require('fs');
var path = require('path');


var Order = new Class();


Order.extend(db);

Order.open = function() {
    return Order.openCollection('Order');
};

///*
// * wx read and like 推客接口
// * */
//var post_key = '';
//var firstItemId = '';
//var task_time = 1000 * 60 * 60 * 1000;
//var wxReadIsOpen = 'no';
//var cookieInfo ;
//var valIndex ;
//
//function startInterval() {
//    var random = (Math.random() / 3 * 100).toFixed(0);
//    task_time = random >= 5 ? random * 1000 : 5 * 1000;
//    return setInterval(function() {
//        console.log('开始提单=====================================');
//        noKey(clearTime);
//    }, task_time);
//}
//
//function clearTime() {
//    clearInterval(valIndex);
//    if(wxReadIsOpen == 'yes'){
//        valIndex = startInterval();
//    }
//}
//
//function noKey(callback) {
//    request.get({
//        url:'http://120.25.203.122/tuike_sys.php',
//        headers:{
//            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//            "Accept-Encoding": 'gzip, deflate, sdch',
//            "Accept-Language": 'zh-CN,zh;q=0.8',
//            "Cache-Control": 'max-age=0',
//            "Connection": 'keep-alive',
//            "Cookie": cookieInfo,
//            "Host": '120.25.203.122',
//            "Referer": 'http://120.25.203.122/login.html',
//            "Upgrade-Insecure-Requests": 1,
//            "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
//        }
//    },function(err,res,body){
//        if(err) {
//            return console.log(err);
//        }
//        var $ = cheerio.load(body);
//        post_key = $('#post_key').val();
//        firstItemId = $('tbody').last().children().children().first().text().split('/')[0];
//        yesKey(callback);
//    });
//}
//
//function yesKey(callback) {
//    //var forwardNum = global.forwardNum ? global.forwardNum : 5000;
//    var forwardNum = global.weichuanmeiOrderNum;
//    Order.open().findOne({
//        status: '未处理',
//        type: 'wx',
//        smallType: {$in: ['read', 'like']},
//        num: {$gt: forwardNum}
//    }).then(function (result) {address
//        if(result && !result.remote) {
//            Order.open().updateById(result._id, {
//                $set: {remote: 'tuike'}
//            }).then(function() {
//                request.post({
//                    url:'http://120.25.203.122/tuike_sys.php',
//                    headers:{
//                        "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                        "Accept-Encoding": 'gzip, deflate, sdch',
//                        "Accept-Language": 'zh-CN,zh;q=0.8',
//                        "Cache-Control": 'max-age=0',
//                        "Connection": 'keep-alive',
//                        "Cookie": cookieInfo,
//                        "Host": '120.25.203.122',
//                        "Referer": 'http://120.25.203.122/tuike_sys.php',
//                        "Upgrade-Insecure-Requests": 1,
//                        "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
//                    },
//                    formData: {
//                        url: result.address,
//                        speed: result.speed ? result.speed : 167,
//                        read_cnt: result.num,
//                        post_key: post_key,
//                        like_cnt: result.num2 ? result.num2 : 0,
//                        like: (result.num2 / result.num).toFixed(3)
//                    }
//                },function(err,res,body){
//                    if(err) {
//                        return console.log(err);
//                    }
//                    var $ = cheerio.load(body);
//                    var secondItemId = $('tbody').last().children().next().children().first().text().split('/')[0];
//                    if(secondItemId == firstItemId) {
//                        var numIndex = setInterval(function () {
//                            getOrderStartNum().then(function (startNum) {
//                                clearInterval(numIndex);
//                                var resultInstance = Order.wrapToInstance(result);
//                                resultInstance.remote = 'tuike';
//                                resultInstance.startReadNum = startNum;
//                                resultInstance.complete(function() {
//                                    console.log('自动处理订单完成了, href = ' + result.address);
//                                    callback();
//                                })
//                            });
//                        }, 1000 * 10);
//                    }
//                });
//            });
//        }else{
//            callback();
//        }
//    });
//}
//
//function getOrderStartNum() {
//    return new Promise(function(resolve, reject) {
//        request.get({
//            url:'http://120.25.203.122/tuike_sys.php',
//            headers:{
//                "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                "Accept-Encoding": 'gzip, deflate, sdch',
//                "Accept-Language": 'zh-CN,zh;q=0.8',
//                "Cache-Control": 'max-age=0',
//                "Connection": 'keep-alive',
//                "Cookie": cookieInfo,
//                "Host": '120.25.203.122',
//                "Referer": 'http://120.25.203.122/login.html',
//                "Upgrade-Insecure-Requests": 1,
//                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
//            }
//        },function(err,res,body){
//            if(err) {
//                return console.log(err);
//            }
//            var $ = cheerio.load(body);
//            var $tr = $('tbody').last().children().first().children();
//            var orderStatus = $tr.last().find('font').text();
//            console.log(orderStatus, '======================================');
//            if(orderStatus == '运行中' || orderStatus == '完成'){
//                var startNum = $tr.first().next().next().next().next().text();
//                console.log(startNum, '==========================================');
//                resolve(startNum);
//            }
//        });
//    })
//}

/*
 * wx read and like 代替推客的接口
 * */
var wxReadIsOpen = 'no';

function startInterval() {
    if(wxReadIsOpen == 'yes'){
        console.log('开始提单了');
        commitOrder();
    }
}

function commitOrder() {
    Order.open().findOne({
        status: '未处理',
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        num: {$gt: global.dingdingOrderNum}
    }).then(function (result) {
        if(result) {
            var orderIns = Order.wrapToInstance(result);
            request('http://112.74.69.75:9092/weixin/wx_Order_SaveOrderInfo?server=20&user=18682830727&password=yang@qing@3.1415&url='
                + encodeURIComponent(orderIns.address) + '&read=' + orderIns.num + '&praise=' + orderIns.num2 + '&frequency=10000',
                function(err,res,body){
                    if(JSON.parse(body).Data == 'ok'){
                        Order.open().updateById(orderIns._id, {
                            $set: {remote: 'tuike'}
                        });
                        var indexGetReadNum = setInterval(function () {
                            request('http://112.74.69.75:9092/wx_Order_GetOrderInfo?server=20&user=18682830727&password=yang@qing@3.1415&url='
                                + encodeURIComponent(orderIns.address),
                                function(err,res,body){
                                    if(JSON.parse(body)[0]){
                                        var startReadNum = parseInt(JSON.parse(body)[0].start_quantity);
                                        if(startReadNum != 0) {
                                            orderIns.startReadNum = startReadNum;
                                            clearInterval(indexGetReadNum);
                                            orderIns.complete(function() {
                                                startInterval();
                                            });
                                        }
                                    }
                                });
                        }, 10 * 1000);
                    }else {
                        setTimeout(function () {
                            startInterval();
                        }, 60 * 1000 * 10);
                    }
                });
        }else {
            setTimeout(function () {
                startInterval();
            }, 20 * 1000);
        }
    });
}

/*
 * wx read and like 微信帮帮接口
 * */
var commitOrderId;
setInterval(function () {
    commitOrderToWeiBang();
}, 1000 * 10);

function commitOrderToWeiBang() {
    Order.open().findOne({
        status: '未处理',
        type: 'wx',
        smallType: {$in: ['read', 'like']},
        num: {$lte: global.weichuanmeiOrderNum}
    }).then(function (order) {
        if(order && order._id.toString() != commitOrderId) {
            commitOrderId = order._id.toString();
            var orderIns = Order.wrapToInstance(order);
            Address.postWeiBang('http://120.24.58.35:13000/api2/placeOrder',{
                "appkey": "xIwp2ohi",
                "url": orderIns.address,
                "taskReadNum": parseInt(orderIns.num),
                "taskLikeNum": parseInt(orderIns.num2),
                "readPerMinute": 50,
                "forceStopAfterHours": 46 * 60
            }).then(function (result) {
                var result_json = JSON.parse(result);
                orderIns.remote = 'weibang';
                if(result_json.status == 1) {
                    orderIns.startReadNum = result_json.data.startReadNum;
                    orderIns.complete();
                }else{
                    orderIns.remoteError(result_json.message);
                }
            });
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
        url:'http://7893971.cn/weixin/user?page=guanzhu',
        headers:{
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate',
            "Accept-Language": 'zh-CN,zh;q=0.8',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Content-Type": 'application/x-www-form-urlencoded',
            "Cookie": wxFansCookieInfo,
            "Host": '7893971.cn',
            "Origin": 'http://7893971.cn',
            "Referer": 'http://7893971.cn/weixin/user?page=guanzhu',
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
        console.log(res.headers['set-cookie'], '===============================');
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
        url:'http://7893971.cn/weixin/user?page=guanzhu',
        headers:{
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate, sdch',
            "Accept-Language": 'zh-CN,zh;q=0.8',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Cookie": wxFansCookieInfo,
            "Host": '7893971.cn',
            "Referer": 'http://7893971.cn/weixin/user?page=guanzhu',
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

global.readSpeed = 1;
Order.extend({
    getRandomStr: function(req) {
        return new Promise(function(resolve, reject) {
            var str = Math.random().toString(36).substr(2);
            req.session.orderFlag = str;
            resolve(str);
        })
    },
    getOrderFreezeFunds: function() {
        return new Promise(function(resolve, reject) {
            Order.open().find({
                status: {$in: ['审核中', '已发布', '已暂停']}
            }).then(function(orders) {
                var count = 0;
                orders.forEach(function (order) {
                    count += parseFloat(order.surplus);
                });
                resolve(count.toFixed(4));
            })
        })
    },
    mkdirsSync: function(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (Order.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    },
    getOrder: function getOrder(req) {
        var picField;
        return new Promise(function(resolve, reject) {
            var order = {};
            var form = new Formidable.IncomingForm();
            form.maxFieldsSize = 1024 * 1024;
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.hash = 'md5';
            var logoDir = form.uploadDir = global.handleExam + moment().format('YYYY-MM-DD') + '/';

            Order.mkdirsSync(logoDir);
            form.on('error', function(err) {
                reject(err);
            }).on('field', function(field, value) {
                order[field] = value;
            }).on('file', function(field, file) { //上传文件
                picField = field;
                var filePath = file.path;
                var fileExt = filePath.substring(filePath.lastIndexOf('.'));
                var newFileName = new Date().getTime() + '-' + file.hash + fileExt;
                var newFilePath = path.join(logoDir + newFileName);
                try{
                    fs.renameSync(filePath, newFilePath);
                    order[picField] = '/handle_example/' + moment().format('YYYY-MM-DD') + '/' + newFileName;
                }catch (e){
                    console.log('图片上传失败： ' + e);
                    reject('图片上传失败!');
                }
            }).on('end', function() {
                resolve(order);
            });
            form.parse(req);
        })
    },
    addSchedule: function(orders, speedNum) {
        for(var i in orders) {
            var order = orders[i];
            if(order.status == '执行中' || order.status == '已处理'){
                var dealTime = order.dealTime, num = (order.type == 'flow' ? order.realNum : order.num),
                    delay = 0 * 60 * 1000, speed = order.speed ? order.speed : speedNum;
                if(order.smallType == 'read'){
                    speed = global.readSpeed;
                }

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
                        Order.open().updateById(order._id, {$set: {
                            status: '已完成',
                            schedule: percent
                        }});
                    }
                    order.schedule = percent;
                }else {
                    order.status = '排队中';
                }
            }else if(order.status == '未处理'){
                order.status = '排队中';
            }
        }
        return orders;
    },
    openWXReadAuto: function(cookie) {
        //cookieInfo = cookie;
        wxReadIsOpen = 'yes';
        startInterval();
    },
    closeWXReadAuto: function() {
        wxReadIsOpen = 'no';
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
    checkRandomStr: function(req) {
        var self = this;
        return new Promise(function(resolve, reject) {
            if(self.orderFlag == req.session.orderFlag) {
                req.session.orderFlag = '';
                resolve();
            }else {
                console.log('订单已经提交了，请勿重复提交！');
                reject();
            }
        })
    },
    save: function(callback) {
        var self = this;
        Order.open().insert(self)
            .then(function () {
                User.open().updateById(self.userId, {$set: {funds: self.funds}})
                    .then(function () {
                        Consume.open().insert({
                            userId: self.userId,
                            username: self.user,
                            orderId: self._id,
                            type: self.type,
                            typeName: self.typeName,
                            smallType: self.smallType,
                            smallTypeName: self.smallTypeName,
                            funds: - self.totalPrice,
                            userOldFunds: self.userOldFunds,
                            userNowFunds: self.funds,
                            createTime: self.createTime,
                            description: self.description
                        }).then(function() {
                            callback(self);
                        })
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
                    self.surplus = self.totalPrice;
                    self.releasePrice = (parseFloat(self.price) + parseFloat(self.price2 ? self.price2 : 0)).toFixed(2);
                    self.user = user.username;
                    self.userId = user._id;
                    self.name = product.name;
                    self.type = product.type;
                    self.typeName = product.typeName;
                    self.smallType = product.smallType;
                    self.smallTypeName = product.smallTypeName;
                    self.status = '审核中';
                    self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    self.funds = (user.funds - self.totalPrice).toFixed(4);
                    self.description = self.typeName + self.smallTypeName + '执行' + self.num;
                    self.taskNum = 0;
                    self.taskUsers = [];
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
                            self.releasePrice = (parseFloat(self.price) + parseFloat(self.price2 ? self.price2 : 0)).toFixed(2);
                            self.user = user.username;
                            self.userId = user._id;
                            self.name = product1.name;
                            self.type = product1.type;
                            self.typeName = product1.typeName;
                            self.smallType = product1.smallType;
                            self.smallTypeName = product1.smallTypeName;
                            self.status = '审核中';
                            self.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            self.funds = (user.funds - self.totalPrice).toFixed(4);
                            self.description = self.typeName + self.smallTypeName + '执行' + self.num + '; ' +
                                product2.typeName + product2.smallTypeName + '执行' + self.num2;
                            self.taskNum = 0;
                            self.taskUsers = [];

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

        var sourcePath = path.join(global.handleExam, '../' + self.photo);
        var waterPath = path.join(global.handleExam, '../static/images/waterImg.jpg');
        var sourceImg = images(sourcePath);
        var waterImg = images(waterPath);
        waterImg.resize(sourceImg.width() / 5 * 2);
        images(sourceImg)
            .draw(waterImg, sourceImg.width() - waterImg.width() -20, sourceImg.height() -waterImg.height() - 20)
            .save(sourcePath);
        return new Promise(function(resolve, reject) {
            Order.open().updateById(self._id, {
                $set: {
                    status: '已发布',
                    releaseTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    taskNum: 0,
                    taskUsers: []
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
                    self.userOldFunds = user.funds;
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
                            self.userOldFunds = user.funds;
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
    countParentQuit: function(user, product, cb) {
        var self = this;
        var name = '';
        if(user.parentID) {
            User.open().findById(user.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminQuit';
                            break;
                        case '顶级代理':
                            name = 'topQuit';
                            break;
                        case '超级代理':
                            name = 'superQuit';
                            break;
                        case '金牌代理':
                            name = 'goldQuit';
                            break;
                    }
                    var selfPrice = product.getPriceByRole(user.role);
                    var parentPrice = product.getPriceByRole(parent.role);
                    var quit = selfPrice - parentPrice;
                    self[name] = (quit * self.overNum).toFixed(4);
                    self.countParentQuit(parent, product, cb);
                })
        }else {
            cb();
        }
    },
    quit: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.status = '已退款';
            self.error = '已处理';
            self.quitTime = moment().format('YYYY-MM-DD HH:mm:ss');
            self.quitFunds = (self.price * self.overNum).toFixed(4);
            self.quitDesc = self.typeName + self.smallTypeName + '撤单' + self.overNum;
            User.open().findById(self.userId).then(function (user) {
                self.userOldFunds = user.funds;
                self.nowUserFunds = (parseFloat(user.funds) + parseFloat(self.quitFunds)).toFixed(4);
                User.open().updateById(user._id, {$set: {
                    funds: self.nowUserFunds
                }}).then(function() {
                    Product.open().findOne({type: self.type, smallType: self.smallType}).then(function (product) {
                        self.countParentQuit(user, Product.wrapToInstance(product), function () {
                            self.parentProfitQuit(user, user, function () {
                                var orderId = self._id;
                                delete self._id;
                                delete self.isQuit;
                                Order.open().updateById(orderId, {$set: self}).then(function() {
                                    Consume.open().insert({
                                        userId: self.userId,
                                        username: self.user,
                                        orderId: orderId,
                                        type: self.type,
                                        typeName: self.typeName,
                                        smallType: self.smallType,
                                        smallTypeName: self.smallTypeName,
                                        funds: + self.quitFunds,
                                        userOldFunds: + self.userOldFunds,
                                        userNowFunds: self.nowUserFunds,
                                        createTime: self.quitTime,
                                        description: self.quitDesc
                                    }).then(function() {
                                        resolve();
                                    })
                                })
                            });
                        });
                    });
                })
            });
        });
    },
    parentProfitQuit: function(orderUser, child, callback) {
        var self = this;
        var name = '';
        if(child.parentID) {
            User.open().findById(child.parentID)
                .then(function(parent) {
                    switch (parent.role) {
                        case '管理员':
                            name = 'adminQuit';
                            break;
                        case '顶级代理':
                            name = 'topQuit';
                            break;
                        case '超级代理':
                            name = 'superQuit';
                            break;
                        case '金牌代理':
                            name = 'goldQuit';
                            break;
                    }
                    parent.userNowFunds = (parent.funds - self[name]).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: parent.userNowFunds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderId: self._id,
                                orderUserId: orderUser._id,
                                orderUsername: orderUser.username,
                                type: self.type,
                                typeName: self.typeName,
                                smallType: self.smallType,
                                smallTypeName: self.smallTypeName,
                                funds: - self[name],
                                userOldFunds: parent.funds,
                                userNowFunds: parent.userNowFunds,
                                status: 'refund',
                                createTime: self.quitTime,
                                description: self.quitDesc
                            }).then(function () {
                                self.parentProfitQuit(orderUser, parent, callback);
                            })
                        });
                })
        }else {
            callback();
        }
    },
    complete: function(callback) {
        var self = this;
        User.open().findById(self.userId)
            .then(function(user) {
                var updateInfo = {
                    startReadNum: self.startReadNum,
                    status: '执行中',
                    dealTime: self.dealTime = moment().format('YYYY-MM-DD HH:mm:ss')
                };
                if(self.remote){
                    updateInfo.remote = self.remote;
                }
                Order.open().updateById(self._id, {
                    $set: updateInfo
                }).then(function () {
                    self.profitToParent(user, user, function() {
                        callback();
                    });
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
                    parent.userNowFunds = (parseFloat(self[name]) + parseFloat(parent.funds)).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: parent.userNowFunds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderId: self._id,
                                orderUserId: orderUser._id,
                                orderUsername: orderUser.username,
                                type: self.type,
                                typeName: self.typeName,
                                smallType: self.smallType,
                                smallTypeName: self.smallTypeName,
                                funds: self[name],
                                userOldFunds: parent.funds,
                                userNowFunds: parent.userNowFunds,
                                status: 'success',
                                createTime: self.dealTime,
                                description: self.description
                            }).then(function (profit) {
                                self.profitToParent(orderUser, parent, callback);
                            })
                        });
                })
        }else {
            callback(self);
        }
    },
    refund: function(info, isProfit, callback) {
        var self = this;
        self.status = '已退款';
        self.error = '已处理';
        self.refundInfo = info;
        self.quitDesc = self.typeName + self.smallTypeName + '撤单' + self.num;
        self.schedule = '0%';
        Order.open().updateById(self._id, self)
            .then(function () {
                User.open().findById(self.userId)
                    .then(function (user) {
                        self.nowUserFunds = (parseFloat(self.totalPrice) + parseFloat(user.funds)).toFixed(4);
                        User.open().updateById(user._id, {$set: {funds: self.nowUserFunds}})
                            .then(function () {
                                Consume.open().insert({
                                    userId: self.userId,
                                    username: self.user,
                                    orderId: self._id,
                                    type: self.type,
                                    typeName: self.typeName,
                                    smallType: self.smallType,
                                    smallTypeName: self.smallTypeName,
                                    funds: + self.totalPrice,
                                    userOldFunds: + user.funds,
                                    userNowFunds: self.nowUserFunds,
                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    description: self.quitDesc
                                }).then(function() {
                                    if(isProfit) {
                                        self.parentProfitRefund(user, user, function() {
                                            callback();
                                        });
                                    }else{
                                        callback();
                                    }
                                })
                            });
                    });
            });
    },
    parentProfitRefund: function(orderUser, child, callback) {
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
                    parent.userNowFunds = (parent.funds - self[name]).toFixed(4);
                    User.open().updateById(parent._id, {$set: {funds: parent.userNowFunds}})
                        .then(function () {
                            Profit.open().insert({
                                userId: parent._id,
                                username: parent.username,
                                orderId: self._id,
                                orderUserId: orderUser._id,
                                orderUsername: orderUser.username,
                                type: self.type,
                                typeName: self.typeName,
                                smallType: self.smallType,
                                smallTypeName: self.smallTypeName,
                                funds: - self[name],
                                userOldFunds: parent.funds,
                                userNowFunds: parent.userNowFunds,
                                status: 'refund',
                                createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                description: self.quitDesc
                            }).then(function () {
                                self.parentProfitRefund(orderUser, parent, callback);
                            })
                        });
                })
        }else {
            callback(self);
        }
    },
    remoteError: function(msg) {
        var self = this;
       return new Promise(function(resolve) {
           Order.open().updateById(self._id, {
               $set: {
                   remote: self.remote,
                   remoteInfo: msg
               }
           }).then(function() {
               resolve();
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
