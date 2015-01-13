/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/url'
], function (p, Constants, Options, Url) {
  'use strict';

  /**
   * @class AuthenticationAPI
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.contentHost]
   *   Firefox Accounts Content Server host
   *   @param {String} [options.oauthHost]
   *   Firefox Accounts OAuth Server host
   *   @param {Object} [options.window]
   *   window override, used for unit tests
   *   @param {Object} [options.lightbox]
   *   lightbox override, used for unit tests
   *   @param {Object} [options.channel]
   *   channel override, used for unit tests
   */
  function AuthenticationAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    this._clientId = clientId;
    this._contentHost = options.contentHost || Constants.DEFAULT_CONTENT_HOST;
    this._oauthHost = options.oauthHost || Constants.DEFAULT_OAUTH_HOST;
    this._window = options.window || window;
  }

  function authenticate(action, config) {
    //jshint validthis: true
    var self = this;
    return p().then(function () {
      var requiredOptions = ['scope', 'state', 'redirect_uri'];
      Options.checkRequired(requiredOptions, config);

      var fxaUrl = getFxaUrl.call(self, action, config);
      return self.openFxa(fxaUrl);
    });
  }

  function getFxaUrl(action, config) {
    //jshint validthis: true
    var queryParams = {
      action: action,
      client_id: this._clientId,
      state: config.state,
      scope: config.scope,
      redirect_uri: config.redirect_uri
    };

    if (config.email) {
      queryParams.email = config.email;
    }

    return this._oauthHost + Url.objectToQueryString(queryParams);
  }

  AuthenticationAPI.prototype = {
    /**
     * Open Firefox Accounts to authenticate the user.
     * Must be overridden to provide API specific functionality.
     *
     * @method openFxa
     * @param {String} fxaUrl - URL to open for authentication
     *
     * @protected
     */
    openFxa: function (fxaUrl) {
      throw new Error('openFxa must be overridden');
    },

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
     *   @param {String} [config.email]
     *   Email address used to pre-fill into the account form,
     *   but the user is free to change it. Set to the string literal
     *   `blank` to ignore any previously signed in email. Default is
     *   the last email address used to sign in.
     */
    signIn: function (config) {
      config = config || {};
      return authenticate.call(this, Constants.SIGNIN_ACTION, config);
    },

    /**
     * Force a user to sign in as an existing user.
     *
     * @method forceAuth
     * @param {Object} config - configuration
     *   @param {String} config.state
     *   CSRF/State token
     *   @param {String} config.redirect_uri
     *   URI to redirect to when complete
     *   @param {String} config.scope
     *   OAuth scope
     *   @param {String} config.email
     *   Email address the user must sign in with. The user
     *   is unable to modify the email address and is unable
     *   to sign up if the address is not registered.
     *   @param {String} [config.ui]
     *   UI to present - `lightbox` or `redirect` - defaults to `redirect`
     */
    forceAuth: function (config) {
      var self = this;
      return p().then(function () {
        config = config || {};
        var requiredOptions = ['email'];
        Options.checkRequired(requiredOptions, config);

        return authenticate.call(self, Constants.FORCE_AUTH_ACTION, config);
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
     *   @param {String} [config.email]
     *   Email address used to pre-fill into the account form,
     *   but the user is free to change it.
     */
    signUp: function (config) {
      return authenticate.call(this, Constants.SIGNUP_ACTION, config);
    },
  };

  return AuthenticationAPI;
});


