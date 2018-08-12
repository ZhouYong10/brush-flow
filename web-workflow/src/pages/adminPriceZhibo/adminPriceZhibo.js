/**
 * Created by ubuntu64 on 3/5/16.
 */
var smallType = '<td> ' +
    '<select class="am-form-group am-form-select smallType"> ' +
    '<option value="DYfans">抖音粉丝</option> ' +
    '<option value="DYplay">抖音播放</option> ' +
    '<option value="DYcomment">抖音评论</option> ' +
    '<option value="DYlike">抖音点赞</option> ' +
    '<option value="DYshare">抖音分享</option> ' +
    '<option value="QMfans">全名Ｋ歌粉丝</option> ' +
    '<option value="QMflower">全名Ｋ歌鲜花</option> ' +
    '<option value="QMcomment">全名Ｋ歌评论</option> ' +
    '<option value="QMlisten">全名Ｋ歌试听</option> ' +
    '<option value="QMforward">全名Ｋ歌转发</option> ' +
    '<option value="KSfans">快手粉丝</option> ' +
    '<option value="KSlike">快手点赞</option> ' +
    '<option value="KSplay">快手播放</option> ' +
    '<option value="KScomment">快手评论</option> ' +
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
    smallType+
    '<td> <input class="am-form-field am-input-sm name" type="text" placeholder="名称"> </td> ' +
    '<td> <input class="am-form-field am-input-sm adminPrice" type="text" placeholder="价格"> </td> ' +
    '<td> ' +
    saveBtn +
    cancelBtn +
    '</td> ' +
    '</tr>';
var priceItemText = '<tr> ' +
    '<td class="num"></td> ' +
    '<td class="smallType"><span></span> <input type="hidden" value=""></td> ' +
    '<td class="name"> </td> ' +
    '<td class="adminPrice"> </td> ' +
    '<td class="operation"> </td> ' +
    '</tr>';
var $changeItemTrs = [] ;

$(function () {
    registerEditDelete($('.priceFlow tbody'));

    $('#addPrice').off().click(function () {
        var $tbody = $('.priceFlow tbody');
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
    $tbody.find('.edit').off().click(function () {
        var self = this;
        var $parentTd = $(self).parent();
        var $parentTr = $parentTd.parent();
        var num = $parentTr.find('.num').text();
        $changeItemTrs[num] = $parentTr;

        var $newParentTr = $(priceItem);

        var $newBtnParent = $newParentTr.find('.save').parent();
        $newBtnParent.children().remove();
        $newBtnParent.append($(changeSaveBtn + giveUpBtn + '<input type="hidden" value="'+$parentTr.find('.operation input').val()+'">'));

        $newParentTr.find('.num').text(num);
        $newParentTr.find('.smallType').val($parentTr.find('.smallType input').val());
        $newParentTr.find('.name').val($parentTr.find('.name').text());
        $newParentTr.find('.adminPrice').val($parentTr.find('.adminPrice').text());

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

    $tbody.find('.delete').off().click(function () {
        var self = this;
        var $parentTd = $(self).parent();
        var $parentTr = $parentTd.parent();
        var id = $parentTd.find('input').val();
        var index = layer.confirm('您确定要删除么？', function(){
            $.post('/admin/price/zhibo/delete', {id: id}, function (result) {
                $parentTr.remove();
                resortNum($tbody);
                layer.close(index);
                layer.msg('删除成功！');
            });
        });
    });
}

function registerChangeSaveGiveUp($tbody) {
    $tbody.find('.changeSave').off().click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
        var product = {
            id: $tr.find('.giveUp').next().val(),
            smallType: $tr.find('.smallType').val(),
            smallTypeName: $tr.find('.smallType').find('option:selected').text(),
            name: $tr.find('.name').val(),
            price: $tr.find('.adminPrice').val(),
        };
        $.post('/admin/price/zhibo/update', product, function() {
            var $priceItemText = $(priceItemText);
            var num = $tr.find('.num').text();

            $priceItemText.find('.num').text(num);
            $priceItemText.find('.smallType span').text(product.smallTypeName);
            $priceItemText.find('.smallType input').val(product.smallType);
            $priceItemText.find('.name').text(product.name);
            $priceItemText.find('.adminPrice').text(product.price);
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

    $tbody.find('.giveUp').off().click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
        var num = $tr.find('.num').text();

        var $aim ;
        if($tr.prev().length > 0) {
            $aim = $tr.prev();
            $tr.remove();
            $aim.after($changeItemTrs[num]);
        }else {
            $aim = $tr.parent();
            $tr.remove();
            $aim.prepend($changeItemTrs[num]);
        }
        registerEditDelete($tbody);
    });
}

function registerSaveCancel($tbody) {
    $tbody.find('.save').off().click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
        var product = {
            type: 'zhibo',
            typeName: '直播业务',
            smallType: $tr.find('.smallType').val(),
            smallTypeName: $tr.find('.smallType').find('option:selected').text(),
            name: $tr.find('.name').val(),
            price: $tr.find('.adminPrice').val(),
        };
        $.post('/admin/price/zhibo', product, function(result) {
            var $priceItemText = $(priceItemText);
            var num = $tr.find('.num').text();

            $priceItemText.find('.num').text(num);
            $priceItemText.find('.smallType span').text(result.smallTypeName);
            $priceItemText.find('.smallType input').val(result.smallType);
            $priceItemText.find('.name').text(result.name);
            $priceItemText.find('.adminPrice').text(result.price);
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

    $tbody.find('.cancel').off().click(function () {
        var self = this;
        var index = layer.confirm('您确定要取消么？', function(){
            var $tr = $(self).parent().parent();
            $tr.remove();
            resortNum($tbody);
            layer.close(index);
        });
    });
}