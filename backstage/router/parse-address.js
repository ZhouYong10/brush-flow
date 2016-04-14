/**
 * Created by ubuntu64 on 3/11/16.
 */
var Address = require('../models/Address');

var router = require('express').Router();


router.post('/wx/title/by/address', function (req, res) {
    var address = req.body.address;
    Address.parseWxTitle(address)
        .then(function (obj) {
            res.send(obj);
        }, function (obj) {
            res.send(obj);
        });
});

router.post('/title/by/address', function (req, res) {
    var address = req.body.address;
    Address.parseMpTitle(address)
        .then(function (obj) {
            res.send(obj);
        }, function (obj) {
            res.send(obj);
        });
});

module.exports = router;



