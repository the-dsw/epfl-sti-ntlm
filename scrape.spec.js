var assert = require('assert');
var Scrape = require('./scrape.js');
//scrapeAsync(yearmonth, username, password, requestForFake);
// zip file copernic_2/ for the test

describe('Scrape Zip data from Modulotech', function(){

    it('Should be loaded', function(){
        assert.equal(true, true);
    })

    xit('Fake csv document', function(){
        var
            yearmonth = "",
            username = "",
            password = "",
            requestForFake = "";

        assert.deepEqual(scrapeAsync(yearmonth, username, password, requestForFake),"XXX");
    })

})
