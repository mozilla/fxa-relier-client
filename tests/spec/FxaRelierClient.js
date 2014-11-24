/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/
define([
  'intern!bdd',
  'intern/chai!assert',
  'client/FxaRelierClient',
  'tests/mocks/window',
  'p-promise'
], function (bdd, assert, FxaRelierClient, WindowMock, p) {
  'use strict';

  bdd.describe('FxaRelierClient', function () {
    bdd.describe('constructor', function () {
      bdd.it('throws if `clientId` is missing', function () {
        return p()
          .then(function () {
            return new FxaRelierClient(null, {
              window: new WindowMock()
            });
          })
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'clientId is required');
          });
      });

      bdd.it('creates a client if all options are available', function () {
        var client = new FxaRelierClient('client_id', {
          window: new WindowMock()
        });

        assert.ok(client.auth.lightbox);
      });
    });
  });
});


