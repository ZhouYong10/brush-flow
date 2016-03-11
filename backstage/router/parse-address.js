/**
 * Created by ubuntu64 on 3/11/16.
 */

var request = require('request');
var cheerio = require('cheerio');

var router = require('express').Router();



router.get('/title/by/address', function (req, res) {
    var address = req.query.address;
    request({
        url:address
    },function(err,obj,body){
        if(err) {
            res.send({
                isOk: false,
                message: '对不起，地址解析失败，请联系管理员！'
            })
        }else {
            var $ = cheerio.load(body);
            res.send({
                isOk: true,
                title: $('title').text()
            })
        }
    });
});

module.exports = router;



