var should = require('should');
var Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  before(function() {
    this.snaps = new Snaps();
    this.snaps._request = function(options, cb) {
      if (options.uri.match(/\/bq\/login$/) &&
          options.qs.username == 'test-user' &&
          options.qs.password == 'test-password') {
        cb(null, null, require('./stubs/login-response.json'));
      } else {
        cb(null, null, {});
      }
    }
  })

  describe('#constructor', function() {
    it('should be an object', function() {
      this.snaps.should.be.type('object');
    })
  })

  describe('#login', function() {
    var loginResponse;

    before(function(done) {
      this.snaps.login('test-user', 'test-password').then(function(response) {
        done();
      })
    })

    it('should return an auth token in the login response', function() {
      this.snaps._hasAuthToken().should.be.true;
    })
  })

  describe('#_getRequestToken', function() {
    it('passes the benchmark', function() {
      var reqToken = this.snaps._getRequestToken('m198sOkJEn37DjqZ32lpRu76xmw288xSQ9', 1373209025);
      reqToken.should.equal('9301c956749167186ee713e4f3a3d90446e84d8d19a4ca8ea9b4b314d1c51b7b');
    })
  });
})
