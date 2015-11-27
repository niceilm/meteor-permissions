var _ = lodash;

if(!Meteor.permissions) {
  Meteor.permissions = new Mongo.Collection("permissions");
}

if('undefined' === typeof Permissions) {
  Permissions = {};
}
var PUBLIC = "public";
var LOGIN = "login";
var ANONYMOUS = "anonymous";
var permissionModes = [PUBLIC, LOGIN, ANONYMOUS];

_.extend(Permissions, {
  LOGIN: LOGIN,
  PUBLIC: PUBLIC,
  ANONYMOUS: ANONYMOUS,
  permissionModes: permissionModes,
  stateHasPermissionByUser: stateHasPermissionByUser,
  getPermission: getPermission,
  getReplaceStateName: getReplaceStateName
});

/**
 *
 * @param stateName {String}
 * @param user {[String|Object]}
 * @returns {boolean|*}
 */
function stateHasPermissionByUser(stateName, user) {
  check(stateName, String);
  check(user, Match.OneOf(Object, String, null, undefined));

  var permission = getPermission(stateName);

  // deny
  if(!permission) {
    return false;
  }

  if(permission.mode === Permissions.PUBLIC) {
    return true;
  }

  // login
  if(user) {
    if(permission.mode === Permissions.ANONYMOUS) {
      return false;
    }
  } else {
    return permission.mode === Permissions.ANONYMOUS;
  }

  if(_.isArray(permission.roles)) {
    return Roles.userIsInRole(user, permission.roles);
  } else {
    return true;
  }
}

/**
 *
 * @param stateName
 * @returns {Object}
 */
function getPermission(stateName) {
  check(stateName, String);
  var exactMatchPermission = Meteor.permissions.findOne({name: stateName});
  if(exactMatchPermission) {
    return exactMatchPermission;
  } else {
    var parentStateName = stateName.split(".")[0];
    return Meteor.permissions.findOne({name: parentStateName});
  }

}

/**
 *
 * @param {String} stateName
 * @returns {String}
 */
function getReplaceStateName(stateName) {
  var permission = getPermission(stateName);
  return permission ? permission.replaceStateName : null;
}