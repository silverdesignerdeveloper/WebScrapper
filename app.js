var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.post('/', function (req, res) {
    corpus = {};
    // Let's scrape Google
    googleSearch = req.body.search;
    url = "https://www.google.com/search?q=" + googleSearch;

    request(url, function (error, response, body) {
        if (error) {
            console.log("Couldn’t get page because of error:" + error);
            return;
        }

        // load the body of the page into Cheerio so we can traverse the DOM
        var $ = cheerio.load(body),
            links = $(".r a");

        links.each(function (i, link) {
            // get the href attribute of each link
            var headerLink = $(link).text();
            var h = $(link).attr("href");
            // strip out unnecessary junk
            h = h.replace("/url?q=", "").split("&")[0];
            if (url.charAt(0) === "/") {
                return;
            } else {
                response += '<h3>' + headerLink + '</h3>'
                response += '<h3>' + h + '</h3>'
            }
            /* words.push({
             headerLink: headerLink
             });*/
        });
        res.send(response)
    });
});


/*app.post('/', function (req, res) {
 // Let's scrape Anchorman 2
 //tt1229340/
 googleSearch = req.body.search;
 url = 'http://www.imdb.com/title/' + googleSearch + '/';

 request(url, function (error, response, html) {
 if (!error) {
 var $ = cheerio.load(html);

 var title, release, rating;
 var json = {title: "", release: "", rating: ""};

 $('.title_wrapper').filter(function () {
 var data = $(this);
 title = data.children().first().text().trim();
 release = data.children().last().children().last().text().trim();

 json.title = title;
 json.release = release;
 })

 $('.ratingValue').filter(function () {
 var data = $(this);
 rating = data.text().trim();

 json.rating = rating;
 })

 response += '<p>' + json.title + '</p> <br>' + '<p>' + json.release + '</p> <br>' + '<p>' + json.rating + '</p> <br>'
 res.send(response);
 }

 /!*   fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
 console.log('File successfully written! - Check your project directory for the output.json file');
 })
 *!/
 // res.send('Check your console!')
 })
 })*/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
