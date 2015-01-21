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
    var body = '';
    request({
      "uri": baseUrl + '/bq/login',
      "headers": commonHeaders,
      "qs": loginParams,
      "method": "POST",
      "timeout": 2000
    }).on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      if (response.statusCode !== 200) {
        reject(new Error("Status code of login request was " + response.statusCode));
      }
    }).on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      try {
        var parsedBody = JSON.parse(body);
      } catch (err) {
        reject(err);
      }
      if (parsedBody.status === -100) {
        reject(new Error("Incorrect username and password combo."));
      } else {
        resolve(parsedBody);
      }
    });
  }));
}
