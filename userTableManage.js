const properties = require('./properties')
var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = properties.DB_URL;
/*날짜*/
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = mm + '-' + dd;

exports.findManga = function (msg, callback) {
    var returnMsg = "찾기 원펀맨";
    console.log(typeof msg.text)
    if (msg.text.split(" ").length < 1) {
        winston.log('debug', 'msg.text.split(" ").length', { anything: msg.text.split(" ").length });
        return returnMsg;
    }


    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var collection = db.collection('maru_manga');
        collection.find(
            { 'title': { '$regex': msg.text.replace("찾기 ", "").trim(), '$options': 'x' } }
        ).toArray(function (err, docs) {
            assert.equal(null, err);
            console.log("Found the following records");
            console.log(docs);

            // console.log(docs[0].title);
            // return returnMsg = docs[0].title;
            db.close();
            callback(docs);
        });
    });

}


exports.subscriptionAdd = function (msg) {
    var insertDocument = function (db, callback) {
        db.collection('user').updateOne(
            userPrimaryKey
            , {
                $set: { "subscription_list.1": { title: "", ep: "" } }
            }
            , { upsert: true }, function (err, r) {
                assert.equal(null, err);
                // assert.equal(1, r.matchedCount);
                // assert.equal(1, r.upsertedCount);
                // Finish up test
                callback();
            });
    };

    var chat_id, start_date, subscription_list, title, ep;
    var userPrimaryKey = { chat_id: msg.chat.id };
    var userJson = { chat_id: msg.chat.id, start_date: today, subscription_list: [{ title: "", ep: "" }] };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function () {
            winston.log('info', 'MongoDb Log Message', { anything: "close to server." });
            db.close();
        })
        winston.log('info', 'MongoDb Log Message', { anything: "Connected correctly to server." });
    });
}
exports.userTableManageFunc = function (msg) {
    var insertDocument = function (db, callback) {
        db.collection('user').updateOne(
            userPrimaryKey
            , userJson
            , { upsert: true }, function (err, r) {
                assert.equal(null, err);
                // assert.equal(1, r.matchedCount);
                // assert.equal(1, r.upsertedCount);
                // Finish up test
                callback();
            });
    };


    var chat_id, start_date, subscription_list, title, ep;
    var userPrimaryKey = { chat_id: msg.chat.id };
    var userJson = { chat_id: msg.chat.id, start_date: today, subscription_list: [{ title: "", ep: "" }] };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function () {
            winston.log('info', 'MongoDb Log Message', { anything: "close to server." });
            db.close();
        })
        winston.log('info', 'MongoDb Log Message', { anything: "Connected correctly to server." });
    });
}