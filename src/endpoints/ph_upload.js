var {commonParams, commonHeaders} = require('./common_params_and_headers'),
    {each, extend} = require('underscore'),
    FormData = require('request/node_modules/form-data');

var generateMediaId = function(username) {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return username.toUpperCase() + "~" + uuid;
}

var upload = function(type, imageData, username, timestamp, reqToken, request, baseUrl) {
  var mediaId = generateMediaId(username);

  var req = request({
    "uri": baseUrl + "/ph/upload",
    "headers": commonHeaders,
    "method": "POST",
    "timeout": 2000
  });

  var form = req.form();
  form.append('data', imageData, {filename: 'image'});
  each(extend({
    "media_id": mediaId,
    "req_token": reqToken,
    "timestamp": timestamp,
    "type": type,
    "username": username
  }, commonParams), function(value, key) {
    form.append(key, value);
  });

  return new Promise((resolve, reject) => {
    req.on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      if (response.statusCode === 200) {
        resolve(mediaId);
      } else {
        reject(new Error("Status code of upload request was " + response.statusCode));
      }
    });
  })
}

export function phUploadImage(imageData, username, timestamp, reqToken, request, baseUrl) {
  return upload(0, imageData, username, timestamp, reqToken, request, baseUrl)
}
