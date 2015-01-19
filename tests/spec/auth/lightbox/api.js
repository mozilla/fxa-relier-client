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
function (bdd, assert, LightboxBroker, Lightbox, IframeChannel,
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
      lightboxAPI = new LightboxBroker('client_id', {
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
        redirectUri: 'redirectUri',
        email: 'testuser@testuser.com'
      };

      delete options[optionName];

      return lightboxAPI[endpoint](options)
        .then(assert.fail, function (err) {
          assert.equal(err.message, optionName + ' is required');
        });
    }

    function testCommonMissingOptions(endpoint) {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption(endpoint, 'scope');
      });

      bdd.it('should reject if `redirectUri` is not specified', function () {
        return testMissingOption(endpoint, 'redirectUri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption(endpoint, 'state');
      });
    }

    bdd.describe('signIn', function () {
      testCommonMissingOptions('signIn');

      bdd.it('should reject if a lightbox is already open', function () {
        lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
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
          redirectUri: 'redirectUri',
          email: 'blank'
        })
        .then(function () {
          var loadUrl = lightbox.load.args[0][0];
          assert.include(loadUrl, 'action=signin');
          assert.include(loadUrl, 'state=state');
          assert.include(loadUrl, 'scope=scope');
          assert.include(loadUrl, 'redirect_uri=redirectUri');
          assert.include(loadUrl, 'email=blank');
        });
      });

      bdd.it('should return the result returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p('oauth_result');
        });

        return lightboxAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
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
          redirectUri: 'redirectUri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'oauth_error');
        });
      });
    });

    bdd.describe('forceAuth', function () {
      testCommonMissingOptions('forceAuth');

      bdd.it('should reject if `email` is not specified', function () {
        return testMissingOption('forceAuth', 'email');
      });

      bdd.it('should open the lightbox to with action=force_auth with the expected query parameters', function () {
        sinon.spy(lightbox, 'load');
        sinon.stub(channel, 'attach', function () {
          return p();
        });

        return lightboxAPI.forceAuth({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri',
          email: 'testuser@testuser.com'
        })
        .then(function () {
          var loadUrl = lightbox.load.args[0][0];
          assert.include(loadUrl, 'action=force_auth');
          assert.include(loadUrl, 'state=state');
          assert.include(loadUrl, 'scope=scope');
          assert.include(loadUrl, 'redirect_uri=redirectUri');
          assert.include(loadUrl, 'email=testuser%40testuser.com');
        });
      });
    });


    bdd.describe('signUp', function () {
      testCommonMissingOptions('signUp');

      bdd.it('should reject if a lightbox is already open', function () {
        lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
        });

        return lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
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
          redirectUri: 'redirectUri'
        })
        .then(function () {
          assert.isTrue(/action=signup/.test(lightbox.load.args[0]));
          assert.isTrue(/state=state/.test(lightbox.load.args[0]));
          assert.isTrue(/scope=scope/.test(lightbox.load.args[0]));
          assert.isTrue(/redirect_uri=redirectUri/.test(lightbox.load.args[0]));
        });
      });

      bdd.it('should return the result returned by the channel', function () {
        sinon.stub(channel, 'attach', function () {
          return p('oauth_result');
        });

        return lightboxAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
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
          redirectUri: 'redirectUri'
        })
        .then(assert.fail, function (err) {
          assert.equal(err.message, 'oauth_error');
        });
      });
    });
  });
});


