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
            '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs change">保存</button> ' +
            '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs delete">取消</button> ' +
            '</td> ' +
            '</tr>';
        var $tr = $(trStr);
        $tr.find('.num').text($tbody.children().length + 1);
        $tbody.append($tr);
        registerMethod($tbody);
    })
});

function registerMethod($tbody) {
    $tbody.find('.change').click(function () {
        var parentTd = $(this).parent();
        var $tr = parentTd.parent();
        var product = {
            type: $tr.find('.type').val(),
            name: $tr.find('.name').val(),
            adminPrice: $tr.find('.adminPrice').val(),
            topPrice: $tr.find('.topPrice').val(),
            superPrice: $tr.find('.superPrice').val(),
            goldPrice: $tr.find('.goldPrice').val()
        };
        $.post('/admin/price/WX/MP/WB', product, function(result) {
            console.log(result);
        })
    });

    $tbody.find('.delete').click(function () {
        var self = this;
        var index = layer.confirm('您确定要取消么？', function(){
            var $tr = $(self).parent().parent();
            $tr.remove();
            var allTr = $tbody.children();
            for(var i = 0; i < allTr.length; i++) {
                $(allTr[i]).find('.num').text(i + 1);
            }

            layer.close(index);
        });
    });
}