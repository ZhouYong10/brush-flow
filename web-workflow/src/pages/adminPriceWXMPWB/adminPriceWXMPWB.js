/**
 * Created by ubuntu64 on 3/3/16.
 */
$(function () {
    $('#addPrice').click(function () {
        var $tbody = $('.priceWXMPWB tbody');
        var trStr = '<tr> ' +
            '<td class="num"></td> ' +
            '<td> ' +
            '<select class="am-form-group am-form-select type"> ' +
            '<option value="mp">美拍</option> ' +
            '<option value="wx">微信</option> ' +
            '<option value="wb">微博</option> ' +
            '</select> ' +
            '</td> ' +
            '<td> <input class="am-form-field am-input-sm name" type="text" placeholder="名称"> </td> ' +
            '<td> <input class="am-form-field am-input-sm adminPrice" type="text" placeholder="管理员价格"> </td> ' +
            '<td> <input class="am-form-field am-input-sm topPrice" type="text" placeholder="顶级代理价格"> </td> ' +
            '<td> <input class="am-form-field am-input-sm superPrice" type="text" placeholder="超级代理价格"> </td> ' +
            '<td> <input class="am-form-field am-input-sm goldPrice" type="text" placeholder="金牌代理价格"> </td> ' +
            '<td> ' +
            '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs change">修改</button> ' +
            '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs delete">删除</button> ' +
            '</td> ' +
            '</tr>';
        var $tr = $(trStr);
        $tr.find('.num').text($tbody.children().length + 1);
        $tbody.append($tr);
    })
});

