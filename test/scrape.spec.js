// tests.js
"use strict";
var
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    //request = require('request'),
    request = require('request-promise'),
    fs = require('fs'),
    archiver = require('archiver'),
    cheerio = require('cheerio'),
    Q = require("q"),
    iconv = require('iconv-lite'),
    _ = require("underscore"),
    JSZip = require("jszip"),
    zip = new JSZip(),
    readBilling = require("../lib/readBilling.js"),
    makeTempMongo = require("./lib/tempMongo.js").makeTempMongo;


// Success tests
xdescribe("readBilling", function () {
    var fakeMongo, dbURI, fakeConnection;
    before(function() {
        return makeTempMongoP().then(function(fake) {
            fakeMongo = fake;
            dbURI = fakeMongo.uri();
            fakeConnection = mongoose.createConnection(dbURI);
        });
    });

    it("succeeds if cae.csv, res.csv and lvr.csv are all present in a subdirectory of any name", function () {
        var fakeZip = makeFakeZip({
            cae: [],
            res: [],
            lvr: []
        });
        return readBilling(fakeZip, fakeConnection)
            .then(function () {
                // TODO: control database contents here
            });
    });
    it("fails if no CSVs are in the zip");
    it("does the right thing when loading into an already populated database");
    it("ignores elements of res.csv with duration 0");

});

