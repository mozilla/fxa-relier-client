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
  'tests/addons/sinon',
  'p-promise'
],
function (bdd, assert, LightboxAPI, Lightbox, IframeChannel,
      WindowMock, sinon, p) {
  'use strict';

  bdd.describe('auth/lightbox/api', function () {

    var windowMock;
    var lightbox;
    var channel;
    var lightboxAPI;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      channel = new IframeChannel({
        window: windowMock
      });
      lightbox = new Lightbox({
        window: windowMock
      });
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

      bdd.it('should open the lightbox to the correct page with the expected query parameters', function () {
        sinon.spy(lightbox, 'load');
        sinon.stub(channel, 'attach', function () {
          return p();
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri',
          email: 'blank'
        })
        .then(function () {
          var loadUrl = lightbox.load.args[0][0];
          assert.include(loadUrl, 'oauth/signin');
          assert.include(loadUrl, 'state=state');
          assert.include(loadUrl, 'scope=scope');
          assert.include(loadUrl, 'redirect_uri=redirect_uri');
          assert.include(loadUrl, 'email=blank');
        });
      });

      bdd.it('should open the lightbox to the /force_auth page with the expected query parameters if the RP forces authentication as a user', function () {
        sinon.spy(lightbox, 'load');
        sinon.stub(channel, 'attach', function () {
          return p();
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri',
          force_email: 'testuser@testuser.com'
        })
        .then(function () {
          var loadUrl = lightbox.load.args[0][0];
          assert.include(loadUrl, 'force_auth');
          assert.include(loadUrl, 'state=state');
          assert.include(loadUrl, 'scope=scope');
          assert.include(loadUrl, 'redirect_uri=redirect_uri');
          assert.include(loadUrl, 'email=testuser%40testuser.com');
        });
      });

      bdd.it('should return the result returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p('oauth_result');
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function (result) {
          assert.equal(result, 'oauth_result');
        });
      });

      bdd.it('should return any errors returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p.reject(new Error('oauth_error'));
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'oauth_error');
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

      bdd.it('should open the lightbox to the correct page with the expected query parameters', function () {
        sinon.spy(lightbox, 'load');
        sinon.stub(channel, 'attach', function () {
          return p();
        });

        return lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function () {
          assert.isTrue(/oauth\/signup/.test(lightbox.load.args[0]));
          assert.isTrue(/state=state/.test(lightbox.load.args[0]));
          assert.isTrue(/scope=scope/.test(lightbox.load.args[0]));
          assert.isTrue(/redirect_uri=redirect_uri/.test(lightbox.load.args[0]));
        });
      });

      bdd.it('should return the result returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p('oauth_result');
        });

        return lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function (result) {
          assert.equal(result, 'oauth_result');
        });
      });

      bdd.it('should return any errors returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p.reject(new Error('oauth_error'));
        });

        return lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'oauth_error');
        });
      });
    });
  });
});


