/**
 * Created by ubuntu64 on 3/3/16.
 */
var wxSmallType = '<td> ' +
    '<select class="am-form-group am-form-select smallType"> ' +
    '<option value="article">原文</option> ' +
    '<option value="like">阅读点赞</option> ' +
    '<option value="reply">公众粉丝回复</option> ' +
    '<option value="friend">个人好友</option> ' +
    '<option value="code">好友地区扫码</option> ' +
    '</select> ' +
    '</td> ';
var wbSmallType = '<td> ' +
    '<select class="am-form-group am-form-select smallType"> ' +
    '<option value="like">高级赞</option> ' +
    '<option value="vote">投票</option> ' +
    '<option value="fens">顶级粉</option> ' +
    '<option value="forward">转发</option> ' +
    '</select> ' +
    '</td> ';
var mpSmallType = '<td> ' +
    '<select class="am-form-group am-form-select smallType"> ' +
    '<option value="like">点赞</option> ' +
    '<option value="comment">评论</option> ' +
    '<option value="attention">关注</option> ' +
    '<option value="forward">转发</option> ' +
    '</select> ' +
    '</td> ';
var saveBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs save">保存</button> ';
var cancelBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs cancel">取消</button> ';
var changeBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs edit">修改</button> ';
var deleteBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs delete">删除</button> ';
var priceItem = '<tr> ' +
    '<td class="num"></td> ' +
    '<td> ' +
    '<select class="am-form-group am-form-select type"> ' +
    '<option value="wx">微信</option> ' +
    '<option value="mp">美拍</option> ' +
    '<option value="wb">微博</option> ' +
    '</select> ' +
    '</td> ' +
    wxSmallType+
    '<td> <input class="am-form-field am-input-sm name" type="text" placeholder="名称"> </td> ' +
    '<td> <input class="am-form-field am-input-sm adminPrice" type="text" placeholder="管理员价格"> </td> ' +
    '<td> <input class="am-form-field am-input-sm topPrice" type="text" placeholder="顶级代理价格"> </td> ' +
    '<td> <input class="am-form-field am-input-sm superPrice" type="text" placeholder="超级代理价格"> </td> ' +
    '<td> <input class="am-form-field am-input-sm goldPrice" type="text" placeholder="金牌代理价格"> </td> ' +
    '<td> ' +
    saveBtn +
    cancelBtn +
    '</td> ' +
    '</tr>';

$(function () {
    $('#addPrice').click(function () {
        var $tbody = $('.priceWXMPWB tbody');
        var $tr = $(priceItem);
        $tbody.prepend($tr);
        var allTr = $tbody.children();
        for(var i = 0; i < allTr.length; i++) {
            $(allTr[i]).find('.num').text(i + 1);
        }
        registerMethod($tbody);
    })
});

function registerMethod($tbody) {
    $tbody.find('.save').click(function () {
        var parentTd = $(this).parent();
        var $tr = parentTd.parent();
        var product = {
            type: $tr.find('.type').val(),
            typeName: $tr.find('.type').find('option:selected').text(),
            smallType: $tr.find('.smallType').val(),
            smallTypeName: $tr.find('.smallType').find('option:selected').text(),
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

    $tbody.find('.cancel').click(function () {
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

    $tbody.find('.type').change(function() {
        var $parentTd = $(this).parent();
        $parentTd.next().remove();
        var type = $(this).val();
        switch (type) {
            case 'wx':
                $parentTd.after(wxSmallType);
                break;
            case 'wb':
                $parentTd.after(wbSmallType);
                break;
            case 'mp':
                $parentTd.after(mpSmallType);
                break
        }
    })
}