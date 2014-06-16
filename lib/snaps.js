"use strict";
Object.defineProperties(exports, {
  Snaps: {get: function() {
      return Snaps;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var login = $traceurRuntime.assertObject(require('./endpoints/bq_login')).login;
var map = $traceurRuntime.assertObject(require('underscore')).map;
var request = require('request');
var Snaps = function Snaps(username, password) {
  var $__0 = this;
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
  this.baseUrl = 'https://feelinsonice-hrd.appspot.com';
  var timestamp = Date.now();
  var reqToken = this._getRequestToken(this.STATIC_TOKEN, timestamp);
  var loginPromise = login(username, password, timestamp, reqToken, this._request, this.baseUrl);
  return loginPromise.then((function(loginResponse) {
    $__0.authToken = loginResponse.auth_token;
    return $__0;
  }));
};
($traceurRuntime.createClass)(Snaps, {
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
