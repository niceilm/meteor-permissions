if(!Meteor.permissions) {
  Meteor.permissions = new Mongo.Collection("permissions");
}

Meteor.permissions.attachSchema(new SimpleSchema({
  state: {type: String, label: "상태", index: 1, unique: true},
  roles: {type: [String], label: "롤"}
}));

if('undefined' === typeof Permissions) {
  Permissions = {};
}

/**
 * Publish logged-in user's roles so client-side checks can work.
 *
 * Use a named publish function so clients can check `ready()` state.
 */
Meteor.publish('_permissions', permissions);

_.extend(Permissions, {
  addState: addState,
  removeState: removeState,
  addStatesToRoles: _.wrap(addStatesToRoles, _checkParameter),
  removeStatesToRoles: _.wrap(removeStatesToRoles, _checkParameter),
  setStateToRoles: _.wrap(setStateToRoles, _checkParameter)
});

function permissions() {
  return Meteor.permissions.find();
}

function addState(state) {
  Permissions.addStatesToRoles(state, []);
}
/**
 *
 * @param state
 */
function removeState(state) {
  check(state, String);
  Meteor.permissions.remove({state: state});
}

/**
 *
 * @param {String|Array} states
 * @param {String|Array} roles
 */
function addStatesToRoles(states, roles) {
  _.each(states, function(state) {
    var permission = Meteor.permissions.findOne({state: state});
    if(permission) {
      Meteor.permissions.update(permission._id, {$addToSet: {roles: {$each: roles}}});
    } else {
      Meteor.permissions.insert({state: state, roles: roles});
    }
  });
}

/**
 *
 * @param {String|Array} states
 * @param {String|Array} roles
 */
function removeStatesToRoles(states, roles) {
  _.each(states, function(state) {
    var permission = Meteor.permissions.findOne({state: state});
    if(permission) {
      Meteor.permissions.update(permission._id, {$pullAll: {roles: roles}});
    } else {
      Meteor.permissions.insert({state: state, roles: []});
    }
  });
}

/**
 *
 * @param {String|Array} states
 * @param {String|Array} roles
 */
function setStateToRoles(states, roles) {
  _.each(states, function(state) {
    var permission = Meteor.permissions.findOne({state: state});
    if(permission) {
      Meteor.permissions.update(permission._id, {$set: {roles: roles}});
    } else {
      Meteor.permissions.insert({state: state, roles: roles});
    }
  });
}

function _checkParameter(fnAfter, states, roles) {
  check(fnAfter, Function);
  check(states, Match.OneOf(String, [String]));
  check(roles, Match.OneOf(String, [String]));

  if(!_.isArray(states)) {
    states = [states];
  }
  if(!_.isArray(roles)) {
    roles = [roles];
  }
  fnAfter.apply(this, [states, roles]);
}
