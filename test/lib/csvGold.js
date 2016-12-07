var csv = require("csv"),
    iconv = require("iconv-lite"),
    fs = require("fs"),
    Q = require("q");

module.exports.streamCells = function (filename) {
    return fs.createReadStream(__dirname + "/../copernic20161108110016/" + filename)
        .pipe(iconv.decodeStream('iso-8859-1'))
        .pipe(csv.parse({delimiter: ";"}));
};

module.exports.allCellsAsync = function (filename) {
    var stream = module.exports.streamCells(filename),
        defer = Q.defer(),
        allLines = [];

    stream.on("readable", function () {
        var line = stream.read();
        if (line) {
            allLines.push(line);
        }
    });
    stream.on("end", function () {
        defer.resolve(allLines);
    });
    stream.on("error", function (e) {
        defer.reject(e);
    });
    return defer.promise;
};
