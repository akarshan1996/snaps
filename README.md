snaps
=====

Snapchat API wrapper in JavaScript, using some ES6 features via Traceur.

## Example
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

## API

- `new Snaps(username, password)`

  Logs into SnapChat with the specified username and password. Returns a promise whose fulfillment handler has a single param: an instance of `Snaps` logged into the particular user.

- `snaps.send(stream, recipients, snapTime)`

  Sends a Readable stream of an image or a video to all SnapChat usernames specified in the `recipients` array. Images will be visible for `snapTime` seconds. Returns a promise whose fulfillment handler has a single param: the same instance of `Snaps` that called `send`.

- `snaps.getFriends()`

  Returns an array of all of the logged in user's friends.

- `snaps.getSnaps()`

  Returns an array of all of the logged in user's snaps.

## Setting up

```
npm install
```

## Running tests

```
npm test
```
