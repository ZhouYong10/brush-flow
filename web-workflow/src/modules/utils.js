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
    }
};