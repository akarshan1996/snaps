var _ = require('underscore'),
    fs = require('fs'),
    should = require('should'),
    Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  var login;

  before(function() {
    var validateParamsExist = function(params, requestOptions, cb) {
      var missingParams = _.reject(params, function(param) {
        return _.contains(_.keys(requestOptions.qs), param);
      })
      if (missingParams.length > 0) {
        cb(new Error("The following params were missing in the request: " + missingParams.join(', ')), null, {});
      }
    }

    Snaps.prototype._request = function(options, cb) {
      if (options.uri.match(/\/bq\/login$/) &&
          options.qs.username == 'test-user' &&
          options.qs.password == 'test-password') {
        validateParamsExist(['req_token', 'timestamp'], options, cb);
        cb(null, {statusCode: 200}, JSON.stringify(require('./stubs/login-response.json')));
      } else if (options.uri.match(/\/ph\/upload$/)) {
        return {form: function() {
          return {append: function(key, value) {
            if (key == 'data' && value == 'invalid-image-data') {
              cb(new Error('Bad image data, throwing up'), {statusCode: 500}, {});
            }
            else {
              cb(null, {statusCode: 200}, {});
            }
          }}
        }}
      } else if (options.uri.match(/\/ph\/send$/)) {
        cb(null, {statusCode: 200}, {})
      } else {
        cb(new Error('Request not recognized'), {statusCode: 500}, {});
      }
    }

    Snaps.prototype._encryptImage = function(imageStream) {
      return new Promise(function(resolve, reject) {
        resolve(imageStream);
      })
    }

    login = function() {
      return new Snaps('test-user', 'test-password');
    }
  })

  describe('#constructor', function() {
    it('should log the user in with the specified username and password', function() {
      login().then(function(snaps) {
        snaps._hasAuthToken().should.be.true;
      })
    })
  })

  describe('#send', function() {
    it('should throw an error when the upload request fails', function() {
      var sendTestImage = function(snaps) {
        return snaps.send('invalid-image-data', ['foo-user', 'bar-user'], 5);
      }
      return login().then(sendTestImage).then(function(snaps) {
        throw new Error("Test failed: the success callback should not have been called");
      }).catch(function(err) {
        err.message.should.equal("Bad image data, throwing up");
      })
    })

    it('should not throw an error when the upload request succeeds', function() {
      var sendTestImage = function(snaps) {
        return snaps.send('sample-image-data', ['foo-user', 'bar-user'], 5);
      }
      return login().then(sendTestImage).then(function(snaps) {
        snaps.should.be.ok;
      }).catch(function(err) {
        throw new Error("Test failed: the error callback should not have been called");
      });
    })
  })

  describe('#_getRequestToken', function() {
    it('passes the benchmark', function() {
      return login().then(function(snaps) {
        var reqToken = snaps._getRequestToken('m198sOkJEn37DjqZ32lpRu76xmw288xSQ9', 1373209025);
        reqToken.should.equal('9301c956749167186ee713e4f3a3d90446e84d8d19a4ca8ea9b4b314d1c51b7b');
      })
    })
  });
})
