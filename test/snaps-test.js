var should = require('should');
var Snaps = require('../lib/snaps').Snaps;

describe('Snaps', function() {
  describe('#constructor', function() {
    before(function() {
      this.snaps = new Snaps();
    })

    it('should be an object', function() {
      this.snaps.should.be.type('object');
    })
  })
})
