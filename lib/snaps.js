"use strict";
Object.defineProperties(exports, {
  Snaps: {get: function() {
      return Snaps;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime');
var crypto = require('crypto'),
    bqLogin = $traceurRuntime.assertObject(require('./endpoints/bq_login')).bqLogin,
    fs = require('fs'),
    map = $traceurRuntime.assertObject(require('underscore')).map,
    request = require('request'),
    spawn = $traceurRuntime.assertObject(require('child_process')).spawn,
    phSend = $traceurRuntime.assertObject(require('./endpoints/ph_send')).phSend,
    phUploadImage = $traceurRuntime.assertObject(require('./endpoints/ph_upload')).phUploadImage,
    phBlob = $traceurRuntime.assertObject(require('./endpoints/ph_blob')).phBlob,
    presentSnaps = $traceurRuntime.assertObject(require('./present_snaps')).presentSnaps,
    presentFriends = $traceurRuntime.assertObject(require('./present_friends')).presentFriends;
var Snaps = function Snaps(username, password) {
  var $__0 = this;
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
  this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
  this.ENCRYPTION_KEY = '4d3032636e5135314a69393776775434';
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
    return this._encrypt(imageStream).then((function(encryptedImage) {
      var timestamp = Date.now();
      var reqToken = $__0._getRequestToken($__0.authToken, timestamp);
      return phUploadImage(encryptedImage, $__0.username, timestamp, reqToken, $__0._request, $__0.baseUrl);
    })).then((function(mediaId) {
      var timestamp = Date.now();
      var reqToken = $__0._getRequestToken($__0.authToken, timestamp);
      return phSend(mediaId, recipients.join(','), snapTime, $__0.username, timestamp, reqToken, $__0._request, $__0.baseUrl);
    })).then((function() {
      return $__0;
    })).catch((function(err) {
      throw (err);
    }));
  },
  fetchSnap: function(id) {
    var $__0 = this;
    var timestamp = Date.now();
    var reqToken = this._getRequestToken(this.authToken, timestamp);
    var encryptedData = null;
    return phBlob(id, this.username, timestamp, reqToken, this._request, this.baseUrl).then((function(data) {
      return $__0._decrypt(data);
    }));
  },
  getSnaps: function() {
    return this.snaps;
  },
  getFriends: function() {
    return this.friends;
  },
  _encrypt: function(stream) {
    var openSslParams = ['enc', '-K', this.ENCRYPTION_KEY, '-aes-128-ecb'];
    return this._encryptOrDecrypt(stream, openSslParams);
  },
  _decrypt: function(stream) {
    var openSslParams = ['enc', '-d', '-K', this.ENCRYPTION_KEY, '-aes-128-ecb'];
    return this._encryptOrDecrypt(stream, openSslParams);
  },
  _encryptOrDecrypt: function(input, openSslParams) {
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
