/**
 * Created by ubuntu64 on 4/8/16.
 */
var Utils = require('utils');

$(function () {
    Utils.clipboard();
    Utils.layPrompt('请输入拒绝接单的理由！', '.orderRefund');
    Utils.layPrompt('请输入订单初始阅读量！', '.orderComplete');
    Utils.breakText();
    Utils.layPage();
});