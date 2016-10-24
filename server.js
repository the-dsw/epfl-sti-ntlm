// set up ======================================================================
var http = require('http');
var fs = require('fs');
var express = require('express');
var ntlm = require('express-ntlm');
var app = express(); // create our app with express
var port = process.env.PORT || 8000; // set the port
var morgan = require('morgan'); // log every request to the console
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Mongoose ====================================================================
require('./config/database');

// Express =====================================================================

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
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
app.use(ntlm({
    debug: function() {
        var args = Array.prototype.slice.apply(arguments);
        console.log.apply(null, args);
    },
    username:"MYUSER",
    password: "MYPASS",
    domain: 'MYDOMAIN',
    Workstation: "MYWORKSTATION",
    domaincontroller: "https://cmisrvm1.epfl.ch/cmi/v1.5/copernic_2/#",
}));

app.all('/', function(request, response) {
    response.end(JSON.stringify(request.ntlm)); // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
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
