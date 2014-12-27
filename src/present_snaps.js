export function presentSnaps(loginResponse, username) {
  return loginResponse.snaps.map(function(snap) {
    var hash = {
      id: snap.id,
      sender: getSender(snap, username),
      recipient: getRecipient(snap, username),
      lastInteracted: snap.ts,
      sent: snap.sts,
      mediaType: getMediaType(snap),
      state: getState(snap)
    }
    if (snap.t) {
      hash.viewableFor = snap.t;
    }
    return hash;
  });
}

var getSender = function(snap, username) {
  if (snap.sn) {
    return snap.sn;
  } else {
    return username;
  }
}

var getRecipient = function(snap, username) {
  if (snap.rp) {
    return snap.rp;
  } else {
    return username;
  }
}

var getMediaType = function(snap) {
  return [
    'image',
    'video',
    'videoNoAudio',
    'friendRequest',
    'friendRequestImage',
    'friendRequestVideo',
    'friendRequestVideoNoAudio'
  ][snap.m]
}

var getState = function(snap) {
  if (snap.st == -1) {
    return 'none';
  }
  return [
    'sent',
    'delivered',
    'viewed',
    'screenshot'
  ][snap.st]
}
