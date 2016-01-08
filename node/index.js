var path = require('path');
var requirejs = require('requirejs');

var baseUrl = path.join(__dirname, '..');
requirejs.config({
  baseUrl: baseUrl,
  nodeRequire: require
});

// r.js does not allow map to be used for aliasing from one name to another if
// the source module is in node, but using define for the same effect
// works just fine.
requirejs.define('promise', function () {
  return require('es6-promise');
});

module.exports = requirejs(path.join(baseUrl, 'client', 'FxaRelierClient.js'));
