// set up ======================================================================
var
    http = require("http"),
    fs = require('fs'),
    favicon = require('serve-favicon'),
    express = require('express'),
    port = process.env.PORT || 8000, // set the port
    logger = require('morgan'), // log every request to the console
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    FileSaver = require('file-saver'),
    _ = require("underscore"),
    cheerio = require('cheerio'),

    app = express(); // create our app with express

// Mongoose ====================================================================
require('./config/database');

// Express =====================================================================
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// Cross Domain ================================================================
app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Credentials', true);
    response.header('Access-Control-Allow-Origin', request.headers.origin);
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

// HTTP express.js =============================================================
app.post('/frmAuth', function (req, res, next) {

    var username = "intranet/" + req.body.username;
    var password = req.body.password;
    var yearmonth = req.body.yearmonth;

    console.log("request started");

    require("./scrape")(yearmonth, username, password)
        .then(function() {
            res.send("OK");
        })
        .catch(function(err) {
            next(err);
        });
});

// Server ======================================================================
var server = http.Server(app);

// HTTP NTLM node.js ===========================================================
//require('./config/login');

process.on('SIGINT', function() {
    console.log("\nStopping...");
    process.exit();
});

// listen (start app with node server.js) ======================================
server.listen(port);
console.log("App listening on port " + port);
