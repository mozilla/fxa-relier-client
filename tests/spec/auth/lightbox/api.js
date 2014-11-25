/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/
define([
  'intern!bdd',
  'intern/chai!assert',
  'client/auth/lightbox/api',
  'client/auth/lightbox/lightbox',
  'client/auth/lightbox/iframe_channel',
  'tests/mocks/window',
  'tests/addons/sinon'
],
function (bdd, assert, LightboxAPI, Lightbox, IframeChannel,
      WindowMock, sinon) {
  'use strict';

  bdd.describe('auth/lightbox/api', function () {

    var windowMock;
    var lightbox;
    var channel;
    var lightboxAPI;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      channel = new IframeChannel();
      lightbox = new Lightbox();
      lightboxAPI = new LightboxAPI('client_id', {
        window: windowMock,
        channel: channel,
        lightbox: lightbox
      });
    });

    bdd.afterEach(function () {
      return lightboxAPI.unload().then(null, function (err) {
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

      return lightboxAPI[endpoint](options)
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
        lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'lightbox already open');
        });
      });

      bdd.it('should open the lightbox', function () {
        sinon.spy(lightbox, 'load');
        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function () {
          assert.isTrue(lightbox.load.called);
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
        lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        });

        return lightboxAPI.signUp({
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


