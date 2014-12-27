export function presentFriends(loginResponse) {
  return loginResponse.friends.map(function(friend) {
    return {
      name: friend.name,
      displayName: friend.display,
      canSeeCustomStories: friend.can_see_custom_stories,
      isPrivate: [false, true][friend.type]
    }
  });
}
