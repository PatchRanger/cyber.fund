Package.describe({
  name: 'cyberfund:cyberfund-base',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var c= "client", s= "server", cs = ["client", "server"];

Npm.depends({"crypto-balance":  "0.0.20"});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(["underscore", "accounts-base", "d3js:d3"], cs);
  api.use(["templating"], c);
  api.addFiles(['cyberfund-base.js', 'cf-user.js', 'cf-utils.js'], cs);
  api.addFiles(['server/cf-social-server.js'], s);
  api.addFiles(['client/utils-client.js', 'client/helpers.js'], c);
  api.export("CF");
  api.export("Extras");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cyberfund:cyberfund-base');
  api.addFiles('cyberfund-base-tests.js');
});
