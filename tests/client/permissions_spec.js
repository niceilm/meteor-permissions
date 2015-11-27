describe('permissions on client', function() {
  beforeAll(function(done) {
    VelocityHelpers.exportGlobals();
    async.parallel([
      _.partial(Meteor.call, "fixtures/permissions/create", _),
      _.partial(Meteor.call, "fixtures/users/create", _),
      function(callback) {
        Tracker.autorun(function(c) {
          if(!Meteor.loggingIn() && Roles.subscription.ready() && Permissions.subscription.ready()) {
            c.stop();
            callback();
          }
        });
      }
    ], done);
  });

  afterEach(function(cb) {
    Meteor.logout(cb);
  });

  afterAll(function() {
  });

  it("비로그인 경우 public 과 anonymous만 된다.", function() {
    var userId = Meteor.userId();
    expect(Meteor.permissions.find().count()).toBe(3);
    expect(Permissions.stateHasPermissionByUser("absence-state", userId)).toBe(false);
    expect(Permissions.stateHasPermissionByUser("home", userId)).toBe(true);
    expect(Permissions.stateHasPermissionByUser("login", userId)).toBe(true);
    expect(Permissions.stateHasPermissionByUser("required-anonymous", userId)).toBe(true);
    expect(Permissions.stateHasPermissionByUser("required-only-login", userId)).toBe(false);
    expect(Permissions.stateHasPermissionByUser("required-manager", userId)).toBe(false);
    expect(Permissions.stateHasPermissionByUser("required-admin", userId)).toBe(false);
  });

  it("로그인인 경우 public, anonymous와 본인이 포함된 role이 리턴된다. - no roles", function(cb) {
    expect(Meteor.permissions.find().count()).toBe(3);
    FixtureLogin("login-user", function() {
      var userId = Meteor.userId();
      expect(Meteor.permissions.find().count()).toBe(4);
      expect(Permissions.stateHasPermissionByUser("absence-state", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("home", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("login", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-anonymous", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-only-login", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-manager", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-admin", userId)).toBe(false);
      cb();
    });
  });

  it("로그인인 경우 public, anonymous와 본인이 포함된 role이 리턴된다. - manager roles", function(cb) {
    expect(Meteor.permissions.find().count()).toBe(3);
    FixtureLogin("manager-user", function() {
      var userId = Meteor.userId();
      expect(Meteor.permissions.find().count()).toBe(5);
      expect(Permissions.stateHasPermissionByUser("absence-state", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("home", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("login", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-anonymous", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-only-login", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-manager", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin", userId)).toBe(false);
      cb();
    });
  });

  it("로그인인 경우 public, anonymous와 본인이 포함된 role이 리턴된다. - admin roles", function(cb) {
    expect(Meteor.permissions.find().count()).toBe(3);
    FixtureLogin("admin-user", function() {
      var userId = Meteor.userId();
      expect(Meteor.permissions.find().count()).toBe(6);
      expect(Permissions.stateHasPermissionByUser("absence-state", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("home", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("login", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-anonymous", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-only-login", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-manager", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin", userId)).toBe(true);
      cb();
    });
  });
  it("check nested state", function(cb) {
    expect(Meteor.permissions.find().count()).toBe(3);
    FixtureLogin("admin-user", function() {
      var userId = Meteor.userId();
      expect(Meteor.permissions.find().count()).toBe(6);
      expect(Permissions.stateHasPermissionByUser("absence-state", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("home", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("login", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-anonymous", userId)).toBe(false);
      expect(Permissions.stateHasPermissionByUser("required-only-login", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-manager", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin.index", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin.user", userId)).toBe(true);
      expect(Permissions.stateHasPermissionByUser("required-admin.post", userId)).toBe(true);
      cb();
    });
  });
});