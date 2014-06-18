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
    phUploadImage = $traceurRuntime.assertObject(require('./endpoints/ph_upload')).phUploadImage;
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
    return $__0;
  }));
};
($traceurRuntime.createClass)(Snaps, {
  send: function(imageStream, recipients, snapTime) {
    var $__0 = this;
    return this._encryptImage(imageStream).then((function(encryptedImage) {
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
  _encryptImage: function(imageStream) {
    var $__0 = this;
    return new Promise((function(resolve, reject) {
      var encrypt = spawn('openssl', ['enc', '-K', $__0.ENCRYPTION_KEY, '-aes-128-ecb']);
      var output = new Buffer(0);
      encrypt.stdout.on('data', (function(data) {
        output = Buffer.concat([output, data]);
      }));
      encrypt.stdout.on('end', (function() {
        fs.writeFileSync('./tmp/image_output', output);
        resolve(fs.createReadStream('./tmp/image_output'));
      }));
      imageStream.pipe(encrypt.stdin);
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
