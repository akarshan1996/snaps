var _ = require('underscore');
var fs = require('fs');
var should = require('should');
var Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  var createSnaps;

  beforeEach(function() {
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
        cb(null, null, require('./stubs/login-response.json'));
      } else if (options.uri.match(/\/ph\/upload$/) &&
                 options.qs.data == 'sample-image-data' &&
                 options.qs.username == 'test-user' &&
                 options.qs.type == 0) {
        validateParamsExist(['media_id', 'req_token', 'timestamp'], options, cb);
        cb(null, null, {});
      } else if (options.uri.match(/\/ph\/send$/)) {
        validateParamsExist(['media_id', 'req_token', 'timestamp', 'recipient', 'time'], options, cb);
        cb(null, null, {})
      } else {
        cb(new Error('Request not recognized'), null, {});
      }
    }

    Snaps.prototype._encryptImage = function(rawImageData) {
      return rawImageData;
    }

    createSnaps = function() {
      return new Snaps('test-user', 'test-password');
    }
  })

  describe('#constructor', function() {
    it('should log the user in with the specified username and password', function(done) {
      createSnaps().then(function(snaps) {
        snaps._hasAuthToken().should.be.true;
        done();
      }, done)
    })
  })

  describe('#send', function() {
    it('should throw an error when the upload request fails', function(done) {
      var sendTestImage = function(snaps) {
        return snaps.send('invalid-image-data', ['foo-user', 'bar-user'], 5, 'test-user');
      }
      createSnaps().then(sendTestImage).then(function() {
        done(new Error("'Send image' promise should not have resolved successfully."));
      }).catch(function(err) {
        // ignore err
        done();
      })
    })

    it('should not throw an error when the upload request succeeds', function(done) {
      var sendTestImage = function(snaps) {
        return snaps.send('sample-image-data', ['foo-user', 'bar-user'], 5, 'test-user');
      }
      createSnaps().then(sendTestImage).then(function(snaps) {
        if (snaps) {
          done();
        } else {
          done(new Error("'Send image promise did not return the snaps object"));
        }
      }, done)
    })
  })

  describe('#_getRequestToken', function() {
    it('passes the benchmark', function(done) {
      createSnaps().then(function(snaps) {
        var reqToken = snaps._getRequestToken('m198sOkJEn37DjqZ32lpRu76xmw288xSQ9', 1373209025);
        reqToken.should.equal('9301c956749167186ee713e4f3a3d90446e84d8d19a4ca8ea9b4b314d1c51b7b');
        done();
      })
    })
  });
})
