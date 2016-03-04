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
var changeSaveBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs changeSave">保存</button> ';
var giveUpBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs giveUp">放弃</button> ';
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
var priceItemText = '<tr> ' +
    '<td class="num"></td> ' +
    '<td class="type"><span></span> <input type="hidden" value=""></td> ' +
    '<td class="smallType"><span></span> <input type="hidden" value=""></td> ' +
    '<td class="name"> </td> ' +
    '<td class="adminPrice"> </td> ' +
    '<td class="topPrice"> </td> ' +
    '<td class="superPrice"> </td> ' +
    '<td class="goldPrice"> </td> ' +
    '<td class="operation"> </td> ' +
    '</tr>';
var $changeItemTr ;

$(function () {
    registerEditDelete($('.priceWXMPWB tbody'));

    $('#addPrice').click(function () {
        var $tbody = $('.priceWXMPWB tbody');
        var $tr = $(priceItem);
        $tbody.prepend($tr);
        resortNum($tbody);
        registerSaveCancel($tbody);
    })
});

function resortNum($tbody) {
    var allTr = $tbody.children();
    for(var i = 0; i < allTr.length; i++) {
        $(allTr[i]).find('.num').text(i + 1);
    }
}

function registerEditDelete($tbody) {
    $tbody.find('.edit').click(function () {
        var self = this;
        var $parentTd = $(self).parent();
        var $parentTr = $parentTd.parent();
        $changeItemTr = $parentTr;
        var num = $parentTr.find('.num').text();
        var typeName = $parentTr.find('.type span').text();

        var $newParentTr = $(priceItem);
        var $newSmallTypeTd = $newParentTr.find('.smallType').parent();
        var $newSmallTypeTdPrev = $newSmallTypeTd.prev();
        switch (typeName) {
            case '美拍':
                $newSmallTypeTd.remove();
                $newSmallTypeTdPrev.after($(mpSmallType));
                break;
            case '微博':
                $newSmallTypeTd.remove();
                $newSmallTypeTdPrev.after($(wbSmallType));
                break;
        }
        var $newBtnParent = $newParentTr.find('.save').parent();
        $newBtnParent.children().remove();
        $newBtnParent.append($(changeSaveBtn + giveUpBtn + '<input type="hidden" value="'+$parentTr.find('.operation input').val()+'">'));

        $newParentTr.find('.num').text(num);
        $newParentTr.find('.type').val($parentTr.find('.type input').val());
        $newParentTr.find('.smallType').val($parentTr.find('.smallType input').val());
        $newParentTr.find('.name').val($parentTr.find('.name').text());
        $newParentTr.find('.adminPrice').val($parentTr.find('.adminPrice').text());
        $newParentTr.find('.topPrice').val($parentTr.find('.topPrice').text());
        $newParentTr.find('.superPrice').val($parentTr.find('.superPrice').text());
        $newParentTr.find('.goldPrice').val($parentTr.find('.goldPrice').text());

        var $aim ;
        if(num == 1) {
            $aim = $parentTr.parent();
            $parentTr.remove();
            $aim.prepend($newParentTr);
        }else {
            $aim = $parentTr.prev();
            $parentTr.remove();
            $aim.after($newParentTr);
        }
        registerChangeSaveGiveUp($tbody);
    });

    $tbody.find('.delete').click(function () {
        var self = this;
        var $parentTd = $(self).parent();
        var $parentTr = $parentTd.parent();
        var id = $parentTd.find('input').val();
        var index = layer.confirm('您确定要删除么？', function(){
            $.post('/admin/price/WX/MP/WB/delete', {id: id}, function (result) {
                $parentTr.remove();
                resortNum($tbody);
                layer.close(index);
                layer.msg('删除成功！');
            });
        });
    });
}

function registerChangeSaveGiveUp($tbody) {
    $tbody.find('.changeSave').click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
        var product = {
            id: $tr.find('.giveUp').next().val(),
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
        $.post('/admin/price/WX/MP/WB/update', product, function() {
            var $priceItemText = $(priceItemText);
            var num = $tr.find('.num').text();

            $priceItemText.find('.num').text(num);
            $priceItemText.find('.type span').text(product.typeName);
            $priceItemText.find('.type input').val(product.type);
            $priceItemText.find('.smallType span').text(product.smallTypeName);
            $priceItemText.find('.smallType input').val(product.smallType);
            $priceItemText.find('.name').text(product.name);
            $priceItemText.find('.adminPrice').text(product.adminPrice);
            $priceItemText.find('.topPrice').text(product.topPrice);
            $priceItemText.find('.superPrice').text(product.superPrice);
            $priceItemText.find('.goldPrice').text(product.goldPrice);
            $priceItemText.find('.operation').append($(changeBtn + deleteBtn + '<input type="hidden" value="' + product.id + '">'));
            var $aim ;
            if($tr.prev().length > 0) {
                $aim = $tr.prev();
                $tr.remove();
                $aim.after($priceItemText);
            }else {
                $aim = $tr.parent();
                $tr.remove();
                $aim.prepend($priceItemText);
            }
            registerEditDelete($tbody);
        })
    });

    $tbody.find('.giveUp').click(function () {

    });
}

function registerSaveCancel($tbody) {
    $tbody.find('.save').click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
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
            var $priceItemText = $(priceItemText);
            var num = $tr.find('.num').text();

            console.log(result);
            $priceItemText.find('.num').text(num);
            $priceItemText.find('.type span').text(result.typeName);
            $priceItemText.find('.type input').val(result.type);
            $priceItemText.find('.smallType span').text(result.smallTypeName);
            $priceItemText.find('.smallType input').val(result.smallType);
            $priceItemText.find('.name').text(result.name);
            $priceItemText.find('.adminPrice').text(result.adminPrice);
            $priceItemText.find('.topPrice').text(result.topPrice);
            $priceItemText.find('.superPrice').text(result.superPrice);
            $priceItemText.find('.goldPrice').text(result.goldPrice);
            $priceItemText.find('.operation').append($(changeBtn + deleteBtn + '<input type="hidden" value="' + result._id + '">'));

            var $aim ;
            if($tr.prev().length > 0) {
                $aim = $tr.prev();
                $tr.remove();
                $aim.after($priceItemText);
            }else {
                $aim = $tr.parent();
                $tr.remove();
                $aim.prepend($priceItemText);
            }
            registerEditDelete($tbody);
        })
    });

    $tbody.find('.cancel').click(function () {
        var self = this;
        var index = layer.confirm('您确定要取消么？', function(){
            var $tr = $(self).parent().parent();
            $tr.remove();
            resortNum($tbody);
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