import * as mongoose from "mongoose";

const properties = require('./properties')
const TelegramBot = require('node-telegram-bot-api');
const token = properties.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const hyuk_chat_id = properties.HYUK_CHAT_ID;

var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = properties.DB_URL;

const maruMangaSchema = new mongoose.Schema({

})
class MaruMangaCollection {
    "titleId": String;//"백 투 더 엄마 9화",
    "title": String;//"백 투 더 엄마",
    "ep": String;//"9화",
    "url": String;//"http://minitoon.net/bbs/board.php?bo_table=9999&wr_id=20181&page=1",
    "date": String;//"10-15"
}

var funcFindManga = function (msg: String, callback) {

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        // console.log("Connected correctly to server");
        var collection = db.collection('maru_manga');
        collection.find(
            { title: { $eq: msg } }
        ).toArray(function (err, docs: [MaruMangaCollection]) {
            assert.equal(null, err);
            console.log(" regex msg " + msg)
            console.log("Found the following records");
            console.log(docs);

            // console.log(docs[0].title);
            // return returnMsg = docs[0].title;
            db.close();
            callback(docs);
        });
    });
}

var my_manga_list = [
    '빗치 같은 게 아냐', '이세계 온천으로 전생한 내 효능이 너무 쩐다', '해골기사님은 지금 이세계 모험 중', '부덕의 길드', '내 공주구두를 신어줘', '집사들의 침묵', '원펀맨 오리지날', '원펀맨 리메이크', '패러렐 파라다이스', '히비키 -소설가가 되는 방법-', '인어공주의 미안한 식사', '이상적인 기둥서방 생활', '여친, 빌리겠습니다', '미소년 잘 먹겠습니다', '알몸카메라', '노조미X키미오', '마왕을 시작하는 법', '마지널 오퍼레이션', '하면 안 되는 나나코 씨'
]

for (let element of my_manga_list) {
    console.log(element)
    funcFindManga(element, function (docs: [MaruMangaCollection]) {

        for (let doc of docs) {
            bot.sendMessage(hyuk_chat_id, doc.title + " " + doc.url);
        }
    })
}