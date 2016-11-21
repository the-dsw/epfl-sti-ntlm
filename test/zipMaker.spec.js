const baseFolder = '../test/';
var
    chai = require('chai'),
    expect = chai.expect,
    makeTempZipP = require("./lib/zipMaker.js");

describe("zipMaker",function () {
    it("has a top level directory",function () {
        return  makeTempZipP(baseFolder).then(function (temp) {
            expect(1).to.be.equal(1);
        })
    });
    it("has a cae.csv");
    it("has a cae.csv with the desired content");
});