"use strict";
Object.defineProperties(exports, {
  bqLogin: {get: function() {
      return bqLogin;
    }},
  __esModule: {value: true}
});
function bqLogin(username, password, timestamp, reqToken, request, baseUrl) {
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
      if (err || httpResponse.statusCode != 200) {
        reject(err || new Error("Status code of login request was " + httpResponse.statusCode));
      } else {
        resolve(JSON.parse(body));
      }
    }));
  }));
}
