"use strict";
Object.defineProperties(exports, {
  phSend: {get: function() {
      return phSend;
    }},
  __esModule: {value: true}
});
var $__0 = require('./common_params_and_headers'),
    commonParams = $__0.commonParams,
    commonHeaders = $__0.commonHeaders,
    extend = require('underscore').extend;
function phSend(mediaId, recipients, snapTime, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = extend({
    "media_id": mediaId,
    "recipient": recipients,
    "req_token": reqToken,
    "time": snapTime,
    "timestamp": timestamp,
    "username": username,
    "zipped": 0
  }, commonParams);
  return new Promise((function(resolve, reject) {
    request({
      "uri": baseUrl + '/ph/send',
      "headers": commonHeaders,
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }, (function(err, httpResponse, body) {
      if (err || httpResponse.statusCode != 200) {
        reject(err || new Error("Status code of send request was " + httpResponse.statusCode));
      } else {
        resolve(body);
      }
    }));
  }));
}
