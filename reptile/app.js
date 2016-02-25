/**
 * Created by ubuntu64 on 2/24/16.
 */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = 'https://consumeprod.alipay.com/record/advanced.htm?beginDate=2016.02.25&beginTime=00%3A00&endDate=2016.02.25&endTime=24%3A00&dateRange=today&status=success&keyword=bizOutNo&keyValue=&dateType=createDate&minAmount=&maxAmount=&fundFlow=in&tradeType=ALL&categoryId=&_input_charset=utf-8';

var header = {
    "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    "Accept-Encoding": 'UTF-8',
    "Accept-Language": 'zh-CN,zh;q=0.8',
    "Cache-Control": 'max-age=0',
    "Connection": 'keep-alive',
    "Cookie": 'JSESSIONID=RZ13qdvjgFg96G8HwQUtdJ1WEge0jCauthGZ00RZ04; cna=DcVRD1E/WkICAXWvtPL2uBgH; BIG_DOOR_SHOWTIME=2016124; unicard1.vm="K1iSL1mnW5fPkpzjDbh2Jg=="; session.cookieNameId=ALIPAYJSESSIONID; JSESSIONID=8545F4107BB21A39582670EC9F8AE3EC; mobileSendTime=-1; credibleMobileSendTime=-1; ctuMobileSendTime=-1; riskMobileBankSendTime=-1; riskMobileAccoutSendTime=-1; riskMobileCreditSendTime=-1; riskCredibleMobileSendTime=-1; riskOriginalAccountMobileSendTime=-1; ctoken=h4eHq33UJv2Q7Jpn; LoginForm=alipay_login_auth; alipay="K1iSL1mnW5fPkpzjDbh2JpEIF4KibpuTHXm3qnOXsg=="; CLUB_ALIPAY_COM=2088022634269985; iw.userid="K1iSL1mnW5fPkpzjDbh2Jg=="; ali_apache_tracktmp="uid=2088022634269985"; zone=RZ04A; NEW_ALIPAY_HOME=2088022634269985; ALIPAYJSESSIONID=RZ04OlzbJXp9EcPKBz5bIVI1nsUMisauthRZ04GZ00; spanner=5NgMaXYlqPmS2VHoOUsNG94fWZyEekFV4EJoL7C0n0A=',
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
        var fileName = 0;
        var $ = cheerio.load(body);
        $('#tradeRecordsIndex .J-item').each(function(i,e) {
            fileName++;
            var time = $(e).children('.time');
            var order = {
                createTime: time.children('.time-d').text().match(/\d+.\d+.\d+/) + ' ' + time.children('.time-h').text().match(/\d+:\d+/),
                orderNum: $(e).children('.tradeNo').children().text().split(':')[1],
                //username: $(e).children('.other').children('.name').text().replace(/\n+\t+/g,''),
                funds: $(e).children('.amount').children().text().split(' ')[1]
            };
            console.log(order,'==================================');
            fs.writeFile(fileName+'', i+'======'+order.createTime+'======'+order.orderNum+'======'+order.funds, function (err) {
                if (err) {
                    return console.log('写入文件出错： ' + err);
                }
                console.log('写入文件成功！！！！！！！！！！！！！！！！！！！');
            });
        })
    });
    console.log(++count,'------------------------------------------');
}, 10000);


