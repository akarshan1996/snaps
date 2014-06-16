export function phSend(mediaId, recipients, snapTime, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = {
    "media_id": mediaId,
    "recipient": recipients,
    "req_token": reqToken,
    "time": snapTime,
    "timestamp": timestamp,
    "username": username,
    "zipped": 0
  }

  return new Promise((resolve, reject) => {
    request({
      "uri": baseUrl + '/ph/send',
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }, (err, httpResponse, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}