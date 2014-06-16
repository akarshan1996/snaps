"use strict";
Object.defineProperties(exports, {
  login: {get: function() {
      return login;
    }},
  __esModule: {value: true}
});
function login(username, password, timestamp, reqToken, request, baseUrl) {
  var loginParams = {
    "username": username,
    "timestamp": timestamp,
    "req_token": reqToken,
    "password": password
  };
  return new Promise((function(resolve, reject) {
    request({
      "uri": baseUrl + '/bq/login',
      "qs": loginParams,
      "method": "POST",
      "timeout": 2000
    }, (function(err, httpResponse, body) {
      if (err) {
        reject(Error('Error logging in.'));
      } else {
        resolve(body);
      }
    }));
  }));
}
