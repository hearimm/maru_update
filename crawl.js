const properties = require('./properties')
exports.crawlFunc = function () {
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

    var cheerio = require('cheerio');
    var winston = require('winston');

    var mongoInsert = function (primaryKey, json, callback) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var url = properties.DB_URL;

        var insertDocument = function (db, callback) {
            db.collection('maru_manga').updateOne(
                primaryKey
                , json
                , { upsert: true }, function (err, r) {
                    assert.equal(null, err);
                    // assert.equal(1, r.matchedCount);
                    // assert.equal(1, r.upsertedCount);
                    // Finish up test
                    callback();
                });
        };

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db, function () {
                winston.log('info', 'MongoDb Log Message', { anything: "close to server." });
                db.close();
            })
            winston.log('info', 'MongoDb Log Message', { anything: "Connected correctly to server." });
        });
    }


    const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver');

    let driver = new Builder()
        .withCapabilities(Capabilities.phantomjs())
        .build();

    driver.get('http://minitoon.net/bbs/board.php?bo_table=9999&page=1');
    driver.findElement(By.id('gall_ul')).getAttribute("innerHTML").then(function (html) {
        var $ = cheerio.load(html);
        jsonList = [];

        $('.gall_con').filter(function () {

            var title, ep, url, date;
            var primaryKey = { title_id: "" }
            var json = { title_id: "", title: "", ep: "", url: "", date: "" };

            var data = $(this);

            var title_id = data.find(".list_subject").text().trim();
            var epMatch = title_id.match(/\d*(화|권)/g);
            if (Array.isArray(epMatch)) {
                ep = epMatch[0];
            } else {
                ep = "";
            }
            title = title_id.replace(/\d*(화|권)/g, "").trim();
            url = data.find(".gall_href > a").attr("href").trim();

            data.find(".gall_text_href").next().children().remove(); // <span>등록일</>

            date = data.find(".gall_text_href").next().text();
            if (date.indexOf(":") > 0) {
                date = today;
            }
            // Once we have our title, we'll store it to the our json object.
            primaryKey.title_id = title_id;
            json.title_id = title_id;
            json.title = title;
            json.ep = ep;
            json.url = url;
            json.date = date;

            // winston.log('info', 'Crawler Log Message', { anything: json });

            jsonList.push(json);

            mongoInsert(primaryKey, json);

        })
    })
    driver.quit();
}