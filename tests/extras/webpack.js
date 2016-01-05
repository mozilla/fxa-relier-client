/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'intern/dojo/node!child_process'
], function (bdd, assert, child_process) {
  'use strict';

  var exec = child_process.exec;

  bdd.describe('webpack', function () {
    bdd.it('works with webpack', function () {
      var dfd = this.async(5000);

      var WEBPACK_CMD = './node_modules/.bin/webpack tests/extras/fixtures/app.js .tmp/bundle.js';
      var BUNDLE_CMD = 'node .tmp/bundle.js';

      exec(WEBPACK_CMD, function (err) {
        if (err) {
          return dfd.reject(err);
        }

        exec(BUNDLE_CMD, function (err, stdout, stderr) {
          if (err) {
            return dfd.reject(err);
          }
          assert.equal(stdout, 'ok\n');
          return dfd.resolve();
        });
      })

    });
  });

});

