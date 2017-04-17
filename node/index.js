var path = require('path');

var amd = require('./amd-loader');

var map = {
  'promise': 'es6-promise'
};

var baseUrl = path.join(__dirname, '..');
module.exports = amd(path.join(baseUrl, 'client', 'FxaRelierClient.js'), baseUrl, map);
