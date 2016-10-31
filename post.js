/**
 * test post with node.js
 url : http://postcatcher.in/
 testing app post node.js
 */


var http = require("http");
var options = {
  hostname: 'www.postcatcher.in',
  port: 80,
  path: '/catchers/5817202df41d470300000001',
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  }
};
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('{"string": "Hello, World"}');
req.end();
