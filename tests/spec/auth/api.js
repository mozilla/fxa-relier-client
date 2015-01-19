/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global define*/

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/sinon',
  'client/FxaRelierClient',
  'client/auth/lightbox/api',
  'tests/mocks/window',
  'p-promise'
], function (bdd, assert, sinon, FxaRelierClient, LightboxBroker, WindowMock, p) {
  'use strict';

  bdd.describe('AuthAPI', function () {
    bdd.describe('signIn', function () {
      var config;
      var ui;
      var windowMock;
      var client;

      bdd.beforeEach(function () {
        windowMock = new WindowMock();
        ui = new LightboxBroker('client_id', {
          window: windowMock
        });
        config = {
          ui: ui,
          state: 'state',
          redirectUri: 'http://redirect.to.me',
          scope: 'profiles'
        };
        client = new FxaRelierClient('client_id', {
          window: windowMock
        });
      });

      bdd.it('creates and loads a UI', function () {
        sinon.stub(ui, 'signIn', function () {
          return p();
        });

        return client.auth.signIn(config);
      });

      bdd.it('throws when re-opening FxA if already open', function () {
        var client = new FxaRelierClient('client_id', {
          window: new WindowMock()
        });

        sinon.stub(ui, 'signIn', function () {
          // prevent the first window from completing
          return p.defer().promise;
        });

        client.auth.signIn(config);
        return client.auth.signIn(config)
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'Firefox Accounts is already open');
          });
      });

      bdd.it('does not throw if re-opening FxA after first transaction completes', function () {
        sinon.stub(ui, 'signIn', function () {
          return p();
        });

        return client.auth.signIn(config)
          .then(function () {
            return client.auth.signIn(config);
          });
      });
    });

    bdd.describe('forceAuth', function () {
      var configWithoutEmail;
      var configWithEmail;
      var ui;
      var windowMock;
      var client;

      bdd.beforeEach(function () {
        windowMock = new WindowMock();
        ui = new LightboxBroker('client_id', {
          window: windowMock
        });
        configWithoutEmail = {
          ui: ui,
          state: 'state',
          redirectUri: 'http://redirect.to.me',
          scope: 'profiles'
        };
        configWithEmail = {
          ui: ui,
          state: 'state',
          redirectUri: 'http://redirect.to.me',
          scope: 'profiles',
          email: 'testuser@testuser.com'
        };
        client = new FxaRelierClient('client_id', {
          window: windowMock
        });
      });

      bdd.it('creates and loads a UI', function () {
        sinon.stub(ui, 'forceAuth', function () {
          return p();
        });

        return client.auth.forceAuth(configWithEmail);
      });

      bdd.it('throws when re-opening FxA if already open', function () {
        sinon.stub(ui, 'forceAuth', function () {
          // prevent the first window from completing
          return p.defer().promise;
        });

        client.auth.forceAuth(configWithEmail);
        return client.auth.forceAuth(configWithEmail)
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'Firefox Accounts is already open');
          });
      });

      bdd.it('does not throw if re-opening FxA after first transaction completes', function () {
        sinon.stub(ui, 'forceAuth', function () {
          return p();
        });

        return client.auth.forceAuth(configWithEmail)
          .then(function () {
            return client.auth.forceAuth(configWithEmail);
          });
      });
    });

    bdd.describe('signUp', function () {
      var config;
      var ui;
      var windowMock;
      var client;

      bdd.beforeEach(function () {
        windowMock = new WindowMock();
        ui = new LightboxBroker('client_id', {
          window: windowMock
        });
        config = {
          ui: ui,
          state: 'state',
          redirectUri: 'http://redirect.to.me',
          scope: 'profiles'
        };

        client = new FxaRelierClient('client_id', {
          window: windowMock
        });
      });

      bdd.it('creates and loads a UI', function () {
        sinon.stub(ui, 'signUp', function () {
          return p();
        });

        return client.auth.signUp(config);
      });

      bdd.it('throws when re-opening FxA if already open', function () {
        sinon.stub(ui, 'signUp', function () {
          // prevent the first window from completing
          return p.defer().promise;
        });

        client.auth.signUp(config);
        return client.auth.signUp(config)
          .then(assert.fail, function (err) {
            assert.equal(err.message, 'Firefox Accounts is already open');
          });
      });

      bdd.it('does not throw if re-opening FxA after first transaction completes', function () {
        sinon.stub(ui, 'signUp', function () {
          return p();
        });

        return client.auth.signUp(config)
          .then(function () {
            return client.auth.signUp(config);
          });
      });
    });
  });
});


