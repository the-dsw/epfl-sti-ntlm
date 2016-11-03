// tests.js

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
//var request = require('request');
var request = require('request-promise');


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
    it('should respond with statusCode 200', function (done) {
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





