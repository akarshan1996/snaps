"use strict";
Object.defineProperties(exports, {
  Snaps: {get: function() {
      return Snaps;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var map = $traceurRuntime.assertObject(require('underscore')).map;
var request = require('request');
var Snaps = function Snaps(username, password) {
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
  this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
  return this._login(username, password);
};
($traceurRuntime.createClass)(Snaps, {
  _login: function(username, password) {
    var $__0 = this;
    var timestamp = Date.now();
    var loginParams = {
      "username": username,
      "timestamp": timestamp,
      "req_token": this._getRequestToken(this.STATIC_TOKEN, timestamp),
      "password": password
    };
    return new Promise((function(resolve, reject) {
      $__0._request({
        "uri": $__0.baseUrl + '/bq/login',
        "qs": loginParams,
        "method": "POST",
        "timeout": 10000
      }, (function(err, httpResponse, body) {
        if (err) {
          reject(Error('Error logging in.'));
        } else {
          $__0.authToken = body.auth_token;
          resolve($__0);
        }
      }));
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
    request(options, cb);
  }
}, {});
;
