require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var {login} = require('./endpoints/bq_login');
var {map} = require('underscore');
var request = require('request');
var {send} = require('./endpoints/ph_send');
var {uploadImage} = require('./endpoints/ph_upload');

export class Snaps {
  constructor(username, password) {
    this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
    this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
    this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
    this.baseUrl = 'https://feelinsonice-hrd.appspot.com';

    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var loginPromise = login(username, password, timestamp, reqToken, this._request, this.baseUrl);
    return loginPromise.then((loginResponse) => {
      this.authToken = loginResponse.auth_token;
      return this;
    })
  }

  send(rawImageData, recipients, snapTime) {
    var imageData = this._encryptImage(rawImageData);
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var uploadPromise = uploadImage(imageData, username, timestamp, reqToken, this._request, this.baseUrl);
    uploadPromise.then((mediaId) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
      return send(recipients.join(','), time, mediaId, username, timestamp, reqToken);
    }).then(() => {
      return this;
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
