"use strict";
Object.defineProperties(exports, {
  bqLogin: {get: function() {
      return bqLogin;
    }},
  __esModule: {value: true}
});
var $__0 = require('./common_params_and_headers'),
    commonParams = $__0.commonParams,
    commonHeaders = $__0.commonHeaders,
    extend = require('underscore').extend;
function bqLogin(username, password, timestamp, reqToken, request, baseUrl) {
  var loginParams = extend({
    "username": username,
    "timestamp": timestamp,
    "req_token": reqToken,
    "password": password
  }, commonParams);
  return new Promise((function(resolve, reject) {
    var error;
    request({
      "uri": baseUrl + '/bq/login',
      "headers": commonHeaders,
      "qs": loginParams,
      "method": "POST",
      "timeout": 2000
    }, (function(err, httpResponse, body) {
      try {
        var parsedBody = JSON.parse(body);
      } catch (err) {
        error = err;
      }
      if (err || httpResponse.statusCode != 200 || parsedBody.status === -100) {
        if (err) {
          error = err;
        } else if (httpResponse.statusCode === 200) {
          error = new Error("Incorrect username and password combo.");
        } else {
          error = new Error("Status code of login request was " + httpResponse.statusCode);
        }
        reject(error);
      } else {
        resolve(parsedBody);
      }
    }));
  }));
}
