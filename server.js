// set up ======================================================================
var http = require("http");
var request = require('request');
var JSZip = require("jszip");
var fs = require('fs');
var favicon = require('serve-favicon');
var express = require('express');
var port = process.env.PORT || 8000; // set the port
var logger = require('morgan'); // log every request to the console
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var qs = require("qs");
var FileSaver = require('file-saver');

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
    var yearmonth = document.getElementById("yearmonth").value;

    console.log("request started");
    var post_data = qs.stringify({
      yearmonth: yearmonth,
      displaylabbut:1,
      labo: ["CMi","ENAC-IIC-LESO-PB","ENAC-IIE-LGB","EXT-Aleva","EXT-Asulab",
            "EXT-Axetris","EXT-Bruker","EXT-CERN","EXT-CSEM_T1","EXT-CSEM_T3","EXT-Efficonseil","EXT-EMPA",
            "EXT-HESGE","EXT-INTEL","EXT-LESS_SA","EXT-LSPR","EXT-Mackinac","EXT-MCH-processing","EXT-Meister-Abrasive",
            "EXT-Microcrystal","EXT-Morphotonix","EXT-Novagan","EXT-Piemacs","EXT-Rolex","EXT-Samtec","EXT-Sigatec","EXT-SilMach",
            "EXT-SwissTo12","EXT-UFMG-ICEx","EXT-UNIBE-Phys.","EXT-UNIGE-GAP","EXT-UNIL","IC-IINFCOM-LSI1","SB-CMNT-GE",
            "SB-IPHYS-GCMP","SB-IPHYS-LASPE","SB-IPHYS-LOEQ","SB-IPHYS-LPMC","SB-IPHYS-LPN","SB-IPHYS-LPQM1","SB-IPHYS-LUMES",
            "SB-ISIC-LEPA","SB-ISIC-LND","SB-ISIC-LPI","SB-ISIC-LSPM","STI-IBI-BIOS","STI-IBI-CLSE","STI-IBI-LBEN",
            "STI-IBI-LBNC","STI-IBI-LBNI","STI-IBI-LHTC","STI-IBI-LNE","STI-IEL-GR-KA","STI-IEL-LANES","STI-IEL-LSM","STI-IEL-NANOLAB",
            "STI-IEL-POWERLAB","STI-IGM-LRESE","STI-IGM-MICROBS","STI-IMT-ESPLAB","STI-IMT-GR-LVT","STI-IMT-GR-QUA",
            "STI-IMT-LAI","STI-IMT-LAPD","STI-IMT-LMIS1","STI-IMT-LMIS2","STI-IMT-LMIS4","STI-IMT-LMTS",
            "STI-IMT-LO","STI-IMT-LOB","STI-IMT-LPMAT","STI-IMT-LSBI","STI-IMT-NAM","STI-IMT-OPT","STI-IMX-FIMAP",
            "STI-IMX-LC","STI-IMX-LMGN","STI-IMX-LMM","STI-IMX-LMOM","STI-IMX-LMSC","STI-IMX-LP","STI-IMX-SMAL",
            "STI-SCI-CD","STI-SCI-PM","SV-GHI-UPKIN","SV-IBI-LLCB","SV-IBI-UPDEPLA","SV-IBI-UPLUT","SV-IBI-UPNAE","SV-ISREC-CDTSO"
          ],
      loadcsvbut: 1
    });
    request.post({
      url: zipUrl,
      headers: {
        Authorization: "Basic " + new Buffer(username + ":" + password).toString("base64"),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data)
        //'Content-Encoding': 'gzip, deflate, sdch'

      }
    }, post_data, function (err, result){
          console.log("request done");
          if(err) return next(err);

          var zip = new JSZip();
          var copernic = zip.folder("copernic_2");

          copernic.file(post_data);

          zip.generateAsync({type:"blob"}).then(function(content) {

            console.log('content :' + content);
              // see FileSaver.js
              FileSaver.saveAs(content, copernic);
          });

          /*
          Results in a zip containing
          copernic_2/
              datas
          */
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
