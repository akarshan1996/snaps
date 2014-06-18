snaps
=====

Snapchat API wrapper in JavaScript, using some ES6 features via Traceur.

## Example

```javascript
var Snaps = require('snaps').Snaps;
(new Snaps('my-username', 'my-password')).then(function(snaps) {
  var file = fs.createReadStream('/path/to/an/image.jpg');
  return snaps.send(file, ['recipient-1', 'recipient-2'], 5);
}).then(function() {
  // all done!
}).catch(function(err) {
  // handle error
})
```
