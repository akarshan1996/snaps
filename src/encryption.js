var fs = require('fs'),
    {spawn} = require('child_process');
var ENCRYPTION_KEY = '4d3032636e5135314a69393776775434';

export function encrypt(stream) {
    var openSslParams = ['enc', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
    return encryptOrDecrypt(stream, openSslParams);
  }

export function decrypt(stream) {
    var openSslParams = ['enc', '-d', '-K', ENCRYPTION_KEY, '-aes-128-ecb'];
    return encryptOrDecrypt(stream, openSslParams);
  }

var encryptOrDecrypt = function(input, openSslParams) {
  return new Promise((resolve, reject) => {
    var openssl = spawn('openssl', openSslParams);
    var output = new Buffer(0);
    openssl.stdout.on('data', (data) => {
      output = Buffer.concat([output, data]);
    })
    openssl.stdout.on('end', () => {
      fs.writeFileSync('./tmp/image_output', output);
      resolve(fs.createReadStream('./tmp/image_output'));
    })
    input.pipe(openssl.stdin);
  })
}
