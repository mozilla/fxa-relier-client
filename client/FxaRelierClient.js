/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * The Firefox Accounts Relier Client.
 *
 * @module FxaRelierClient
 */


define([
  'client/auth/api',
  'client/token/api',
  'client/profile/api',
  'client/notifications/api'
], function (AuthAPI, TokenAPI, ProfileAPI, NotificationsAPI) {
  'use strict';

  /**
   * The entry point. Create and use an instance of the FxaRelierClient.
   *
   * @class FxaRelierClient (start here)
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.clientSecret]
   *   Client secret. Required to use the {{#crossLink "TokenAPI"}}Token{{/crossLink}} API.
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
   * @example
   *     var fxaRelierClient = new FxaRelierClient(<client_id>);
   */
  function FxaRelierClient(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    /**
     * Authenticate users in the browser. Implements {{#crossLink "AuthAPI"}}{{/crossLink}}.
     * @property auth
     * @type {Object}
     *
     * @example
     *     var fxaRelierClient = new FxaRelierClient('<client_id>');
     *     fxaRelierClient.auth.signIn({
     *       state: <state>,
     *       redirectUri: <redirect_uri>,
     *       scope: 'profile'
     *     });
     */
    this.auth = new AuthAPI(clientId, options);

    /**
     * Manage tokens on the server. Implements {{#crossLink "TokenAPI"}}{{/crossLink}}.
     * @property token
     * @type {Object}
     *
     * @example
     *     var fxaRelierClient = new FxaRelierClient('<client_id>', {
     *       clientSecret: <client_secret>
     *     });
     *     fxaRelierClient.token.tradeCode(<code>)
     *       .then(function (token) {
     *         // do something awesome with the token like get
     *         // profile information. See profile.
     *       });
     */
    this.token = new TokenAPI(clientId, options);

    /**
     * Fetch profile information on the server. Implements {{#crossLink "ProfileAPI"}}{{/crossLink}}.
     * @property profile
     * @type {Object}
     *
     * @example
     *     var fxaRelierClient = new FxaRelierClient('<client_id>', {
     *       clientSecret: <client_secret>
     *     });
     *     fxaRelierClient.token.tradeCode(<code>)
     *       .then(function (token) {
     *         return fxaRelierClient.profile.fetch(token);
     *       })
     *       .then(function (profile) {
     *         // display some profile info.
     *       });
     */
    this.profile = new ProfileAPI(clientId, options);

    /**
     * Fetch notification events from the server. Implements {{#crossLink "NotificationsAPI"}}{{/crossLink}}.
     * @property notifications
     * @type {Object}
     *
     * @example
     *     var fxaRelierClient = new FxaRelierClient('<client_id>', {
     *       clientSecret: <client_secret>
     *     });
     *     fxaRelierClient.token.tradeCode(<code>)
     *       .then(function (token) {
     *         return fxaRelierClient.notifications.events(token);
     *       })
     *       .then(function (events) {
     *         // do something to handle the events.
     *       });
     */
    this.notifications = new NotificationsAPI(options);
  }

  FxaRelierClient.prototype = {
    auth: null
  };

  return FxaRelierClient;
});

