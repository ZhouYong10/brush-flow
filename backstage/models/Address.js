/**
 * Created by ubuntu64 on 4/14/16.
 */
var request = require('request');
var cheerio = require('cheerio');

var Product = require('./Product');

module.exports = {
    parseWxTitle: function (address) {
        return new Promise(function (resolve, reject) {
            request({
                url: address,
                headers: {
                    "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    "Accept-Encoding": 'UTF-8',
                    "Accept-Language": 'zh-CN,zh;q=0.8',
                    "Cache-Control": 'max-age=0',
                    "Connection": 'keep-alive',
                    "Cookie": 'ptui_loginuin=1059981087; RK=hPsrImNHUm; pt2gguin=o1059981087; ptcz=689d9b584768e14052c8c4135026df9cbd6ce284322ecf5fa1e515f34645f3d7; uid=47735014; o_cookie=1059981087; pgv_pvid=590193236',
                    "Host": 'mp.weixin.qq.com',
                    "Upgrade-Insecure-Requests": 1,
                    "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
                }
            }, function (err, obj, body) {
                if (err) {
                    reject({
                        isOk: false,
                        message: '对不起，地址解析失败，请联系管理员！'
                    });
                } else {
                    var $ = cheerio.load(body);
                    resolve({
                        isOk: true,
                        title: $('title').text()
                    });
                }
            });
        })
    },
    parseMpTitle: function (address) {
        return new Promise(function (resolve, reject) {
            request({
                url: address
            }, function (err, obj, body) {
                if (err) {
                    reject({
                        isOk: false,
                        message: '对不起，地址解析失败，请联系管理员！'
                    });
                } else {
                    var $ = cheerio.load(body);
                    resolve({
                        isOk: true,
                        title: $('title').text()
                    });
                }
            });
        })
    },
    parseForumTitle: function (address, userRole) {
        return new Promise(function (resolve, reject) {
            var arr = address.split('/')[2].split('.');
            arr.shift();
            var mainUrl = arr.join('.');
            Product.open().findOne({
                type: 'forum',
                address: new RegExp(mainUrl)
            }).then(function(result) {
                if(result) {
                    if(result.condition == 'normal'){
                        request({
                            url: address
                        }, function (err, obj, body) {
                            if (err) {
                                reject({
                                    isOk: false,
                                    message: '对不起，地址解析失败，请联系管理员！'
                                });
                            } else {
                                var productIns = Product.wrapToInstance(result);
                                var myPrice = productIns.getPriceByRole(userRole);
                                var $ = cheerio.load(body);
                                resolve({
                                    isOk: true,
                                    title: $('title').text(),
                                    price: myPrice,
                                    remark: result.remark,
                                    smallType: result.smallType,
                                    addName: result.name
                                });
                            }
                        });
                    }else {
                        reject({
                            isOk: false,
                            message: '该网站服务正在开发维护中。。。。。'
                        });
                    }
                }else {
                    reject({
                        isOk: false,
                        message: '对不起，暂时不支持该链接地址！'
                    });
                }
            })
        })
    }
};



