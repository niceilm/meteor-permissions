if(!Meteor.permissions) {
  Meteor.permissions = new Mongo.Collection("permissions");
}

if('undefined' === typeof Permissions) {
  Permissions = {};
}

_.extend(Permissions, {
  userHasPermissionByState: userHasPermissionByState
});

Meteor.permissions.findByQuery = findByQuery;

/**
 *
 * @param user
 * @param stateName
 * @returns {boolean|*}
 */
function userHasPermissionByState(user, stateName) {
  check(user, Match.OneOf(Object, String));
  check(stateName, String);

  var permission = Meteor.permissions.findOne({state: stateName});
  return !permission || permission.roles.length === 0 || Roles.userIsInRole(user, permission.roles);
}
/**
 *
 * @param {Object} query
 * @param {Number} limit
 * @returns {*}
 */
function findByQuery(query, limit) {
  check(query, Object);
  check(limit, Match.Optional(Number));
  var searchQuery = {};
  var searchSort = [["state", "asc"]];
  var options = {limit: limit || 0};

  query = _.pick(query, 'score', 'category');

  if(query.score && query.score != "-1") {
    searchQuery["score"] = query.score;
  }

  if(query.category && query.category != "-1") {
    searchQuery["category"] = query.category;
  }

  if(query.order && query.order !== "createdAt") {
    searchSort.unshift([query.order, "desc"]);
  }
  options.sort = searchSort;

  $log.debug("query : ", searchQuery, "options : ", options);
  return Meteor.permissions.find(searchQuery, options);
}
