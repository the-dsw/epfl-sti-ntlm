// set up ======================================================================
var http = require("http"),
    request = require('request');
var fs = require('fs');
var favicon = require('serve-favicon');
var express = require('express');
var port = process.env.PORT || 8000; // set the port
var logger = require('morgan'); // log every request to the console
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var qs = require("qs");

var app = express(); // create our app with express

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

// HTTP NTLM express.js ========================================================
app.post('/frmAuth', function (req, res, next) {

    var username = "intranet/" + req.body.username;
    var password = req.body.password;
    var zipUrl = "https://cmisrvm1.epfl.ch/cmi/v1.5/copernic_2/";

    console.log("request started");
    var post_data = qs.stringify({
      yearmonth: "",
      labo: ["CMi", "EXT-CERN"],
      loadcsvbut: 1
    });
    request.post({
      url: zipUrl,
      headers: {
        Authorization: "Basic " + new Buffer(username + ":" + password).toString("base64"),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data)

      }
    }, post_data, function (err, result){
          console.log("request done");
          if(err) return next(err);
          console.log(result.headers);
          console.log(result.body);
          res.end("Thx bye");
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
