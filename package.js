Package.describe({
  name: 'flynn:permissions',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'role based permission',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/niceilm/meteor-permissions.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.export('Permissions');
  api.use('mongo');
  api.use('tracker');
  api.use('check');
  api.use('ecmascript');
  api.use('alanning:roles@1.2.14');
  api.use('stevezhu:lodash@3.10.1');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('tmeasday:publish-counts@0.7.2');
  api.imply('alanning:roles');
  api.addFiles('permissions.js');
  api.addFiles('permissions_server.js', 'server');
  api.addFiles('permissions_subscriptions.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('flynn:permissions');
  api.addFiles('permissions-tests.js');
});
