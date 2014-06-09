require('traceur/bin/traceur-runtime');
var crypto = require('crypto');
var {map} = require('underscore');
var request = require('request');

export class Snaps {
  constructor(username, password) {
    this.STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
    this.SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
    this.PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
    this.baseUrl = 'https://feelinsonice-hrd.appspot.com';

    return this._login(username, password);
  }

  _login(username, password) {
    var timestamp = Date.now();
    var loginParams = {
      "username": username,
      "timestamp": timestamp,
      "req_token": this._getRequestToken(this.STATIC_TOKEN, timestamp),
      "password": password
    }

    return new Promise((resolve, reject) => {
      this._request({
        "uri": this.baseUrl + '/bq/login',
        "qs": loginParams,
        "method": "POST",
        "timeout": 10000
      }, (err, httpResponse, body) => {
        if (err) {
          reject(Error('Error logging in.'));
        } else {
          this.authToken = body.auth_token;
          resolve(this);
        }
      })
    })
  }

  _getRequestToken(authToken, timestamp) {
    var first = crypto.createHash('sha256')
                      .update(this.SECRET + authToken)
                      .digest('hex');
    var second = crypto.createHash('sha256')
                       .update(timestamp + this.SECRET)
                       .digest('hex');
    return map(this.PATTERN, (c, i) => {
      if (c == '0') {
        return first[i];
      } else {
        return second[i];
      }
    }).join('');
  }

  _hasAuthToken() {
    return this.authToken != null;
  }

  _request(options, cb) {
    request(options, cb)
  }
}
