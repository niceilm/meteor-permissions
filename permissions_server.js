var _ = lodash;
var StateMatcher = {
  name: String,
  mode: Match.OneOf(null, undefined, Match.Where(_.partial(_.includes, Permissions.permissionModes, _))),
  roles: Match.OneOf(null, undefined, [String]),
  replaceStateName: Match.OneOf(null, undefined, String)
};
var _collectionPermissions = Meteor.permissions;
_collectionPermissions._ensureIndex("name", 1);
_collectionPermissions._ensureIndex("mode", 1);
_collectionPermissions._ensureIndex({mode: 1, roles: 1});

/**
 * Publish logged-in user's roles so client-side checks can work.
 *
 * Use a named publish function so clients can check `ready()` state.
 */
Meteor.publish('_permissions', publishPermissions);

_.extend(Permissions, {
  createPermission: createPermission,
  removePermission: removePermission,
  setPermission: setPermission,
  removePermissionAll: removePermissionAll
});

function removePermissionAll() {
  _collectionPermissions.remove({});
}
/**
 *
 * @param state
 */
function createPermission(state) {
  check(state, Match.OneOf(String, StateMatcher));

  if(_.isString(state)) {
    state = {name: state, roles: null, replaceStateName: null};
  }

  state.mode = state.roles ? Permissions.LOGIN : (state.mode || Permissions.PUBLIC);

  _collectionPermissions.insert(state);
}

/**
 *
 * @param {String} stateName
 */
function removePermission(stateName) {
  check(stateName, String);
  _collectionPermissions.remove({name: stateName});
}

function setPermission(state) {
  check(state, StateMatcher);
  _collectionPermissions.upsert({name: state.name}, {$set: state});
}

/**
 *
 * @returns {Cursor}
 */
function publishPermissions(user) {
  check(user, Match.OneOf(null, Object));
  var query = {mode: {$in: [Permissions.PUBLIC, Permissions.ANONYMOUS]}};
  var userId = this.userId;
  if(userId) {
    var roles = Roles.getRolesForUser(userId);
    query = {
      $or: [
        {mode: {$in: [Permissions.PUBLIC, Permissions.ANONYMOUS]}},
        {mode: Permissions.LOGIN, $or: [{roles: null}, {roles: []}, {roles: {$in: roles}}]}
      ]
    };
  }

  return _collectionPermissions.find(query);
}