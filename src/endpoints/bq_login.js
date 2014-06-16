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
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  })
}
