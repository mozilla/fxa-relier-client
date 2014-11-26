/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'client/lib/constants',
  'client/lib/options',
  'client/lib/url'
], function (Constants, Options, Url) {

  function getFxaUrl(host, page, clientId, state, scope,
      redirectUri, email) {
    var queryParams = {
      client_id: clientId,
      state: state,
      scope: scope,
      redirect_uri: redirectUri
    };

    if (email) {
      queryParams.email = email;
    }

    return host + '/' + page + Url.objectToQueryString(queryParams);
  }

  function authenticate(page, config) {
    var requiredOptions = ['scope', 'state', 'redirect_uri'];
    Options.checkRequired(requiredOptions, config);

    var self = this;
    var fxaUrl = getFxaUrl(self._fxaHost, page, self._clientId,
          config.state, config.scope, config.redirect_uri,
          config.force_email);


    this._window.location.href = fxaUrl;
  }

  /**
   * Authenticate a user with the redirect flow.
   *
   * @class RedirectAPI
   * @constructor
   */
  function RedirectAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }
    this._clientId = clientId;

    options = options || {};
    this._fxaHost = options.fxaHost || Constants.DEFAULT_FXA_HOST;
    this._window = options.window || window;
  }

  RedirectAPI.prototype = {
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
     */
    signUp: function (config) {
      return authenticate.call(this, Constants.SIGNUP_ENDPOINT, config);
    }
  };

  return RedirectAPI;
});

