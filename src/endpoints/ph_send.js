var {commonParams, commonHeaders} = require('./common_params_and_headers'),
    {extend} = require('underscore');

export function phSend(mediaId, recipients, snapTime, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = extend({
    "media_id": mediaId,
    "recipient": recipients,
    "req_token": reqToken,
    "time": snapTime,
    "timestamp": timestamp,
    "username": username,
    "zipped": 0
  }, commonParams);

  return new Promise((resolve, reject) => {
    request({
      "uri": baseUrl + '/ph/send',
      "headers": commonHeaders,
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }, (err, httpResponse, body) => {
      if (err || httpResponse.statusCode != 200) {
        reject(err || new Error("Status code of send request was " + httpResponse.statusCode));
      } else {
        resolve(body);
      }
    })
  })
}
