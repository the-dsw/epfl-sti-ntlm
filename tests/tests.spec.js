// tests.js

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
//var request = require('request');
var request = require('request-promise');
var fs = require('fs');
var archiver = require('archiver');
var cheerio = require('cheerio');


describe('Init test', function(){
    describe('#OK',function(){
        xit('should be loaded', function(){
            assert.equal(true,true);
        });
    });
});

describe('Asynchronous Code', function(){
    describe('#Working with Promises', function(){
        xit('should complete this test', function () {
            return new Promise(function (resolve) {
                assert.ok(true);
                resolve();
            })
                .then();
        });

    });
});

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


describe('ZIP file /', function(){
    xit('should create a target.zip file', function(){

        var output = fs.createWriteStream('target.zip');
        var archive = archiver('zip');

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.on('error', function(err){
            throw err;
        });

        archive.pipe(output);

        // append a file from string
        archive.append('string cheese!', { name: 'file2.txt' });

        archive.finalize();
    });
});




