/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/responder',
  'client/profile/api',
  'client/lib/constants',
], function (bdd, assert, Responder, ProfileAPI, Constants) {
  'use strict';

  bdd.describe('ProfileAPI', function () {
    var api;
    var responder;

    bdd.beforeEach(function () {
      api = new ProfileAPI('client_id', {});
      responder = new Responder();
    });

    bdd.afterEach(function () {
      responder.restore();
    });

    bdd.describe('fetch', function () {
      bdd.it('sends token to server in `Bearer` header', function () {
        var email = 'testuser1@testuser.com';

        var endpoint = Constants.DEFAULT_PROFILE_HOST + '/profile';
        var mockXHR = responder.respondWith('GET', endpoint, {
          body: JSON.stringify({
            email: email
          })
        });

        return api.fetch('token', { xhr: mockXHR })
          .then(function (profile) {

            assert.equal(
                mockXHR.requestHeaders.Authorization, 'Bearer token');

            assert.equal(profile.email, email);
          });
      });
    });

    bdd.describe('all', function () {
      bdd.it('retrieves all properties of a profile', function () {
        var email = 'testuser1@testuser.com';

        var endpoint = Constants.DEFAULT_PROFILE_HOST + '/profile';
        var mockXHR = responder.respondWith('GET', endpoint, {
          body: JSON.stringify({
            email: email
          })
        });

        return api.fetch('token', { xhr: mockXHR })
          .then(function () {
            return api.all();
          })
          .then(function (profile) {
            assert.equal(profile.email, email);
          });
      });
    });
  });
});

