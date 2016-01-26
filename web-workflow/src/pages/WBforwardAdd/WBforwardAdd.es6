$(function () {
    var commentContent = $('.commentContent');
    var forwardTip = $('.forwardTip');
    var commentTip = $('<span class="tips priceTip">(＊提示：目前评论较容易被屏蔽，建议您选择纯转发，选择评论被屏蔽不负责补发)</span>');
    $('#commentForward').click(function () {
        console.log($(this).prop('checked'));
        if ($(this).prop('checked')) {
            forwardTip.remove();
            commentContent.css('display', 'block');
            $(this).next().after(commentTip);
        }
    });

    $('#forward').click(function () {
        if ($(this).prop('checked')) {
            commentTip.remove();
            commentContent.css('display', 'none');
            $('#commentForward').next().after(forwardTip);
        }
    });
});