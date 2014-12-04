/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/auth/lightbox/api',
  'client/auth/redirect/api'
], function (p, LightboxUI, RedirectUI) {
  'use strict';

  var UIs = {
    'default': RedirectUI,
    lightbox: LightboxUI,
    redirect: RedirectUI
  };

  function getUI(context, ui, clientId, options) {
    if (context._ui) {
      throw new Error('Firefox Accounts is already open');
    }

    if (typeof ui === 'object') {
      // allow a UI to be passed in for testing.
      context._ui = ui;
    } else {
      ui = ui || 'default';
      var UI = UIs[ui];

      if (! UI) {
        throw new Error('Invalid ui: ' + ui);
      }

      context._ui = new UI(clientId, options);
    }

    return context._ui;
  }


  /**
   * @class FxaRelierClient
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.fxaHost]
   *   Firefox Accounts Content Server host
   *   @param {Object} [options.window]
   *   window override, used for unit tests
   *   @param {Object} [options.lightbox]
   *   lightbox override, used for unit tests
   *   @param {Object} [options.channel]
   *   channel override, used for unit tests
   */
  function FxaRelierClient(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    this.auth = {
      /**
       * Sign in an existing user
       *
       * @method signIn
       * @param {Object} config - configuration
       *   @param {String} config.state
       *   CSRF/State token
       *   @param {String} config.redirect_uri
       *   URI to redirect to when complete
       *   @param {String} config.scope
       *   OAuth scope
       *   @param {String} [config.force_email]
       *   Force the user to sign in with the given email
       *   @param {String} [config.ui]
       *   UI to present - `lightbox` or `redirect` - defaults to `redirect`
       */
      signIn: function (config) {
        var self = this;
        return p().then(function () {
          config = config || {};

          var api = getUI(self, config.ui, clientId, options);
          return api.signIn(config)
            .fin(function () {
              delete self._ui;
            });
        });
      },

      /**
       * Sign up a new user
       *
       * @method signUp
       * @param {Object} config - configuration
       *   @param {String} config.state
       *   CSRF/State token
       *   @param {String} config.redirect_uri
       *   URI to redirect to when complete
       *   @param {String} config.scope
       *   OAuth scope
       *   @param {String} [config.ui]
       *   UI to present - `lightbox` or `redirect` - defaults to `redirect`
       */
      signUp: function (config) {
        var self = this;
        return p().then(function () {
          config = config || {};

          var api = getUI(self, config.ui, clientId, options);
          return api.signUp(config)
            .fin(function () {
              delete self._ui;
            });
        });
      }
    };
  }

  FxaRelierClient.prototype = {
    /**
     * FxaRelierClient version
     *
     * @property version
     * @type {String}
     */
    version: '0.0.0'
  };

  return FxaRelierClient;
});

