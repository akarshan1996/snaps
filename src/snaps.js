require('traceur/bin/traceur-runtime');
var crypto = require('crypto'),
    {bqLogin} = require('./endpoints/bq_login'),
    fs = require('fs'),
    {map} = require('underscore'),
    request = require('request'),
    {spawn} = require('child_process'),
    {phSend} = require('./endpoints/ph_send'),
    {phUploadImage} = require('./endpoints/ph_upload'),
    {presentSnaps} = require('./present_snaps');

export class Snaps {
  constructor(username, password) {
    this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
    this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
    this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
    this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
    this.ENCRYPTION_KEY = '4d3032636e5135314a69393776775434';

    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var loginPromise = bqLogin(username, password, timestamp, reqToken, this._request, this.baseUrl);
    return loginPromise.then((loginResponse) => {
      this.authToken = loginResponse.auth_token;
      this.username = username;
      this.snaps = presentSnaps(loginResponse);
      return this;
    })
  }

  send(imageStream, recipients, snapTime) {
    return this._encryptImage(imageStream).then((encryptedImage) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.authToken, timestamp);
      return phUploadImage(encryptedImage, this.username, timestamp, reqToken, this._request, this.baseUrl);
    }).then((mediaId) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.authToken, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, this.username, timestamp, reqToken, this._request, this.baseUrl);
    }).then(() => {
      return this;
    }).catch((err) => {
      throw(err);
    })
  }

  getSnaps() {
    return this.snaps;
  }

  _encryptImage(imageStream) {
    return new Promise((resolve, reject) => {
      var encrypt = spawn('openssl', ['enc', '-K', this.ENCRYPTION_KEY, '-aes-128-ecb']);
      var output = new Buffer(0);
      encrypt.stdout.on('data', (data) => {
        output = Buffer.concat([output, data]);
      })
      encrypt.stdout.on('end', () => {
        fs.writeFileSync('./tmp/image_output', output);
        resolve(fs.createReadStream('./tmp/image_output'));
      })
      imageStream.pipe(encrypt.stdin);
    })
  }

  _getRequestToken(authToken, timestamp) {
    var first = crypto.createHash('sha256')
                      .update(this.SECRET + authToken)
                      .digest('hex');
    var second = crypto.createHash('sha256')
                       .update(timestamp + this.SECRET)
                       .digest('hex');
    return map(this.PATTERN, (c, i) => {
      if (c == '0') {
        return first[i];
      } else {
        return second[i];
      }
    }).join('');
  }

  _hasAuthToken() {
    return this.authToken != null;
  }

  _request(options, cb) {
    return request(options, cb);
  }
}
