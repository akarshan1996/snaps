"use strict";
Object.defineProperties(exports, {
  Snaps: {get: function() {
      return Snaps;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var bqLogin = $traceurRuntime.assertObject(require('./endpoints/bq_login')).bqLogin;
var map = $traceurRuntime.assertObject(require('underscore')).map;
var request = require('request');
var phSend = $traceurRuntime.assertObject(require('./endpoints/ph_send')).phSend;
var phUploadImage = $traceurRuntime.assertObject(require('./endpoints/ph_upload')).phUploadImage;
var Snaps = function Snaps(username, password) {
  var $__0 = this;
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
  this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
  this.ENCRYPTION_KEY = 'M02cnQ51Ji97vwT4';
  var timestamp = Date.now();
  var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
  var loginPromise = bqLogin(username, password, timestamp, reqToken, this._request, this.baseUrl);
  return loginPromise.then((function(loginResponse) {
    $__0.authToken = loginResponse.auth_token;
    return $__0;
  }));
};
($traceurRuntime.createClass)(Snaps, {
  send: function(rawImageData, recipients, snapTime, username) {
    var $__0 = this;
    var imageData = this._encryptImage(rawImageData);
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
    var uploadPromise = phUploadImage(imageData, username, timestamp, reqToken, this._request, this.baseUrl);
    return uploadPromise.then((function(mediaId) {
      var timestamp = Date.now();
      var reqToken = $__0._getRequestToken($__0.STATIC_TOKEN, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, username, timestamp, reqToken, $__0._request, $__0.baseUrl);
    })).then((function() {
      return $__0;
    })).catch((function(err) {
      console.log(err);
    }));
  },
  _encryptImage: function(rawImageData) {
    var cipher = crypto.createCipher('aes-128-ecb', this.ENCRYPTION_KEY);
    cipher.update(rawImageData);
    return cipher.final();
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
  _hasAuthToken: function() {
    return this.authToken != null;
  },
  _request: function(options, cb) {
    return request(options, cb);
  }
}, {});
