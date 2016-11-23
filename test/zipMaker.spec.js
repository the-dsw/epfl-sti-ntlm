const baseFolder = 'test/copernic20161108110016/';
var
    chai = require('chai'),
    expect = chai.expect,
    makeTempZipP = require("./lib/zipMaker.js"),
    iconv = require('iconv-lite'),
    Q = require("q"),
    JSZip = require('jszip'),
    _ = require("lodash"),
    csvGold = require("./lib/csvGold.js");

require("should");
// chai.use(require('chai-things'));

function allFilesInZipAsync(jsZipInstanceOrZipBytes) {
    if (jsZipInstanceOrZipBytes instanceof JSZip) {
        zipPromise = Q(jsZipInstanceOrZipBytes);
    } else {
        zipPromise = JSZip.loadAsync(jsZipInstanceOrZipBytes);
    }

    return zipPromise.then(function(zip) {
        var files = [];
        zip.forEach(function(path, file) {
            files.push(file);
        });
        return files;
    });
}

describe("zipMaker",function () {
    it("has a top level directory",function () {
        return makeTempZipP(baseFolder).then(allFilesInZipAsync)
            .then(function(files){
                files.should.matchAny(function(file) {
                    file.should.have.property("dir", true);
                });
        });
    });
    it("has a cae.csv", function () {
        return makeTempZipP(baseFolder).then(allFilesInZipAsync)
            .then(function(files){
                files.should.matchAny(function(file) {
                    file.name.should.match(/cae.csv$/);
                });
            });
    });
    it("has a cae.csv with gold content", function () {
        return csvGold.allCellsAsync("cae.csv").then(function (cells) {
            return makeTempZipP(baseFolder, {cae: cells})
        })
            .then(allFilesInZipAsync)
            .then(function(files) {
                return _.find(files, function (file) {
                    return file.name.endsWith("cae.csv")
                }).async("binarystring");
            }).then(function(csvContentsBinary) {
               var csvContents = iconv.decode(csvContentsBinary, "iso-8859-1");
               var lines = csvContents.split(/\r\n|\r|\n/);
               lines.length.should.be.eql(1036);
               lines[3].should.be.eql("2016;11;3052;\"1000 - S. Gamper\";218717;EXT-INTEL;user01462;Gamper;\"Stephan (INTEL)\";mach136;\"Z04 Leybold-Optics LAB600 H - Evaporator Lift-off\";\"2016-11-01 07:30:19\";89;0;0;0;user01462;\"Stephan (INTEL) Gamper\";;");
            })
    });
});
