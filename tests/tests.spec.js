// tests.js

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
//var request = require('request');
var request = require('request-promise');
var fs = require('fs');
var archiver = require('archiver');


describe('Init test', function(){
    describe('#OK',function(){
        it('should be loaded', function(){
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
    xit('should respond with statusCode 200', function (done) {
        console.log("request done!");
        request('https://modulus.io', function (error, response, body) {
            //Check for error
            if(error){
                return console.log('Error:', error);
            }
            //Check for right status code
            if(response.statusCode !== 200){
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the body
            console.log(body); // Show the HTML for the Modulus homepage.
            done();

        });
    });
});


describe('ZIP file /', function(){
    it('should create a target.zip file', function(){

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




