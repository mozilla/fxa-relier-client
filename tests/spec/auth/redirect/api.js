/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/
define([
  'intern!bdd',
  'intern/chai!assert',
  'client/auth/redirect/api',
  'tests/mocks/window',
  'tests/addons/sinon',
  'p-promise'
],
function (bdd, assert, RedirectBroker, WindowMock, sinon, p) {
  'use strict';

  bdd.describe('auth/redirect/api', function () {

    var windowMock;
    var redirectAPI;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      redirectAPI = new RedirectBroker('client_id', {
        window: windowMock
      });
    });

    bdd.afterEach(function () {
    });

    function testMissingOption(endpoint, optionName) {
      var options = {
        state: 'state',
        scope: 'scope',
        redirectUri: 'redirectUri',
        email: 'testuser@testuser.com'
      };

      delete options[optionName];

      return redirectAPI[endpoint](options)
        .then(assert.fail, function (err) {
          assert.equal(err.message, optionName + ' is required');
        });
    }

    bdd.describe('signIn', function () {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption('signIn', 'scope');
      });

      bdd.it('should reject if `redirectUri` is not specified', function () {
        return testMissingOption('signIn', 'redirectUri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('signIn', 'state');
      });

      bdd.it('should redirect with action=signin page and other expected query parameters', function () {
        return redirectAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri',
          email: 'blank'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, 'action=signin');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirectUri');
          assert.include(redirectedTo, 'email=blank');
        });
      });

    });

    bdd.describe('forceAuth', function () {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption('forceAuth', 'scope');
      });

      bdd.it('should reject if `redirectUri` is not specified', function () {
        return testMissingOption('forceAuth', 'redirectUri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('forceAuth', 'state');
      });

      bdd.it('should reject if `email` is not specified', function () {
        return testMissingOption('forceAuth', 'email');
      });

      bdd.it('should redirect with action=force_auth and other expected query parameters', function () {
        return redirectAPI.forceAuth({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri',
          email: 'testuser@testuser.com'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, 'action=force_auth');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirectUri');
          assert.include(redirectedTo, 'email=testuser%40testuser.com');
        });
      });
    });

    bdd.describe('signUp', function () {
      bdd.it('should reject if `scope` is not specified', function () {
        return testMissingOption('signUp', 'scope');
      });

      bdd.it('should reject if `redirectUri` is not specified', function () {
        return testMissingOption('signUp', 'redirectUri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('signUp', 'state');
      });

      bdd.it('should redirect with action=signup and other expected query parameters', function () {
        return redirectAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirectUri: 'redirectUri'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, 'action=signup');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirectUri');
        });
      });
    });
  });
});


