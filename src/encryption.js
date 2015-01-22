var fs = require('fs'),
    {spawn} = require('child_process');
var ENCRYPTION_KEY = '4d3032636e5135314a69393776775434';

export function encrypt(stream) {
  var openSslParams = ['enc', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
  return new Promise((resolve, reject) => {
    encryptOrDecrypt(stream, openSslParams).then((encryptStream) => {
      var output = new Buffer(0);
      encryptStream.on('data', (data) => {
        output = Buffer.concat([output, data]);
      });
      encryptStream.on('end', () => {
        resolve(output);
      });
    });
  });
}

export function decrypt(stream) {
  var openSslParams = ['enc', '-d', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
  return encryptOrDecrypt(stream, openSslParams);
}

var encryptOrDecrypt = function(input, openSslParams) {
  return new Promise((resolve, reject) => {
    var openssl = spawn('openssl', openSslParams);
    input.pipe(openssl.stdin);
    if (input._paused) {
      input.resume();
    }
    resolve(openssl.stdout);
  })
}
