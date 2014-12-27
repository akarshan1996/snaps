export function bqLogin(username, password, timestamp, reqToken, request, baseUrl) {
  var loginParams = {
    "username": username,
    "timestamp": timestamp,
    "req_token": reqToken,
    "password": password
  }

  return new Promise((resolve, reject) => {
    request({
      "uri": baseUrl + '/bq/login',
      "qs": loginParams,
      "method": "POST",
      "timeout": 2000
    }, (err, httpResponse, body) => {
      var parsedBody = JSON.parse(body);
      if (err || httpResponse.statusCode != 200 || parsedBody.status === -100) {
        if (err) {
          var error = err;
        } else if (httpResponse.statusCode === 200) {
          var error = new Error("Incorrect username and password combo.");
        } else {
          var error = new Error("Status code of login request was " + httpResponse.statusCode);
        }
        reject(error);
      } else {
        resolve(parsedBody);
      }
    })
  })
}
