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
    zip = new JSZip();


describe('Init test', function(){
    describe('#OK',function(){
        xit('should be loaded', function(){
            assert.equal(true,true);
        });
    });
});

// Test Scrapping web site and use cheerio package
describe('GET /', function(){
    xit('should respond with statusCode 200 & file written in output.json', function (done) {
        console.log("request output done!");
        var url = 'http://www.imdb.com/title/tt5091538/';
        request(url, function (error, response, html) {
            //Check for error
            if(!error){
                var $ = cheerio.load(html);
                var title, storyline;
                var json = { title : "",storyline : ""};

                //Check for title
                $('h1').filter(function(){
                    var data = $(this);
                    title = data.text();
                    json.title = title;
                });
                //Check for storyline
                $('.canwrap p').filter(function(){
                    var data = $(this);
                    storyline = data.text();
                    json.storyline = storyline;

                });

            }
            //Check for right status code
            if(response.statusCode !== 200){
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the html in a Json file
            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
                console.log('File output.json successfully written!');
            });

            done();

        });
    });
});

// Test Zip file read
describe('ZIP file /', function(){
    it('should read a zip file', function(){
        var zip = new JSZip();

        // read a zip file
        fs.readFile("copernic20161108110016.zip", function(err, data) {
            if (err) throw err;
            JSZip.loadAsync(data).then(function (zip) {
                console.log("zip reading...");
            });
        });

    });
});

// Test MongoDB save, list and clear
var
    dbURI    = 'mongodb://localhost:27017/epfl-testApp',
    expect   = require('chai').expect,
    mongoose = require('mongoose'),
    Dummy    = mongoose.model('Dummy',
        new mongoose.Schema({
            a:Number
        })
    ),
    clearDB  = require('mocha-mongoose')(dbURI, {noClear: true});

describe("Example spec for a model", function() {
    before(function(done) {
        if (mongoose.connection.db) return done();

        mongoose.connect(dbURI, done);
    });

    before(function(done) {
        clearDB(done);
    });

    it("can be saved", function(done) {
        Dummy.create({a: 1}, done);
    });

    it("can save another", function(done) {
        Dummy.create({a: 2}, done);
    });

    it("can be listed", function(done) {
        Dummy.find({}, function(err, models){
            expect(err).to.not.exist;
            expect(models).to.have.length(2);

            done();
        });
    });

    xit("can clear the DB on demand", function(done) {
        Dummy.count(function(err, count){
            expect(err).to.not.exist;
            expect(count).to.equal(2);

            clearDB(function(err){
                expect(err).to.not.exist;

                Dummy.find({}, function(err, docs){
                    expect(err).to.not.exist;

                    expect(docs.length).to.equal(0);
                    done();
                });
            });
        });
    });
});