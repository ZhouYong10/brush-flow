/**
 * Created by ubuntu64 on 4/14/16.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var querystring = require('querystring');
var http = require('http');
var https       = require('https');
var url         = require('url');


var Product = require('./Product');

module.exports = {
    postWeiBang: function (uri, param, opts) {
        return new Promise(function (resolve, reject) {
            if (!opts) {
                opts = {};
            }
            if (opts.hasOwnProperty('form-data') && !opts['form-data']) {
                var postData = param;
            } else {
                var postData = querystring.stringify(param);
            }
            var option = url.parse(uri);
            option['method'] = 'POST';
            option['headers'] = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
            if (opts.hasOwnProperty('headers')) {
                for (var i in opts['headers']) {
                    option['headers'][i] = opts['headers'][i];
                }
            }
            if (option['protocol'] == 'http:') {
                var p = http;
            } else {
                var p = https;
            }
            var req = p.request(option, function (res) {
                //debug('STATUS: ' + res.statusCode);
                //debug('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                var body = '';
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    body = body + chunk;
                });
                res.on('end', function () {
                    //debug(body);
                    resolve(body);
                });
                res.on('error', function (e) {
                    reject(e);
                });
            });
            req.on('error', function (e) {
                reject(e);
            });

            req.write(postData);
            req.end();
        });
    },
    readNum: function(url) {
        return new Promise(function (resolve, reject) {
            request({
                url: 'http://120.24.58.35:13000/api2/getArticleInfoAndExt?key=xIwp2ohi&url=' + encodeURIComponent (url)
            }, function (err, obj, body) {
                var result = JSON.parse(body);
                if(result.status == 1) {
                    resolve(result.data.readNum);
                }else{
                    reject('获取文章阅读数失败，请联系接口管理员。失败状态为：　' + body);
                }
            });
        });
    },
    getReadNum:  function (uri, param, opts) {
        return new Promise(function (resolve, reject) {
            if (!opts) {
                opts = {};
            }
            if (opts.hasOwnProperty('form-data') && !opts['form-data']) {
                var postData = param;
            } else {
                var postData = querystring.stringify(param);
            }
            var option        = url.parse(uri);
            option['method']  = 'POST';
            option['headers'] = {
                'Content-Type':   'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
            if (opts.hasOwnProperty('headers')) {
                for (var i in opts['headers']) {
                    option['headers'][i] = opts['headers'][i];
                }
            }
            if (option['protocol'] == 'http:') {
                var p = http;
            } else {
                var p = https;
            }
            var req = p.request(option, function (res) {
                //debug('STATUS: ' + res.statusCode);
                //debug('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                var body = '';
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    body = body + chunk;
                });
                res.on('end', function () {
                    //debug(body);
                    resolve(body);
                });
                res.on('error', function (e) {
                    reject(e);
                });
            });
            req.on('error', function (e) {
                reject(e);
            });

            req.write(postData);
            req.end();
        });
    },
    parseWxTitle: function (address) {
        return new Promise(function (resolve, reject) {
            request.post('http://127.0.0.1:8899?address=' + address, function (err, res, body) {
                if (body && body != 'get title failed') {
                    resolve({
                        isOk: true,
                        title: body
                    });
                } else {
                    resolve({
                        isOk: false,
                        message: '获取文章标题失败，可能网络不给力，或者文章地址错误,也可能程序欠修理！'
                    });
                }
            });
        });

        //return new Promise(function (resolve, reject) {
        //    request({
        //        url: address,
        //        headers: {
        //            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        //            "Accept-Encoding": 'UTF-8',
        //            "Accept-Language": 'zh-CN,zh;q=0.8',
        //            "Cache-Control": 'max-age=0',
        //            "Connection": 'keep-alive',
        //            "Cookie": 'ptui_loginuin=1059981087; RK=hPsrImNHUm; pt2gguin=o1059981087; ptcz=689d9b584768e14052c8c4135026df9cbd6ce284322ecf5fa1e515f34645f3d7; uid=47735014; o_cookie=1059981087; pgv_pvid=590193236',
        //            "Host": 'mp.weixin.qq.com',
        //            "Upgrade-Insecure-Requests": 1,
        //            "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
        //        }
        //    }, function (err, obj, body) {
        //        if (err) {
        //            resolve({
        //                isOk: false,
        //                message: '地址解析失败，请联系管理员！'
        //            });
        //        } else {
        //            var $ = cheerio.load(body);
        //            var title1 = $('title').text().replace(/(^\s*)|(\s*$)/g, "");
        //            var title2 = $('#activity-name').text().replace(/(^\s*)|(\s*$)/g, "");
        //            var title = title1 == "" ? title2 : title1;
        //            if(title == ''){
        //                resolve({
        //                    isOk: false,
        //                    message: '获取文章标题失败，可能网络不给力，或者文章地址错误！'
        //                });
        //            }else{
        //                resolve({
        //                    isOk: true,
        //                    title: title
        //                });
        //            }
        //        }
        //    });
        //})
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
                            url: address,
                            encoding: null,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
                            }
                        }, function (err, res, body) {
                            if (err) {
                                reject({
                                    isOk: false,
                                    message: '对不起，地址解析失败，请联系管理员！'
                                });
                            } else {
                                var productIns = Product.wrapToInstance(result);
                                var myPrice = productIns.getPriceByRole(userRole);
                                var html = iconv.decode(body, 'gb2312');
                                var $ = cheerio.load(html, {decodeEntities: false});
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
    },
    judgeForumAddress: function(address) {
        return new Promise(function(resolve, reject) {
            var arr = address.split('/')[2].split('.');
            arr.shift();
            var mainUrl = arr.join('.');
            Product.open().findOne({
                type: 'flow',
                address: new RegExp(mainUrl)
            }).then(function (result) {
                if(result) {
                    resolve({isFlow: true});
                }else {
                    resolve({isFlow: false});
                }
            });
        })
    }
};



