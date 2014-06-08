var should = require('should');
var Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  before(function() {
    this.snaps = new Snaps();
  })

  describe('#constructor', function() {
    it('should be an object', function() {
      this.snaps.should.be.type('object');
    })
  })

  describe('#login', function() {
    it('should include the username, timestamp, req_token, and password in the hash', function() {
      var currentTime = Date.now();
      this.snaps.login('foo', 'bar');

      this.snaps.loginParams.username.should.equal('foo');
      this.snaps.loginParams.timestamp.should.be.approximately(currentTime, 100);
      this.snaps.loginParams.req_token.should.be.ok;
      this.snaps.loginParams.password.should.be.equal('bar');
    })
  })

  describe('#_getRequestToken', function() {
    it('passes the benchmark', function() {
      var reqToken = this.snaps._getRequestToken('m198sOkJEn37DjqZ32lpRu76xmw288xSQ9', 1373209025);
      reqToken.should.equal('9301c956749167186ee713e4f3a3d90446e84d8d19a4ca8ea9b4b314d1c51b7b');
    })
  });
})
