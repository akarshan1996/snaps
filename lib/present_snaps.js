"use strict";
Object.defineProperties(exports, {
  presentSnaps: {get: function() {
      return presentSnaps;
    }},
  __esModule: {value: true}
});
function presentSnaps(loginResponse) {
  return loginResponse.snaps;
}
