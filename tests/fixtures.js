Meteor.methods({
  "fixtures/permissions/create": createPermissionFixture,
  "fixtures/users/create": createUserFixture
});

function createPermissionFixture() {
  Permissions.removePermissionAll();
  _.forEach([
    {
      "name": "home",
      "mode": "public",
      "roles": null,
      "replaceStateName": null
    },
    {
      "name": "login",
      "mode": "anonymous",
      "roles": null,
      "replaceStateName": "home"
    },
    {
      "name": "required-anonymous",
      "mode": "anonymous",
      "roles": null,
      "replaceStateName": "home"
    },
    {
      "name": "required-only-login",
      "mode": "login",
      "roles": null,
      "replaceStateName": "home"
    },
    {
      "name": "required-admin",
      "mode": "login",
      "roles": [
        "admin"
      ],
      "replaceStateName": null
    },
    {
      "name": "required-manager",
      "mode": "login",
      "roles": [
        "admin",
        "manager"
      ],
      "replaceStateName": null
    }
  ], function(permission) {
    Permissions.createPermission(permission);
  });
}

function createUserFixture() {
  Meteor.users.remove({});
  createUser("admin-user", ["admin"]);
  createUser("manager-user", ["manager"]);
  createUser("login-user", []);
}

function createUser(username, roles) {
  if(!Meteor.users.findOne({username: username})) {
    Accounts.createUser({
      username: username,
      password: username
    });
  }
  var user = Meteor.users.findOne({username: username});
  Roles.addUsersToRoles(user, roles);
}