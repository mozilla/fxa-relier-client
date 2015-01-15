var path = require('path');

var amd = require('./amd-loader');

var map = {
  'p-promise': 'p-promise'
};

var baseUrl = path.join(__dirname, '..');
module.exports = amd(path.join(baseUrl, 'client', 'FxaRelierClient.js'), baseUrl, map);
