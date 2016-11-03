// tests.js

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var request = require('request');


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

/*describe('GET /', function(){
    describe('#status 200', function () {
        it('should respond with 200', function (done) {
            console.log("request loaded!");

            var link = "http://api.openweathermap.org/data/2.5/weather?q=London&APPID="+apikey+"&units=metric";
            request
                .get(link)
                //.set('Accept-Encoding', 'gzip')
                .end(function(req,res){
                    //console.log(res.text);
                    res.write(res.statusCode.toString());
                    done();
                })
        });
    });
});*/

describe('GET /', function(){
    it('should respond with 200', function (done) {
        console.log("build test");
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

//71aa24e56db38d83fe08b15ac968ebc4



