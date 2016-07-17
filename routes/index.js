var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/**
 * Search on Google
 *
 * */
router.get('/search', function (req, res) {
    googleSearch = req.query.search;
    url = "https://www.google.com/search?q=" + googleSearch + "&num=15";
    var requestOptions = {encoding: 'binary', method: "GET", uri: url};

    request(requestOptions, function (error, response, body) {
        if (error) {
            console.log("Couldn’t get page because of error:" + error);
            return;
        }
        res.contentType('application/json');
        res.send(JSON.stringify(getResultList(body)));
    });
});

/**
 * Scrape Google Search Result
 * Store the Header , Link and Description
 */
function getResultList(body) {
    var $ = cheerio.load(body);
    var parentFieldList = $(".g ");
    var results = [];
    parentFieldList.each(function (i, parentField) {

        var header = $(parentField).find($('.r a')).text();
        var sourceLable = $(parentField).find($('.r a')).attr('href');
        var description = $(parentField).find($('.st')).text();

        if (sourceLable != undefined) {
            sourceLable = cleanLink(sourceLable);
            if (results.length < 10 && (sourceLable != "")) {
                results.push({name: header, source: sourceLable, description: description});
            }
        }
    });
    return results;
}

/**
 * Remove Unnecessary character(s)
 */
function cleanLink(sourceLable) {
    var sourceLable = sourceLable.replace("/url?q=", "").split("&")[0];
    if (sourceLable.charAt(0) == "/") {
        return "";
    }

    if (sourceLable.charAt(sourceLable.length - 1) == "/") {
        sourceLable = sourceLable.slice(0, -1);
    }

    return sourceLable;
}

module.exports = router;
