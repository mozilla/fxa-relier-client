/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'client/auth/api',
  'client/token/api',
  'client/profile/api'
], function (AuthAPI, TokenAPI, ProfileAPI) {
  'use strict';

  /**
   * @class FxaRelierClient
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.contentHost]
   *   Firefox Accounts Content Server host
   *   @param {String} [options.oauthHost]
   *   Firefox Accounts OAuth Server host
   *   @param {String} [options.profileHost]
   *   Firefox Accounts Profile Server host
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

    this.auth = new AuthAPI(clientId, options);
    this.token = new TokenAPI(clientId, options);
    this.profile = new ProfileAPI(clientId, options);
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

