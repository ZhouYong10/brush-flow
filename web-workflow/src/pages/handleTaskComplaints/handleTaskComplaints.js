/**
 * Created by ubuntu64 on 4/14/16.
 */
var Utils = require('utils');

$(function () {
    $('.fancybox').fancybox();
    Utils.layPrompt('请输入错误原因！');
    Utils.breakText();
    Utils.isFreeze();
    Utils.layPage();
});