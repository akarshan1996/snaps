var {commonParams, commonHeaders} = require('./common_params_and_headers'),
    {extend} = require('underscore');

export function bqLogin(username, password, timestamp, reqToken, request, baseUrl) {
  var loginParams = extend({
    "username": username,
    "timestamp": timestamp,
    "req_token": reqToken,
    "password": password,
  }, commonParams);

  return new Promise((resolve, reject) => {
    var error;
    request({
      "uri": baseUrl + '/bq/login',
      "headers": commonHeaders,
      "qs": loginParams,
      "method": "POST",
      "timeout": 2000,
    }, (err, httpResponse, body) => {
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
    })
  })
}
