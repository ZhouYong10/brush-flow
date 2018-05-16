/**
 * Created by ubuntu64 on 3/5/16.
 */

var saveBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs save">保存</button> ';
var cancelBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs cancel">取消</button> ';
var changeSaveBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs changeSave">保存</button> ';
var giveUpBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs giveUp">放弃</button> ';
var changeBtn = '<button type="button" class="am-btn am-btn-primary am-radius am-btn-xs edit">修改</button> ';

var priceItem = '<tr> ' +
    '<td class="num"></td> ' +
    '<td> <input class="am-form-field am-input-sm name" type="text" placeholder="名称"> </td> ' +
    '<td> <input class="am-form-field am-input-sm price" type="text" placeholder="管理员价格"> </td> ' +
    '<td> <input class="am-form-field am-input-sm toParent" type="text" placeholder="顶级代理价格"> </td> ' +
    '<td> ' +
    saveBtn +
    cancelBtn +
    '</td> ' +
    '</tr>';

var priceItemText = '<tr> ' +
    '<td class="num"></td> ' +
    '<td class="name"> </td> ' +
    '<td class="price"> </td> ' +
    '<td class="toParent"> </td> ' +
    '<td class="operation"> </td> ' +
    '</tr>';

var $changeItemTrs = [] ;

$(function () {
    registerEditDelete($('.priceFlow tbody'));
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
        $newParentTr.find('.name').val($parentTr.find('.name').text());
        $newParentTr.find('.price').val($parentTr.find('.price').text());
        $newParentTr.find('.toParent').val($parentTr.find('.toParent').text());

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
}

function registerChangeSaveGiveUp($tbody) {
    $tbody.find('.changeSave').off().click(function () {
        var $parentTd = $(this).parent();
        var $tr = $parentTd.parent();
        var product = {
            id: $tr.find('.giveUp').next().val(),
            name: $tr.find('.name').val(),
            price: $tr.find('.price').val(),
            toParent: $tr.find('.toParent').val()
        };
        $.post('/admin/user/update/price/update', product, function() {
            var $priceItemText = $(priceItemText);
            var num = $tr.find('.num').text();

            $priceItemText.find('.num').text(num);
            $priceItemText.find('.name').text(product.name);
            $priceItemText.find('.price').text(product.price);
            $priceItemText.find('.toParent').text(product.toParent);
            $priceItemText.find('.operation').append($(changeBtn + '<input type="hidden" value="' + product.id + '">'));
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
