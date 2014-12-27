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

## Setting up

```
npm install
```

## Running tests

```
npm test
```
