snaps
=====

Snapchat API wrapper for use with Node.js libraries and applications.

## Examples
Sending a friend a snap:
```javascript
var fs = require('fs');
var Snaps = require('snaps').Snaps;
(new Snaps('my-username', 'my-password')).then(function(snaps) {
  console.log(snaps.getFriends());
  /* ->
    {
      "name": "mileyxxcyrus",
      "displayName": "Miley",
      "canSeeCustomStories": true,
      "isPrivate": false
    },
    {
      "name": "canadiangoose",
      "displayName": "Justin",
      "canSeeCustomStories": true,
      "isPrivate": true
    }
   */
  var file = fs.createReadStream('/path/to/an/image.jpg');
  return snaps.send(file, ['mileyxxcyrus', 'canadiangoose'], 5);
}).catch(function(err) {
  // handle error
})
```

Retrieving a snap:
```javascript
var fs = require('fs');
var Snaps = require('./lib/snaps').Snaps;
(new Snaps('my-username', 'my-password')).then(function(snaps) {
  console.log(snaps.getSnaps());
  /* ->
    {
      "id": "894720385130955367s",
      "sender": "my-username",
      "recipient": "someguy",
      "lastInteracted": 1385130955367,
      "sent": 1385130955367,
      "mediaType": "image",
      "state": "viewed"
    },
    {
      "id": "325924384416555224r",
      "sender": "teamsnapchat",
      "recipient": "my-username",
      "viewableFor": 10,
      "lastInteracted": 1384416555224,
      "sent": 1384416555224,
      "mediaType": "image",
      "state": "delivered"
    }
  */
  return snaps.fetchSnap('325924384416555224r').then(function(stream) {
    var output = new Buffer(0);
    stream.on('data', function(data) {
      output = Buffer.concat([output, data]);
    })
    stream.on('end', function() {
      fs.writeFileSync('./hello.jpg', output);
    });
  }).catch(function(err) {
    // handle error
  });
});
```

## API

- `new Snaps(username, password)`
  
  Logs into SnapChat with the specified username and password. Returns a promise whose fulfillment handler has a single param: an instance of `Snaps` logged into the particular user.

- `snaps.send(stream, recipients, snapTime)`

  Sends an image or a video (specified by the Readable stream in the `stream` param) to all SnapChat usernames specified in the `recipients` param. Images will be visible for `snapTime` seconds. Returns a promise whose fulfillment handler has a single param: the same instance of `Snaps` that called `send`.
  
- `snaps.fetchSnap(id)`

  Fetches a snap specified by `id`. Returns a promise whose fulfillment handler has a single param: a Readable stream that outputs the decrypted image or video.

- `snaps.getFriends()`

  Returns an array of all of the logged in user's friends.

- `snaps.getSnaps()`

  Returns an array of all of the logged in user's snaps.

__Tip:__ all of the promises mentioned above will call their rejection handlers if there is a connection error or if the endpoint returns a non-200 status.

## Setting up

```
npm install
```

## Running tests

```
npm test
```
