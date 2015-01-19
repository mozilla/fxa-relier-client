/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/function',
  'client/lib/url'
], function (p, Constants, Options, FunctionHelpers, Url) {
  'use strict';

  var partial = FunctionHelpers.partial;

  /**
   * The base class for other brokers. Subclasses must override
   * `openFxa`. Provides a strategy to authenticate a user.
   *
   * @class BaseBroker
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.oauthHost]
   *   Firefox Accounts OAuth Server host
   *   @param {Object} [options.window]
   *   window override, used for unit tests
   *   @param {Object} [options.lightbox]
   *   lightbox override, used for unit tests
   *   @param {Object} [options.channel]
   *   channel override, used for unit tests
   */
  function BaseBroker(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    this._clientId = clientId;
    this._oauthHost = options.oauthHost || Constants.DEFAULT_OAUTH_HOST;
    this._window = options.window || window;
  }

  function authenticate(action, config) {
    //jshint validthis: true
    var self = this;
    config = config || {};
    return p().then(function () {
      var requiredOptions = ['scope', 'state', 'redirectUri'];
      Options.checkRequired(requiredOptions, config);

      var fxaUrl = getOAuthUrl.call(self, action, config);
      return self.openFxa(fxaUrl);
    });
  }

  function getOAuthUrl(action, config) {
    //jshint validthis: true
    var queryParams = {
      action: action,
      client_id: this._clientId,
      state: config.state,
      scope: config.scope,
      redirect_uri: config.redirectUri
    };

    if (config.email) {
      queryParams.email = config.email;
    }

    return this._oauthHost + '/authorization' + Url.objectToQueryString(queryParams);
  }

  BaseBroker.prototype = {
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
     *   @param {String} config.redirectUri
     *   URI to redirect to when complete
     *   @param {String} config.scope
     *   OAuth scope
     *   @param {String} [config.email]
     *   Email address used to pre-fill into the account form,
     *   but the user is free to change it. Set to the string literal
     *   `blank` to ignore any previously signed in email. Default is
     *   the last email address used to sign in.
     */
    signIn: partial(authenticate, Constants.SIGNIN_ACTION),

    /**
     * Force a user to sign in as an existing user.
     *
     * @method forceAuth
     * @param {Object} config - configuration
     *   @param {String} config.state
     *   CSRF/State token
     *   @param {String} config.redirectUri
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
     *   @param {String} config.redirectUri
     *   URI to redirect to when complete
     *   @param {String} config.scope
     *   OAuth scope
     *   @param {String} [config.email]
     *   Email address used to pre-fill into the account form,
     *   but the user is free to change it.
     */
    signUp: partial(authenticate, Constants.SIGNUP_ACTION)
  };

  return BaseBroker;
});


