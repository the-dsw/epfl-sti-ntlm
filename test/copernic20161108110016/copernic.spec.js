var fs = require("fs");

require("should");
require("../../lib/fs+.js");

    describe("copernic20161108110016 gold data", function () {
    it("has a valid cae.csv", function () {

        return fs.readAndDecodeFileAsync("copernic20161108110016/cae.csv").then(function (csvContents) {
            var lines = csvContents.split(/\r\n|\r|\n/);
            lines[3].should.be.eql("2016;11;3052;\"1000 - S. Gamper\";218717;EXT-INTEL;user01462;Gamper;\"Stephan (INTEL)\";mach136;\"Z04 Leybold-Optics LAB600 H - Evaporator Lift-off\";\"2016-11-01 07:30:19\";89;0;0;0;user01462;\"Stephan (INTEL) Gamper\";;");
        });
    });
});
