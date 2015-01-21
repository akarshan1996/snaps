require('traceur/bin/traceur-runtime');
var crypto = require('crypto'),
    {bqLogin} = require('./endpoints/bq_login'),
    {encrypt, decrypt} = require('./encryption'),
    {map} = require('underscore'),
    request = require('request'),
    {spawn} = require('child_process'),
    {phSend} = require('./endpoints/ph_send'),
    {phUploadImage} = require('./endpoints/ph_upload'),
    {phBlob} = require('./endpoints/ph_blob'),
    {presentSnaps} = require('./present_snaps'),
    {presentFriends} = require('./present_friends');

export class Snaps {
  constructor(username, password) {
    this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
    this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
    this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
    this.baseUrl = 'https://feelinsonice-hrd.appspot.com';

    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var loginPromise = bqLogin(username, password, timestamp, reqToken, this._request, this.baseUrl);
    return loginPromise.then((loginResponse) => {
      this.authToken = loginResponse.auth_token;
      this.username = username;
      this.snaps = presentSnaps(loginResponse, username);
      this.friends = presentFriends(loginResponse);
      return this;
    });
  }

  send(imageStream, recipients, snapTime) {
    return encrypt(imageStream).then((encryptedImage) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.authToken, timestamp);
      return phUploadImage(encryptedImage, this.username, timestamp, reqToken, this._request, this.baseUrl);
    }).then((mediaId) => {
      var timestamp = Date.now();
      var reqToken = this._getRequestToken(this.authToken, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, this.username, timestamp, reqToken, this._request, this.baseUrl);
    }).then(() => {
      return this;
    });
  }

  fetchSnap(id) {
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.authToken, timestamp);
    return phBlob(id, this.username, timestamp, reqToken, this._request, this.baseUrl).then((data) => {
      return decrypt(data);
    });
  }

  getSnaps() {
    return this.snaps;
  }

  getFriends() {
    return this.friends;
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

  _request(options, cb) {
    return request(options, cb);
  }
}
