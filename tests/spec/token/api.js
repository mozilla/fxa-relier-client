/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/responder',
  'client/token/api',
  'client/lib/constants'
], function (bdd, assert, Responder, TokenAPI, Constants) {
  'use strict';

  bdd.describe('TokenAPI', function () {
    var api;
    var responder;

    bdd.beforeEach(function () {
      api = new TokenAPI('client_id', {});
      responder = new Responder();
    });

    bdd.afterEach(function () {
      responder.restore();
    });

    bdd.describe('tradeCode', function () {
      bdd.it('trades a valid OAuth code for an OAuth token', function () {
        var endpoint = Constants.DEFAULT_OAUTH_HOST + '/token';
        var mockXHR = responder.respondWith('POST', endpoint, {
          body: JSON.stringify({
            access_token: 'token',
            scope: 'scope',
            token_type: 'bearer'
          })
        });

        return api.tradeCode('secret', 'code', {
          xhr: mockXHR
        })
        .then(function (resp) {
          assert.equal(resp.access_token, 'token');
          assert.equal(resp.scope, 'scope');
          assert.equal(resp.token_type, 'bearer');

          var reqBody = JSON.parse(mockXHR.requestBody);
          assert.equal(reqBody.client_id, 'client_id');
          assert.equal(reqBody.client_secret, 'secret');
          assert.equal(reqBody.code, 'code');
        });
      });
    });

    bdd.describe('verifyToken', function () {
      bdd.it('resolves with token info if token is valid', function () {
        var endpoint = Constants.DEFAULT_OAUTH_HOST + '/verify';
        var mockXHR = responder.respondWith('POST', endpoint, {
          body: JSON.stringify({
            user: 'uid',
            client_id: 'client_id',
            scopes: ['profile:email', 'profile:avatar']
          })
        });

        return api.verifyToken('token', {
          xhr: mockXHR
        })
        .then(function (resp) {
          assert.equal(resp.user, 'uid');
          assert.equal(resp.client_id, 'client_id');
          assert.equal(resp.scopes[0], 'profile:email');
          assert.equal(resp.scopes[1], 'profile:avatar');

          var reqBody = JSON.parse(mockXHR.requestBody);
          assert.equal(reqBody.token, 'token');
        });
      });
    });

    bdd.describe('destroyToken', function () {
      bdd.it('resolves with empty object if token is valid', function () {
        var endpoint = Constants.DEFAULT_OAUTH_HOST + '/destroy';

        var mockXHR = responder.respondWith('POST', endpoint, {
          body: JSON.stringify({})
        });

        return api.destroyToken('secret', 'token', {
          xhr: mockXHR
        })
        .then(function (resp) {
          assert.ok(resp);

          var reqBody = JSON.parse(mockXHR.requestBody);
          assert.equal(reqBody.client_secret, 'secret');
          assert.equal(reqBody.token, 'token');
        });
      });
    });
  });
});

