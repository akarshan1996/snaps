var _ = require('underscore'),
    fs = require('fs'),
    should = require('should'),
    Snaps = require('../lib/snaps').Snaps,
    decrypt = require('../lib/encryption').decrypt,
    stream = require('stream');

describe('Snaps', function() {
  var login;

  before(function() {
    var getMissingParams = function(expectedParams, requestOptions) {
      return _.reject(expectedParams, function(param) {
        return _.contains(_.keys(requestOptions.qs), param);
      });
    }

    Snaps.prototype._request = function(options, cb) {
      if (options.uri.match(/\/bq\/login$/)) {
        var mockStream = new stream.Readable;
        var missingParams = getMissingParams(['username', 'password', 'req_token', 'timestamp'], options);
        if (missingParams.length > 0) {
          mockStream._read = function() {
            mockStream.emit('error', new Error("The following params were missing in the login request: " + missingParams.join(', ')));
          }
        }
        else if (options.qs.username == 'test-user' && options.qs.password == 'test-password') {
          mockStream._read = function() {
            mockStream.emit('response', {statusCode: 200});
            mockStream.push(JSON.stringify(require('./stubs/login-response.json')));
            mockStream.push(null);
          }
        } else { // incorrect username/password
          mockStream._read = function() {
            mockStream.emit('response', {statusCode: 200});
            mockStream.push(JSON.stringify({status: -100}));
            mockStream.push(null);
          }
        }
        return mockStream;
      }

      else if (options.uri.match(/\/ph\/upload$/)) {
        var mockStream = new stream.Readable;
        mockStream.form = function() {
          return {
            append: function(key, value) {
              if (key === 'data') {
                var encryptedBuffer = value;
                var encryptedBufferStream = new stream.PassThrough();
                encryptedBufferStream.end(encryptedBuffer);
                decrypt(encryptedBufferStream).then(function(decryptStream) {
                  var decryptedData = "";
                  decryptStream.on('data', function(data) {
                    decryptedData += data;
                  });
                  decryptStream.on('end', function() {
                    if (decryptedData.trim() === 'invalid-image-data') {
                      mockStream.emit('response', {statusCode: 500});
                    } else {
                      mockStream.emit('response', {statusCode: 200});
                    }
                  });
                });
              }
            }
          }
        }
        return mockStream;
      }

      else if (options.uri.match(/\/ph\/send$/)) {
        var mockStream = new stream.Readable;
        mockStream._read = function() {
          mockStream.emit('response', {statusCode: 200});
        }
        return mockStream;
      }

      else if (options.uri.match(/\/ph\/blob$/)) {
        stubStream = fs.createReadStream('./test/stubs/' + options.qs.id);
        stubStream.on('error', function() {
          stubStream.emit('response', {statusCode: 410});
        });
        stubStream.on('readable', function() {
          stubStream.emit('response', {statusCode: 200})
        });
        return stubStream;
      }

      else {
        cb(new Error('Request not recognized'), {statusCode: 500}, {});
      }
    }

    login = function() {
      return new Snaps('test-user', 'test-password');
    }
  })

  describe('#constructor', function() {
    it('should log the user in with the specified username and password', function() {
      return login().then(function(snaps) {
        snaps.authToken.should.equal("77ba2422-6cab-5967-bc28-eaa95eb44fb0");
      })
    })

    it('should throw an error when the username or password is incorrect', function() {
      return new Snaps('blah', 'bleh').then(function(snaps) {
        throw new Error("Test failed: Snaps should not have logged in with incorrect credentials.");
      }).catch(function(err) {
        err.message.should.eql('Incorrect username and password combo.');
      });
    })
  })

  describe('#send', function() {
    it('should throw an error when the upload request fails', function() {
      var sendTestImage = function(snaps) {
        var invalidImageData = fs.createReadStream('./test/stubs/invalid-image-data');
        return snaps.send(invalidImageData, ['foo-user', 'bar-user'], 5);
      }
      return login().then(sendTestImage).then(function(snaps) {
        throw new Error("Test failed: the success callback should not have been called");
      }).catch(function(err) {
        err.message.should.eql("Status code of upload request was 500");
      })
    })

    it('should not throw an error when the upload request succeeds', function() {
      var sendTestImage = function(snaps) {
        var validImageData = fs.createReadStream('./test/stubs/image-data');
        return snaps.send(validImageData, ['foo-user', 'bar-user'], 5);
      }
      return login().then(sendTestImage).then(function(snaps) {
        snaps.should.be.ok;
      }).catch(function(err) {
        throw new Error("Test failed: the error callback should not have been called");
      });
    })
  })

  describe('#fetchSnap', function() {
    it("returns a promise that contains a stream of decrypted snap data when the snap ID is valid", function() {
      return login().then(function(snaps) {
        return snaps.fetchSnap('encrypted-image-data');
      }).catch(function(err) {
        throw new Error("Test failed: error occured when running fetchSnap. " + err.stack);
      }).then(function(stream) {
        var decryptedData = "";
        stream.on('data', function(data) {
          decryptedData += data;
        });
        stream.on('end', function(data) {
          decryptedData.trim().should.eql('image-data');
        });
      });
    });

    it("throws an error when the snap ID is invalid", function() {
      return login().then(function(snaps) {
        return snaps.fetchSnap('missing-snap');
      }).catch(function(err) {
        err.message.should.eql('Status code of fetch request was 410');
      });
    });
  });

  describe('#getSnaps', function() {
    it("returns the user's snaps", function() {
      return login().then(function(snaps) {
        snaps.getSnaps().should.eql([
          {
            "id": "894720385130955367s",
            "sender": "test-user",
            "recipient": "someguy",
            "lastInteracted": 1385130955367,
            "sent": 1385130955367,
            "mediaType": "image",
            "state": "delivered"
          },
          {
            "id": "116748384417608719r",
            "sender": "randomdude",
            "recipient": "test-user",
            "lastInteracted": 1384417608719,
            "sent": 1384417608719,
            "mediaType": "image",
            "state": "viewed",
          },
          {
            "id": "325924384416555224r",
            "sender": "teamsnapchat",
            "recipient": "test-user",
            "viewableFor": 10,
            "lastInteracted": 1384416555224,
            "sent": 1384416555224,
            "mediaType": "image",
            "state": "delivered"
          }
        ]);
      });
    });
  });

  describe('#getFriends', function() {
    it("returns the user's friends", function() {
      return login().then(function(snaps) {
        snaps.getFriends().should.eql([
          {
            "name": "teamsnapchat",
            "displayName": "Team Snapchat",
            "canSeeCustomStories": true,
            "isPrivate": false
          },
          {
            "name": "someguy",
            "displayName": "Some Guy",
            "canSeeCustomStories": true,
            "isPrivate": false
          },
          {
            "name": "youraccount",
            "displayName": "",
            "canSeeCustomStories": true,
            "isPrivate": true
          }
        ]);
      });
    });
  });

  describe('#_getRequestToken', function() {
    it('passes the benchmark', function() {
      return login().then(function(snaps) {
        var reqToken = snaps._getRequestToken('m198sOkJEn37DjqZ32lpRu76xmw288xSQ9', 1373209025);
        reqToken.should.eql('9301c956749167186ee713e4f3a3d90446e84d8d19a4ca8ea9b4b314d1c51b7b');
      })
    })
  });
})
