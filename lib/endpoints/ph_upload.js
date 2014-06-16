"use strict";
Object.defineProperties(exports, {
  phUploadImage: {get: function() {
      return phUploadImage;
    }},
  __esModule: {value: true}
});
var _ = require('underscore');
var generateMediaId = function(username) {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return username.toUpperCase() + "~" + uuid;
};
var upload = function(type, imageData, username, timestamp, reqToken, request, baseUrl) {
  var mediaId = generateMediaId(username);
  var uploadParams = {
    "data": imageData,
    "media_id": mediaId,
    "req_token": reqToken,
    "timestamp": timestamp,
    "type": type,
    "username": username
  };
  return new Promise((function(resolve, reject) {
    var form = request({
      "uri": baseUrl + '/ph/upload',
      "method": "POST",
      "timeout": 2000
    }, (function(err, httpResponse, body) {
      if (err || httpResponse.statusCode != 200) {
        reject(err || new Error("Status code of upload request was " + httpResponse.statusCode));
      } else {
        resolve(mediaId);
      }
    })).form();
    _(uploadParams).each((function(value, key) {
      form.append(key, value);
    }));
  }));
};
function phUploadImage(imageData, username, timestamp, reqToken, request, baseUrl) {
  return upload(0, imageData, username, timestamp, reqToken, request, baseUrl);
}
