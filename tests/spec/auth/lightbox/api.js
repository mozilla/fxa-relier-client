/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/
define([
  'intern!bdd',
  'intern/chai!assert',
  'client/auth/lightbox/api',
  'tests/mocks/window'
], function (bdd, assert, LightboxAPI, WindowMock) {
  'use strict';

  bdd.describe('auth/lightbox/api', function () {

    var windowMock;
    var lightbox;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      lightbox = new LightboxAPI('client_id', {
        window: windowMock
      });
    });

    bdd.afterEach(function () {
      return lightbox.unload().then(null, function (err) {
        if (err.message !== 'lightbox not open') {
          throw err;
        }
      });
    });

    function testMissingOption(endpoint, optionName) {
      var options = {
        state: 'state',
        scope: 'scope',
        redirect_uri: 'redirect_uri'
      };

      delete options[optionName];

      return lightbox[endpoint](options)
        .then(assert.fail, function (err) {
          assert.equal(err.message, optionName + ' is required');
        });
    }

    bdd.describe('signIn', function () {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption('signIn', 'scope');
      });

      bdd.it('should reject if `redirect_uri` is not specified', function () {
        return testMissingOption('signIn', 'redirect_uri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('signIn', 'state');
      });

      bdd.it('should reject if a lightbox is already open', function () {
        lightbox.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        });

        return lightbox.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'lightbox already open');
        });
      });
    });

    bdd.describe('signUp', function () {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption('signUp', 'scope');
      });

      bdd.it('should reject if `redirect_uri` is not specified', function () {
        return testMissingOption('signUp', 'redirect_uri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('signUp', 'state');
      });

      bdd.it('should reject if a lightbox is already open', function () {
        lightbox.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        });

        return lightbox.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'lightbox already open');
        });
      });
    });
  });
});


