snaps
=====

Snapchat API wrapper for use with Node.js libraries and applications.

## Examples
Sending a friend a snap:
```javascript
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
}).then(function() {
  // all done!
}).catch(function(err) {
  // handle error
})
```

Retrieving a snap:
```javascript
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
