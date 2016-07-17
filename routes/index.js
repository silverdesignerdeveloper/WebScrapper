var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Search on Google
 *
 * */
router.get('/search', function (req, res) {
  googleSearch = req.query.search;
  url = "https://www.google.com/search?q=" + googleSearch + "&num=11";

  request(url, function (error, response, body) {
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
    var sourceLable = $(parentField).find($('cite')).text();
    var description = $(parentField).find($('.st')).text();
    if (results.length < 10 && (header != "" && sourceLable != "" && description != "")) {
      if(sourceLable.charAt(sourceLable.length - 1) == "/"){
        sourceLable = sourceLable.slice(1,-1);
      }
      results.push({name: header, source: sourceLable, description: description});
    }
  });
  return results;
}

module.exports = router;
