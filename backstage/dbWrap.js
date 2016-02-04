/**
 * Created by zhouyong10 on 2/4/16.
 */
var db = require('./db');
var collection ;

function haveCollection(resolve, reject) {
    if(!collection) {
        reject(Error('数据库连接不存在。'));
    }
    resolve();
}

function findOne(obj) {
    return new Promise(function(resolve, reject) {
        haveCollection(function () {
            collection.findOne(obj, function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result);
            })
        }, reject);
    })
}

function remove(obj) {
    return new Promise(function(resolve, reject) {
        haveCollection(function () {
            collection.remove(obj, function(error, result) {
                if(error) {
                    reject(error);
                }
                resolve(result);
            });
        }, reject);
    })
}

module.exports = {
    openCollection: function(colName) {
        collection = db.getCollection((colName));
        return this;
    },
    findById: function(id) {
        return findOne({_id: db.toObjectID(id)});
    },
    findOne: function(obj) {
        return findOne(obj);
    },
    find: function(obj) {
        var userObj = obj ? obj : null;
        return new Promise(function(resolve, reject) {
            haveCollection(function () {
                collection.find(userObj)
                    .toArray(function (error, result) {
                        if (error) {
                            reject(error);
                        }
                        resolve(result);
                    })
            }, reject);
        })
    },
    insert: function(obj) {
        return new Promise(function(resolve, reject) {
            haveCollection(function () {
                collection.insert(obj, function (error, result) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                })
            }, reject);
        })
    },
    update: function(query, update, sort) {
        var sortBy = sort ? sort : [];
        return new Promise(function(resolve, reject) {
            haveCollection(function () {
                collection.findAndModify(query, sortBy, update, {new: true, upsert: true}, function (error, result) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                })
            }, reject);
        })
    },
    removeById: function(id) {
        return remove({
            _id: db.toObjectID(id)
        });
    },
    remove: function(obj) {
        return remove(obj);
    }
};
