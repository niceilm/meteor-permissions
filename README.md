permission by role based

```
meteor add flynn:permissions
```

# State Rule
## public
* mode : "public"

## required no login
* mode : "anonymous"

## required login
* mode : "login"

## required role
* mode : "login"
* roles : ["requiredrole"]

# example
```
[
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
  ]
```

# API
## Permissions.stateHasPermissionByUser(stateName, [user]) - client / server
* check state has permission
* Parameters
    * stateName : String
        * check stateName
    * [user] : String|Object optional
        * User Id or object with an _id field
* Returns
    * Boolean
        * true if permission check ok

## Permissions.getPermission(stateName) - client / server
* get permission object
* Parameters
    * stateName : String
        * check stateName
* Returns
    * Object
        * permission object

## Permissions.getReplaceStateName(stateName) - client / server
* get replace state name
* Parameters
    * stateName : String
        * check stateName
* Returns
    * String
        * replaceStateName

## Permissions.createPermission(permission) - server only
* create permission
* Parameters
    * permission : Object | String
        * create permission or stateName

## Permissions.removePermission(stateName) - server only
* remove permission
* Parameters
    * permission : Object | String
        * create permission or stateName

## Permissions.removePermissionAll() - server only
* remove all permission

# Test
**required [velocity](https://www.npmjs.com/package/velocity-cli)**
```
npm install -g velocity-cli
```
```
velocity test-package ./
```