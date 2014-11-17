/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
      lightbox = new LightboxAPI({
        window: windowMock
      });
    });

    bdd.afterEach(function () {
      try {
        lightbox.unload();
      } catch(e) {
        // the lightbox might not be loaded.
      }
    });

    bdd.describe('signIn', function () {
      bdd.it('should return a promise', function () {
        assert.isTrue('then' in (lightbox.signIn()));
      });

      bdd.it('should reject if a lightbox is already open', function () {
        lightbox.signIn();
        return lightbox.signIn()
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'lightbox already open');
          });
      });
    });

    bdd.describe('signUp', function () {
      bdd.it('should return a promise', function () {
        assert.isTrue('then' in (lightbox.signUp()));
      });

      bdd.it('should reject if a lightbox is already open', function () {
        lightbox.signUp();
        return lightbox.signUp()
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'lightbox already open');
          });
      });
    });
  });
});


