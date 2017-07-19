/**
 * Created by ubuntu64 on 7/19/17.
 */
var Utils = require('utils');

$(function () {
    Utils.clipboard();
    Utils.layPrompt('请输入拒绝提现的理由！', '.refused');
    Utils.layPage();

    $('.getUserFunds').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        var href = $this.attr('href');
        $.get(href, function(data) {
            $this.parent().find('.userNowFunds').text(data);
        })
    })
});
