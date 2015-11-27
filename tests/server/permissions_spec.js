describe('permissions on server', function() {
  beforeAll(function() {
    VelocityHelpers.exportGlobals();
  });

  afterEach(function() {
    Meteor.permissions.remove({});
  });

  it('createState', function() {
    expect(Meteor.permissions.findOne("test-state")).toBeUndefined();
    Permissions.createPermission("test-state");
    var state = Permissions.getPermission("test-state");
    expect(state).toBeDefined();
    expect(state.roles).toBeNull();
    expect(state.replaceStateName).toBeNull();
    Permissions.removePermission("test-state");
  });

  it('removeState', function() {
    expect(Meteor.permissions.findOne("test-state")).toBeUndefined();
    Permissions.createPermission("test-state");
    Permissions.removePermission("test-state");
    var permission = Permissions.getPermission("test-state");
    expect(permission).toBeUndefined();
  });
});