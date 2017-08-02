/**
 * Created by ubuntu64 on 8/2/17.
 */
var Utils = require('utils');

$(function () {
    Utils.clipboard();
    Utils.layPrompt('请输入任务的当前阅读量！', '.orderQuit');
    Utils.layPrompt('请输入退款理由！', '.refundProfit');
    Utils.layPrompt('请输入错误处理信息！', '.dealError');
    Utils.breakText();
    Utils.layPage();
});
