/**
 * Created by the-dsw on 08.12.16.
 */

var iconv = require("iconv-lite"),
    Q = require("q"),
    fs = require("fs"),
    debug = require("debug")("fsPlus");

var openAsync = Q.nfbind(fs.open);
var readAsync = Q.nfbind(fs.read);

fs.readFileAsync = function(path) {
    return openAsync(path, "r").then(function(fd) {
        const ATTEMPT_READ_SIZE = 1000;
        var allBytesRead = Buffer.alloc(0),
            bytesReadThisTime = Buffer.alloc(ATTEMPT_READ_SIZE);
        var readSize;

        return Q.while(function () {
            // el proceso se termina cuando la valor del largo del string es 0
            return readSize !== 0;
        }, function () {
            // * hacemos la llamada de la funcion una vez,
            // * actualiza `buffer` al final,
            // * actualiza `readSize`.
            return readAsync(fd, bytesReadThisTime, 0, ATTEMPT_READ_SIZE, null).then(function(listOfbytesReadBuffer) {
                readSize = listOfbytesReadBuffer[0];
                allBytesRead = Buffer.concat([allBytesRead, bytesReadThisTime], allBytesRead.length + readSize);
                debug(readSize + " bytes read, " + allBytesRead.length + " total")
            });
        }).then(function() {
            return allBytesRead
        });

    })
};

fs.readAndDecodeFileAsync = function(path, opt_encoding) {
    if (! opt_encoding) {
        opt_encoding = "iso-8859-1";
    }
    return fs.readFileAsync(path).then(function(bytes) {
        return iconv.decode(bytes, opt_encoding);
    })
}
