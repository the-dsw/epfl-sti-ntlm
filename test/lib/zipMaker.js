
var
    fs = require('fs'),
    path = require('path'),
    JSZip = require("jszip");

const baseFolder = path.normalize('copernic20161108110016/');

module.exports = makeTempZipP_usingJSZip;

function makeTempZipP_usingJSZip(baseFolder, json) {
    var zip = new JSZip();
    var zipOfSubdir = zip.folder(baseFolder);
    zipOfSubdir.file("cae.csv", "XXX;some;CSV;goes;here\n".repeat(json && json.cae ? json.cae.length : 1));
    return zip.generateAsync({type: "nodebuffer"});
}

