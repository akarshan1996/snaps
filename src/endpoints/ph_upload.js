var generateMediaId = function(username) {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return username.toUpperCase() + "~" + uuid;
}

var upload = function(type, imageData, username, timestamp, reqToken, request, baseUrl) {
  var mediaId = generateMediaId(username);

  var uploadParams = {
    "data": imageData,
    "media_id": mediaId,
    "req_token": reqToken,
    "timestamp": timestamp,
    "type": type,
    "username": username
  }

  return new Promise((resolve, reject) => {
    request({
      "uri": baseUrl + '/ph/upload',
      "qs": uploadParams,
      "method": "POST",
      "timeout": 2000
    }, (err, httpResponse, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(mediaId);
      }
    })
  })
}

export function uploadImage(imageData, username, timestamp, reqToken, request, baseUrl) {
  upload(0, username, timestamp, reqToken, request, baseUrl)
}
