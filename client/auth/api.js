/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'promise',
  'client/lib/function',
  'client/auth/lightbox/api',
  'client/auth/redirect/api'
], function (promise, FunctionHelpers, LightboxBroker, RedirectBroker) {
  'use strict';

  var partial = FunctionHelpers.partial;
  var Promise = promise.Promise;

  var Brokers = {
    'default': RedirectBroker,
    lightbox: LightboxBroker,
    redirect: RedirectBroker
  };

  function getBroker(context, ui, clientId, options) {
    if (context._broker) {
      throw new Error('Firefox Accounts is already open');
    }

    if (typeof ui === 'object') {
      // allow a Broker to be passed in for testing.
      context._broker = ui;
    } else {
      ui = ui || 'default';
      var Broker = Brokers[ui];

      if (! Broker) {
        throw new Error('Invalid ui: ' + ui);
      }

      context._broker = new Broker(clientId, options);
    }

    return context._broker;
  }

  function authenticate(authType, config) {
    var self = this;
    return Promise.resolve().then(function () {
      config = config || {};

      var done = function done () {
        delete self._broker;
      };

      var api = getBroker(self, config.ui, self._clientId, self._options);
      return api[authType](config)
        .then(done, done);
    });
  }


  /**
   * @class AuthAPI
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
  function AuthAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }

    this._clientId = clientId;
    this._options = options;
  }

  AuthAPI.prototype = {
    /**
     * Sign in an existing user.
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
     *   @param {String} [config.ui="redirect"]
     *   UI to present - `lightbox` or `redirect`
     *   @param {Number} [config.zIndex=100]
     *   only used when `config.ui=lightbox`. The zIndex of the lightbox background.
     *   @param {String} [config.background=rgba(0,0,0,0.5)]
     *   only used when `config.ui=lightbox`. The `background` CSS value
     */
    signIn: partial(authenticate, 'signIn'),

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
     *   @param {String} [config.ui="redirect"]
     *   UI to present - `lightbox` or `redirect`
     *   @param {Number} [config.zIndex=100]
     *   only used when `config.ui=lightbox`. The zIndex of the lightbox background.
     *   @param {String} [config.background=rgba(0,0,0,0.5)]
     *   only used when `config.ui=lightbox`. The `background` CSS value
     */
    forceAuth: partial(authenticate, 'forceAuth'),

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
     *   @param {String} [config.ui="redirect"]
     *   UI to present - `lightbox` or `redirect`
     *   @param {Number} [config.zIndex=100]
     *   only used when `config.ui=lightbox`. The zIndex of the lightbox background.
     *   @param {String} [config.background=rgba(0,0,0,0.5)]
     *   only used when `config.ui=lightbox`. The `background` CSS value
     */
    signUp: partial(authenticate, 'signUp'),

    /**
     * Best choice auth strategy, has no action set.
     * This strategy creates an oauth url to the "/oauth" endpoint on the content server.
     * The oauth url has no action and the content server choose the auth flow.
     *
     * @method bestChoice
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
     *   @param {String} [config.ui="redirect"]
     *   UI to present - `lightbox` or `redirect`
     *   @param {Number} [config.zIndex=100]
     *   only used when `config.ui=lightbox`. The zIndex of the lightbox background.
     *   @param {String} [config.background=rgba(0,0,0,0.5)]
     *   only used when `config.ui=lightbox`. The `background` CSS value
     */
    bestChoice: partial(authenticate, 'bestChoice')
  };

  return AuthAPI;
});


