/**
 * Created by zhouyong10 on 5/20/18.
 */
var webserver = require('webserver').create();
var page = require('webpage').create();
var system = require('system');

var port = 8899;

webserver.listen(port, function(req, res) {
    var url = req.url.split('=')[1];
    page.open(url, function(status) {
        if(status == 'success'){
            var title = page.evaluate(function () {
                return document.getElementById('activity-name').innerText;
            });
            res.write(title);
            res.close();
        }else{
            res.write('get title failed');
            res.close();
        }
    })

    page.onError = function () {
    };
})