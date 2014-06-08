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
var Snaps = function Snaps() {
  this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
  this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
  this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
};
($traceurRuntime.createClass)(Snaps, {
  login: function(username, password) {
    var timestamp = Date.now();
    this.loginParams = {
      "username": username,
      "timestamp": timestamp,
      "req_token": this._getRequestToken(this.STATIC_TOKEN, timestamp),
      "password": password
    };
  },
  _getRequestToken: function(authToken, timestamp) {
    var first = crypto.createHash('sha256').update(this.SECRET + authToken).digest('hex');
    var second = crypto.createHash('sha256').update(timestamp + this.SECRET).digest('hex');
    return map(this.PATTERN, function(c, i) {
      if (c == '0') {
        return first[i];
      } else {
        return second[i];
      }
    }).join('');
  }
}, {});
