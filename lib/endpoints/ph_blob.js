"use strict";
Object.defineProperties(exports, {
  phBlob: {get: function() {
      return phBlob;
    }},
  __esModule: {value: true}
});
var $__0 = require('./common_params_and_headers'),
    commonParams = $__0.commonParams,
    commonHeaders = $__0.commonHeaders,
    extend = require('underscore').extend,
    fs = require('fs');
function phBlob(id, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = extend({
    "id": id,
    "timestamp": timestamp,
    "req_token": reqToken,
    "username": username
  }, commonParams);
  return new Promise((function(resolve, reject) {
    request({
      "uri": baseUrl + '/ph/blob',
      "headers": commonHeaders,
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }).on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      if (response.statusCode === 200) {
        this.pause();
        this._paused = true;
        resolve(this);
      } else {
        reject(new Error("Status code of fetch request was " + response.statusCode));
      }
    });
  }));
}
