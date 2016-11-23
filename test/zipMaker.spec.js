const baseFolder = '../test/copernic20161108110016/';
var
    chai = require('chai'),
    expect = chai.expect,
    makeTempZipP = require("./lib/zipMaker.js");

chai.should();
chai.use(require('chai-things'));

describe("zipMaker",function () {
    it("has a top level directory",function () {
        return  makeTempZipP(baseFolder).then(function (zip) {
            var files = [];
            zip.forEach(function(path, file) {
                files.push(file);
            });
            files.should.contain.a.thing.with.property("dir",true);
        })
    });
    it("has a cae.csv");
    it("has a cae.csv with the desired content");
});
