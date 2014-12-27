"use strict";
Object.defineProperties(exports, {
  presentFriends: {get: function() {
      return presentFriends;
    }},
  __esModule: {value: true}
});
function presentFriends(loginResponse) {
  return loginResponse.friends.map(function(friend) {
    return {
      name: friend.name,
      displayName: friend.display,
      canSeeCustomStories: friend.can_see_custom_stories,
      isPrivate: [false, true][friend.type]
    };
  });
}
