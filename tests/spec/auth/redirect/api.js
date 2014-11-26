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
function (bdd, assert, RedirectAPI, WindowMock, sinon, p) {
  'use strict';

  bdd.describe('auth/redirect/api', function () {

    var windowMock;
    var redirectAPI;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      redirectAPI = new RedirectAPI('client_id', {
        window: windowMock
      });
    });

    bdd.afterEach(function () {
    });

    function testMissingOption(endpoint, optionName) {
      var options = {
        state: 'state',
        scope: 'scope',
        redirect_uri: 'redirect_uri'
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

      bdd.it('should reject if `redirect_uri` is not specified', function () {
        return testMissingOption('signIn', 'redirect_uri');
      });

      bdd.it('should reject if `state` is not specified', function () {
        return testMissingOption('signIn', 'state');
      });

      bdd.it('should redirect to the /signin page with the expected query parameters', function () {
        return redirectAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, '/signin');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirect_uri');
        });
      });

      bdd.it('should redirect to the /force_auth page with the expected query parameters if the RP forces authentication as a user', function () {
        return redirectAPI.signIn({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri',
          force_email: 'testuser@testuser.com'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, '/force_auth');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirect_uri');
          assert.include(redirectedTo, 'email=testuser%40testuser.com');
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

      bdd.it('should redirect to the /signup page with the expected query parameters', function () {
        return redirectAPI.signUp({
          state: 'state',
          scope: 'scope',
          redirect_uri: 'redirect_uri'
        })
        .then(function () {
          var redirectedTo = windowMock.location.href;
          assert.include(redirectedTo, '/signup');
          assert.include(redirectedTo, 'state=state');
          assert.include(redirectedTo, 'scope=scope');
          assert.include(redirectedTo, 'redirect_uri=redirect_uri');
        });
      });
    });
  });
});


