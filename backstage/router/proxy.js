/**
 * Created by ubuntu64 on 8/17/17.
 */

var router = require('express').Router();

router.post('/wx/title/and/read/num', function (req, res) {
    console.log(req.body, '==========================');
    var title = req.body.title;
    var readNum = req.body.readNum;
    var likeNum = req.body.likeNum;
    console.log('文章标题：', title);
    console.log('文章阅读数：', readNum);
    console.log('文章点赞数：', likeNum);

    res.send('It is OK !');
});


module.exports = router;