"use strict";
Object.defineProperties(exports, {
  phUploadImage: {get: function() {
      return phUploadImage;
    }},
  __esModule: {value: true}
});
var $__0 = require('./common_params_and_headers'),
    commonParams = $__0.commonParams,
    commonHeaders = $__0.commonHeaders,
    extend = require('underscore').extend;
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
  var formData = extend({
    "data": imageData,
    "media_id": mediaId,
    "req_token": reqToken,
    "timestamp": timestamp,
    "type": type,
    "username": username
  }, commonParams);
  return new Promise((function(resolve, reject) {
    request({
      "uri": baseUrl + '/ph/upload',
      "headers": commonHeaders,
      "method": "POST",
      "timeout": 2000,
      "formData": formData
    }).on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      if (response.statusCode === 200) {
        resolve(mediaId);
      } else {
        reject(new Error("Status code of upload request was " + response.statusCode));
      }
    });
  }));
};
function phUploadImage(imageData, username, timestamp, reqToken, request, baseUrl) {
  return upload(0, imageData, username, timestamp, reqToken, request, baseUrl);
}
