const baseFolder = './test/copernic20161108110016/';
var
    fs = require('fs'),
    path = require('path'),
    archiver = require('archiver'),
    JSZip = require("jszip"),
    zip = new JSZip();


module.exports = function zipMakerP() {
    return makeTempZipP(baseFolder).then(function(resBaseFolder) {
        return resBaseFolder;
    });
};

function makeTempZipP_usingJSZip(baseFolder) {
    return baseFolder;
}

makeTempZipP = makeTempZipP_usingJSZip;

function makeTempZipP_usingArchiver(baseFolder) {
    var archive = archiver('zip');

    var fileNames = [
        'cae.csv',
        'res.csv',
        'lvr.csv',
    ];
    var folderNames = [
        'test',
    ]

    var output = fs.createWriteStream(path.join(baseFolder, "result.zip"));

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    for (i = 0; i < fileNames.length; i++) {
        var stream = fs.readFileSync(path.join(baseFolder, fileNames[i]));
        archive.append(stream, { name: fileNames[i] });
    }
    for (i = 0; i < folderNames.length; i++) {
        archive.directory(path.join(baseFolder, folderNames[i]), folderNames[i]);
    }

    archive.finalize(function (err, bytes) {
        if (err) throw err;
    });
}
