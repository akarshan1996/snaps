var should = require('should');
var Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  var createSnaps;

  before(function() {
    Snaps.prototype._request = function(options, cb) {
      if (options.uri.match(/\/bq\/login$/) &&
          options.qs.username == 'test-user' &&
          options.qs.password == 'test-password') {
        cb(null, null, require('./stubs/login-response.json'));
      } else {
        cb(null, null, {});
      }
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
      })
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
