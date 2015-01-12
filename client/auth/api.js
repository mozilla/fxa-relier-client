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

  function AuthenticationAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    this._clientId = clientId;
    this._fxaHost = options.fxaHost || Constants.DEFAULT_FXA_HOST;
    this._window = options.window || window;
  }

  function authenticate(page, config) {
    //jshint validthis: true
    var self = this;
    return p().then(function () {
      var requiredOptions = ['scope', 'state', 'redirect_uri'];
      Options.checkRequired(requiredOptions, config);

      var fxaUrl = getFxaUrl.call(self, page, config);
      return self.openFxa(fxaUrl);
    });
  }

  function getFxaUrl(page, config) {
    //jshint validthis: true
    var queryParams = {
      client_id: this._clientId,
      state: config.state,
      scope: config.scope,
      redirect_uri: config.redirect_uri
    };

    if (config.email) {
      queryParams.email = config.email;
    }

    if (config.force_email) {
      queryParams.email = config.force_email;
    }

    return this._fxaHost + '/' + page + Url.objectToQueryString(queryParams);
  }

  AuthenticationAPI.prototype = {
    /**
     * Open Firefox Accounts to authenticate the user.
     * Must be overridden to provide API specific functionality.
     *
     * @method openFxa
     * @param {String} fxaUrl - URL to open for authentication
     *
     * @virtual
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
     *   @param {String} [config.force_email]
     *   Force the user to sign in with the given email
     */
    signIn: function (config) {
      config = config || {};
      var page = config.force_email ?
                   Constants.FORCE_EMAIL_ENDPOINT :
                   Constants.SIGNIN_ENDPOINT;
      return authenticate.call(this, page, config);
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
      return authenticate.call(this, Constants.SIGNUP_ENDPOINT, config);
    },
  };

  return AuthenticationAPI;
});


