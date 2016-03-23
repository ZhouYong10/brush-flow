/**
 * Created by ubuntu64 on 3/10/16.
 */
Number.prototype.toFixed = function(d) {

    var s=this+"";if(!d)d=0;

    if(s.indexOf(".")==-1)s+=".";s+=new Array(d+1).join("0");

    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+ (d+1) +"})?)\\d*$").test(s))

    {

        var s="0"+ RegExp.$2, pm=RegExp.$1, a=RegExp.$3.length, b=true;

        if (a==d+2){a=s.match(/\d/g); if (parseInt(a[a.length-1])>4)

        {

            for(var i=a.length-2; i>=0; i--) {a[i] = parseInt(a[i])+1;

                if(a[i]==10){a[i]=0; b=i!=1;} else break;}

        }

            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

        }if(b)s=s.substr(1);return (pm+s).replace(/\.$/, "");} return this+"";

};

module.exports = {
    parseAddress: function(httpObj,address) {
        return new Promise(function(resolve, reject) {
            httpObj.get('/parse/title/by/address', {address: address})
                .then(function (res) {
                    console.log(res, '=============================');
                    var result = res.data;
                    if(result.isOk) {
                        resolve(result.title);
                    }else {
                        reject(result.message);
                    }
                });
        });
    },
    isNum: function(val) {
        if(val == ''){
            return true;
        }else{
            return /^[0-9]*[1-9][0-9]*$/.test(val);
        }
    },
    min100: function(val) {
        return parseInt(val) >= 100;
    },
    min20: function(val) {
        return parseInt(val) >= 20;
    },
    min30: function(val) {
        return parseInt(val) >= 30;
    },
    isfloat: function(val) {
        return /^\d+(\.\d+)?$/.test(val);
    },
    layPage: function(id, pagesCount) {
        laypage({
            cont: id ? id : 'laypage',
            pages: pagesCount ? pagesCount : $('#pages').val(), //可以叫服务端把总页数放在某一个隐藏域，再获取。假设我们获取到的是18
            skin: 'molv', //皮肤
            skip: true, //是否开启跳页
            groups: 3, //连续显示分页数
            last: pagesCount ? pagesCount : $('#pages').val(),
            curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function(e, first){ //触发分页后的回调
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    location.href = '?page='+e.curr;
                }
            }
        });
    },
    isFreeze: function (cla) {
        var clas = cla ? cla : '.addTask';
        $(clas).click(function(e) {
            if($('#userStatus').val() == '冻结'){
                e.stopPropagation();
                e.preventDefault();
                layer.msg('对不起，您的账户已被冻结，请联系管理员！', {time: 3000});
            }
        })
    },
    breakText: function(cla) {
        var clas = cla ? cla : '.text-break';
        $(clas).click(function () {
            var self = this;
            layer.alert($(self).text());
        });
    },
    layPrompt: function(title, cla) {
        var clas = cla ? cla : '.orderError';

        layer.config({
            extend: 'extend/layer.ext.js'
        });

        $(clas).click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            var href = $(this).attr('href');
            layer.prompt({
                formType: 2,
                title: title,
                offset: '6%'
            }, function (value, index) {
                href += '&info=' + value.replace(/\r\n/g,"").replace(/\n/g,"");
                layer.close(index);
                $('<a href=' + href + '></a>').get(0).click();
            });
        });
    }
};