_ = Package["stevezhu:lodash"].lodash;
Roles = Package["alanning:roles"].Roles;
Tracker = Package["tracker"].Tracker;

FixtureLogin = function(username, callback) {
  Meteor.loginWithPassword(username, username, callback);
};