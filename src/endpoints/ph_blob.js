var fs = require('fs');

export function phBlob(id, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = {
    "id": id,
    "timestamp": timestamp,
    "req_token": reqToken,
    "username": username
  }

  return new Promise((resolve, reject) => {
    var requestStream = request({
      "uri": baseUrl + '/ph/blob',
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    });
    requestStream.on('error', function(err) {
      reject(err);
    });
    requestStream.on('readable', function() {
      resolve(requestStream);
    });
  })
}
