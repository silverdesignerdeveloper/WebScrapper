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

app.get('/searching', function (req, res) {
    googleSearch = req.query.search;
    url = "https://www.google.com/search?q=" + googleSearch + "&num=11";

    request(url, function (error, response, body) {
        if (error) {
            console.log("Couldn’t get page because of error:" + error);
            return;
        }

        var $ = cheerio.load(body);
        var parentFieldList = $(".g ");
        var results = [];
        parentFieldList.each(function (i, parentField) {
            var header = $(parentField).find($('.r a')).text();
            var source = $(parentField).find($('cite')).text();
            var description = $(parentField).find($('.st')).text();
            if (results.length <= 10 && (header != "" && source != "" && description != "")) {
                results.push({name: header, source: source, description: description});
            } else {
                return;
            }

        });
        res.contentType('application/json');
        res.send(JSON.stringify(results));
    });
});

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
