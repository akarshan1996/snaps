require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var {bqLogin} = require('./endpoints/bq_login');
var {map} = require('underscore');
var request = require('request');
var {phSend} = require('./endpoints/ph_send');
var {phUploadImage} = require('./endpoints/ph_upload');

export class Snaps {
  constructor(username, password) {
    this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
    this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
    this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
    this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
    this.ENCRYPTION_KEY = 'M02cnQ51Ji97vwT4'

    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var loginPromise = bqLogin(username, password, timestamp, reqToken, this._request, this.baseUrl);
    return loginPromise.then((loginResponse) => {
      this.authToken = loginResponse.auth_token;
      return this;
    })
  }

  send(rawImageData, recipients, snapTime, username) {
    var imageData = this._encryptImage(rawImageData);
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var uploadPromise = phUploadImage(imageData, username, timestamp, reqToken, this._request, this.baseUrl);
    return uploadPromise.then((mediaId) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, username, timestamp, reqToken, this._request, this.baseUrl);
    }).then(() => {
      return this;
    })
  }

  _encryptImage(rawImageData) {
    var cipher = crypto.createCipher('aes-128-ecb', this.ENCRYPTION_KEY)
    cipher.update(rawImageData);
    return cipher.final();
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
