/**
 * Created by ubuntu64 on 2/24/16.
 */
var AlipayRecord = require('./db').getCollection('AlipayRecord');

var request = require('request');
var cheerio = require('cheerio');

var url = 'https://consumeprod.alipay.com/record/advanced.htm?tradeType=ALL&dateRange=today&status=success&fundFlow=in&categoryId=&keyword=oppositeName&maxAmount=&beginTime=00%3A00&endDate=2016.02.25&dateType=receiveDate&endTime=24%3A00&beginDate=2016.02.25&_input_charset=utf-8&minAmount=&keyValue=';

var header = {
    "Accept": 'text/html,application/xhtml+xml,application/xml',
    "Accept-Language": 'zh-CN,zh;q=0.8',
    "Cache-Control": 'max-age=0',
    "Connection": 'keep-alive',
    "Cookie": 'JSESSIONID=GZ002aXsq0xIJHVqpn0MkTtmhlT8OaconsumeprodGZ00; cna=DcVRD1E/WkICAXWvtPL2uBgH; BIG_DOOR_SHOWTIME=2016124; unicard1.vm="K1iSL1mnW5fPkpzjDbh2Jg=="; session.cookieNameId=ALIPAYJSESSIONID; JSESSIONID=141727F36CB16BDC1AD27D0B586B451D; NEW_ALIPAY_HOME=2088022634269985; mobileSendTime=-1; credibleMobileSendTime=-1; ctuMobileSendTime=-1; riskMobileBankSendTime=-1; riskMobileAccoutSendTime=-1; riskMobileCreditSendTime=-1; riskCredibleMobileSendTime=-1; riskOriginalAccountMobileSendTime=-1; ctoken=Rq6v3OJTi9vejO8G; LoginForm=alipay_login_auth; alipay="K1iSL1mnW5fPkpzjDbh2JpEIF4KibpuTHXm3qnOXsg=="; CLUB_ALIPAY_COM=2088022634269985; iw.userid="K1iSL1mnW5fPkpzjDbh2Jg=="; ali_apache_tracktmp="uid=2088022634269985"; zone=RZ04B; ALIPAYJSESSIONID=RZ042rX0LuT2PwvnQIvmx9XWEhL3XjauthRZ04GZ00; spanner=5NgMaXYlqPmS2VHoOUsNG94fWZyEekFV4EJoL7C0n0A=',
    "Host": 'consumeprod.alipay.com',
    "Upgrade-Insecure-Requests": 1,
    "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
};


function getInfoByUrl(path, cb) {
    request({
        url:path,
        headers:header
    },function(err,res,body){
        if(err) {
            return console.log('抓取页面数据失败： ' + err);
        }
        cb(body);
    });
}


var count = 0;
setInterval(function() {
    getInfoByUrl(url, function(body) {
        var total = 0;
        var $ = cheerio.load(body);
        $('#tradeRecordsIndex .J-item').each(function(i,e) {
            var time = $(e).children('.time');
            var order = {
                createTime: time.children('.time-d').text().match(/\d+.\d+.\d+/) + ' ' + time.children('.time-h').text().match(/\d+:\d+/),
                orderNum: $(e).children('.tradeNo').children().text().split(':')[1],
                funds: $(e).children('.amount').children().text().split(' ')[1]
            };

            AlipayRecord.findAndModify({
                createTime: order.createTime
            }, [], {$set: order}, {
                new: true,
                upsert: true
            }, function (error, result) {
                if (error) {
                    return console.log('保存抓取数据到数据库失败： ' + error);
                }

                console.log('保存到数据库的记录为： ' + ++total);
                console.log(result);
            });
        })
    });
    console.log(++count, '-----------------------------------------------------');
}, 10000);


