"use strict";
Object.defineProperties(exports, {
  phBlob: {get: function() {
      return phBlob;
    }},
  __esModule: {value: true}
});
var fs = require('fs');
function phBlob(id, username, timestamp, reqToken, request, baseUrl) {
  var sendParams = {
    "id": id,
    "timestamp": timestamp,
    "req_token": reqToken,
    "username": username
  };
  return new Promise((function(resolve, reject) {
    resolve(request({
      "uri": baseUrl + '/ph/blob',
      "qs": sendParams,
      "method": "POST",
      "timeout": 2000
    }).on('error', function(err) {
      reject(err);
    }));
  }));
}
