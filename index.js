const properties = require('./properties')

const TelegramBot = require('node-telegram-bot-api');
const token = properties.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });
var crawl = require('./crawl');
var userTableManage = require('./userTableManage')


bot.on('message', (msg) => {

    var hi = "hi";
    if (msg.text.toLowerCase().indexOf(hi) === 0) {
        userTableManage.userTableManageFunc(msg);
        bot.sendMessage(msg.chat.id, "Hello dear user" + msg.from.first_name);
    }

    var bye = "bye";
    if (msg.text.toLowerCase().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
    }

    var findText = "찾기";
    if (msg.text.toLowerCase().includes(findText)) {
        returnMsg = userTableManage.findManga(msg, function (docs) {
            winston.log('info', 'findManga Log Message', { anything: docs });
            docs.forEach(function (element) {
                bot.sendMessage(msg.chat.id, element.title);
            }, this);
            // bot.sendMessage(msg.chat.id, returnMsg);
        });
    }

    var testText = "test";
    if (msg.text.toLowerCase().indexOf(testText) === 0) {
        crawl.crawlFunc();
        bot.sendMessage(msg.chat.id, "Hello dear user" + msg.from.first_name);
    }

});

var winston = require('winston');

winston.log('info', 'Hello from Winston!');
winston.info('This also works');

// 마지막값으로 meta object 를 넘길 수 있고
// 확장적인 logging 을 할 수 있습니다.
winston.log('info', 'Test Log Message', { anything: 'This is metadata' });



var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


/**
 * 크롤러 시작
 */
app.get('/scrape', function (req, res) {

    url = 'https://marumaru.in/?c=26&p=1';

    request(url, function (error, response, html) {
        winston.log('info', 'response Log Message', { anything: html });
        if (!error) {

            var $ = cheerio.load(html);
            // winston.log('info', 'Test Log Message', { anything: "test" });

            jsonList = [];
            var title, url, date;
            var json = { title: "", url: "", date: "" };

            // We'll use the unique header class as a starting point.

            $('.td_subject').filter(function () {

                // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

                // In examining the DOM we notice that the title rests within the first child element of the header tag. 
                // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                title = data.find("a > div:nth-child(2)").text().trim();
                url = data.find(".subj").attr("href").trim();

                date = data.find("small").text()
                // Once we have our title, we'll store it to the our json object.

                json.title = title;
                json.url = url;
                json.date = date;

                winston.log('info', 'Test Log Message', { anything: json });

                jsonList.push(json);

            })
        } else {
            winston.log('error', 'erro Log Message', { anything: error });
        }

        res.send(jsonList)
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;