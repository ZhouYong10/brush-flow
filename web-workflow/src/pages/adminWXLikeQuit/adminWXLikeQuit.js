/**
 * Created by ubuntu64 on 4/8/16.
 */
var Utils = require('utils');

$(function () {
    Utils.clipboard();
    Utils.layPrompt('请输入任务的当前阅读量！', '.orderQuit');
    Utils.breakText();
    Utils.layPage();
});