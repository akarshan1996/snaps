"use strict";
Object.defineProperties(exports, {
  encrypt: {get: function() {
      return encrypt;
    }},
  decrypt: {get: function() {
      return decrypt;
    }},
  __esModule: {value: true}
});
var fs = require('fs'),
    spawn = $traceurRuntime.assertObject(require('child_process')).spawn;
var ENCRYPTION_KEY = '4d3032636e5135314a69393776775434';
function encrypt(stream) {
  var openSslParams = ['enc', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
  return encryptOrDecrypt(stream, openSslParams);
}
function decrypt(stream) {
  var openSslParams = ['enc', '-d', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
  return encryptOrDecrypt(stream, openSslParams);
}
var encryptOrDecrypt = function(input, openSslParams) {
  return new Promise((function(resolve, reject) {
    var openssl = spawn('openssl', openSslParams);
    var output = new Buffer(0);
    openssl.stdout.on('data', (function(data) {
      output = Buffer.concat([output, data]);
    }));
    openssl.stdout.on('end', (function() {
      fs.writeFileSync('./tmp/image_output', output);
      resolve(fs.createReadStream('./tmp/image_output'));
    }));
    input.pipe(openssl.stdin);
  }));
};