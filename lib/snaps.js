"use strict";
Object.defineProperties(exports, {
  Snaps: {get: function() {
      return Snaps;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime');
var crypto = require('crypto'),
    bqLogin = require('./endpoints/bq_login').bqLogin,
    $__3 = require('./encryption'),
    encrypt = $__3.encrypt,
    decrypt = $__3.decrypt,
    map = require('underscore').map,
    request = require('request'),
    spawn = require('child_process').spawn,
    phSend = require('./endpoints/ph_send').phSend,
    phUploadImage = require('./endpoints/ph_upload').phUploadImage,
    phBlob = require('./endpoints/ph_blob').phBlob,
    presentSnaps = require('./present_snaps').presentSnaps,
    presentFriends = require('./present_friends').presentFriends;
var Snaps = function Snaps(username, password) {
  var $__0 = this;
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
  this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
  var timestamp = Date.now();
  var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
  var loginPromise = bqLogin(username, password, timestamp, reqToken, this._request, this.baseUrl);
  return loginPromise.then((function(loginResponse) {
    $__0.authToken = loginResponse.auth_token;
    $__0.username = username;
    $__0.snaps = presentSnaps(loginResponse, username);
    $__0.friends = presentFriends(loginResponse);
    return $__0;
  }));
};
($traceurRuntime.createClass)(Snaps, {
  send: function(imageStream, recipients, snapTime) {
    var $__0 = this;
    return encrypt(imageStream).then((function(encryptedImage) {
      var timestamp = Date.now();
      var reqToken = $__0._getRequestToken($__0.authToken, timestamp);
      return phUploadImage(encryptedImage, $__0.username, timestamp, reqToken, $__0._request, $__0.baseUrl);
    })).then((function(mediaId) {
      var timestamp = Date.now();
      var reqToken = $__0._getRequestToken($__0.authToken, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, $__0.username, timestamp, reqToken, $__0._request, $__0.baseUrl);
    })).then((function() {
      return $__0;
    }));
  },
  fetchSnap: function(id) {
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.authToken, timestamp);
    return phBlob(id, this.username, timestamp, reqToken, this._request, this.baseUrl).then((function(data) {
      return decrypt(data);
    }));
  },
  getSnaps: function() {
    return this.snaps;
  },
  getFriends: function() {
    return this.friends;
  },
  _getRequestToken: function(authToken, timestamp) {
    var first = crypto.createHash('sha256').update(this.SECRET + authToken).digest('hex');
    var second = crypto.createHash('sha256').update(timestamp + this.SECRET).digest('hex');
    return map(this.PATTERN, (function(c, i) {
      if (c == '0') {
        return first[i];
      } else {
        return second[i];
      }
    })).join('');
  },
  _request: function(options, cb) {
    return request(options, cb);
  }
}, {});
