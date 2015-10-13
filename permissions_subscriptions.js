Tracker.autorun(function() {
  Permissions.subscription = Meteor.subscribe("_permissions");
});
