/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/xhr'
], function (p, Constants, Xhr) {
  'use strict';

  /**
   * @class TokenAPI
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.clientSecret]
   *   Client secret
   *   @param {String} [options.oauthHost]
   *   Firefox Accounts OAuth Server host
   */
  function TokenAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }
    this._clientId = clientId;

    options = options || {};
    this._clientSecret = options.clientSecret;
    this._oauthHost = options.oauthHost || Constants.DEFAULT_OAUTH_HOST;
  }

  TokenAPI.prototype = {
    /**
     * Trade an OAuth code for a longer lived OAuth token. See
     * https://github.com/mozilla/fxa-oauth-server/blob/master/docs/api.md#post-v1token
     *
     * @method tradeCode
     * @param {String} code
     * OAuth code
     * @returns {String}
     * OAuth token
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to an object with `access_token`, `scope`, and
     * `token_type`.
     */
    tradeCode: function (code, options) {
      if (! this._clientSecret) {
        return p.reject(new Error('clientSecret is required'));
      }

      if (! code) {
        return p.reject(new Error('code is required'));
      }

      var endpoint = this._oauthHost + '/token';
      return Xhr.post(endpoint, {
          client_id: this._clientId,
          client_secret: this._clientSecret,
          code: code
        }, options);
    },

    /**
     * Verify an OAuth token is valid. See
     * https://github.com/mozilla/fxa-oauth-server/blob/master/docs/api.md#post-v1verify
     *
     * @method verifyToken
     * @param {String} token
     * OAuth token to verify
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to an object with `user`, `client_id`, and
     * `scopes`.
     */
    verifyToken: function (token, options) {
      if (! token) {
        return p.reject(new Error('token is required'));
      }

      var endpoint = this._oauthHost + '/verify';
      return Xhr.post(endpoint, {
          token: token
        }, options);
    },

    /**
     * After a client is done using a token, the responsible thing to do is to
     * destroy the token afterwards.
     * See https://github.com/mozilla/fxa-oauth-server/blob/master/docs/api.md#post-v1destroy
     *
     * @method destroyToken
     * @param {String} token
     * OAuth token to verify
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to an empty object.
     */
    destroyToken: function (token, options) {
      if (! this._clientSecret) {
        return p.reject(new Error('clientSecret is required'));
      }

      if (! token) {
        return p.reject(new Error('token is required'));
      }

      var endpoint = this._oauthHost + '/destroy';
      return Xhr.post(endpoint, {
        client_secret: this._clientSecret,
        token: token
      }, options);
    }
  };

  return TokenAPI;
});


