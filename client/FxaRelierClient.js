/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/auth/lightbox/api',
  'client/auth/redirect/api'
], function (p, LightboxAPI, RedirectAPI, Options) {
  'use strict';

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
       * Authenticate a user using the lightbox
       *
       * @property auth.lightbox
       * @type {LightboxAPI}
       */
      lightbox: new LightboxAPI(clientId, options),

      /**
       * Authenticate a user using the redirect flow
       *
       * @property auth.redirect
       * @type {RedirectAPI}
       */
      redirect: new RedirectAPI(clientId, options)
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

