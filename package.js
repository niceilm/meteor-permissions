Package.describe({
  name: 'flynn:permissions',
  version: '0.0.5',
  // Brief, one-line summary of the package.
  summary: 'role based permission',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/niceilm/meteor-permissions.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.export('Permissions');
  api.use('mongo');
  api.use('tracker');
  api.use('check');
  api.use('ecmascript');
  api.use('flynn:logger@0.0.3');
  api.use('alanning:roles@1.2.14');
  api.use('stevezhu:lodash@3.10.1');

  api.addFiles('permissions.js');
  api.addFiles('permissions_server.js', 'server');
  api.addFiles('permissions_subscriptions.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('accounts-password');
  api.use('sanjo:jasmine@0.20.2');
  api.use('velocity:helpers@0.5.0');
  api.use('peerlibrary:async@0.9.2_1');
  api.use('flynn:permissions');
  api.addFiles('tests/helper.js', ['server', 'client']);
  api.addFiles('tests/fixtures.js', 'server');
  api.addFiles('tests/client/permissions_spec.js', 'client');
  api.addFiles('tests/server/permissions_spec.js', 'server');
});
