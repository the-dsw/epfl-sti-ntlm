var
    request = require('request'),
    JSZip = require("jszip"),
    Q = require("q"),
    iconv = require('iconv-lite'),
    _ = require("underscore"),
    cheerio = require('cheerio');

/**
 * Scrape Zip data from Modulotech
 * @param yearmonth
 * @param username
 * @param password
 * @param requestForFake Override the request module; for use in unit tests
 * @returns {Promise} Empty promise
 * @todo return promise for data structure instead
 */
module.exports = function scrapeAsync(yearmonth, username, password, requestForFake) {
    var request = requestForFake ? requestForFake : require("request");
        var zipUrl = "https://cmisrvm1.epfl.ch/cmi/v1.5/copernic_2/";
        var argsForEveryPost = {
            url: zipUrl,
            headers: {
                Authorization: "Basic " + new Buffer(username + ":" + password).toString("base64"),
                'User-Agent': 'Super Agent/0.0.1',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // 'Content-Length': Buffer.byteLength(post_data)
            },
            encoding: null,
        };
        return Q.nfcall(request.post, argsForEveryPost).then(function (results) {
            var response = results[0];  // request.post callback takes more than one argument in the success case
            var $ = cheerio.load(response.body);
            var labo;
            // TODO: parse page from response.body
            $('#Labo option').filter(function(){
                var data = $(this);
                      labo = data.value();
            });

            console.log("********* Init response : ***********" + response);
            console.log("Init cheerio : " + labo);
            console.log("+++++++ response body ++++++++ " + response.body);

            return ["CMi","ENAC-IIC-LESO-PB","ENAC-IIE-LGB","EXT-Aleva","EXT-Asulab",
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
            ];
        }).then(function (labNames) {
            return Q.nfcall(request.post, _.extend({}, argsForEveryPost, {
                form: {
                    yearmonth: yearmonth,
                    "Labo[]": labNames,
                    displaylabbut : 1,
                    loadcsvbut : 1
                }
            }));
        }).then(function(results) {
            console.log("request done");
            var response = results[0];
            if (response.headers["content-type"] != "application/zip") {
                throw new Error("Bad content-type: " + response.headers["content-type"]);
            }
            return response.body;
        }).then(function(zipData) {
            return new JSZip.loadAsync(zipData);
        }).then(function(zip) {
            var promises = [];
            zip.forEach(function(path, file) {
                promises.push(file.async("binarystring").then(function(csvContentsBinary) {
                    var csvContents = iconv.decode(csvContentsBinary, "iso-8859-1");
                    return "file " + path + " is " + csvContents.length + " bytes, " +
                        csvContents.split(/\r\n|\r|\n/).length +
                        " lines long\n";
                    // TODO: rather, return parsed contents as a promise
                }));
            });
            return Q.all(promises);
        }).then(function (descriptions) {
            console.log(descriptions.join(""));
            // TODO: return the info as final value of the promise chain
        });

};