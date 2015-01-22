var {commonParams, commonHeaders} = require('./common_params_and_headers'),
    {extend} = require('underscore'),
    fs = require('fs');

export function phBlob(id, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = extend({
    "id": id,
    "timestamp": timestamp,
    "req_token": reqToken,
    "username": username
  }, commonParams);

  return new Promise((resolve, reject) => {
    request({
      "uri": baseUrl + '/ph/blob',
      "headers": commonHeaders,
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }).on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      if (response.statusCode === 200) {
        this.pause();
        this._paused = true;
        resolve(this);
      } else {
        reject(new Error("Status code of fetch request was " + response.statusCode));
      }
    });
  });
}
