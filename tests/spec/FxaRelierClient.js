/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/sinon',
  'client/FxaRelierClient',
  'tests/mocks/window',
  'p-promise'
], function (bdd, assert, sinon, FxaRelierClient, WindowMock, p) {
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

        assert.isDefined(client.auth);
        assert.isDefined(client.profile);
        assert.isDefined(client.token);
      });
    });
  });
});


