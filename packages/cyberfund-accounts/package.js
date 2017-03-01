Package.describe({
  name: "cyberfund:cyberfund-accounts",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.3");
  api.use(["cyberfund:cyberfund-currentdata"]);
  api.use(["underscore"], ["client", "server"]);
  api.use(["ui", "templating"], "client");
  api.addFiles(["accounts.js"], ["client", "server"]);
  api.addFiles(["server/accounts-server.js"], "server");
});

Package.onTest(function(api) {
  api.addFiles("cyberfund-userassets-tests.js");
});
