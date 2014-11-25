/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/options',
  './lightbox',
  './iframe_channel'
], function (p, Constants, Options, Lightbox, IFrameChannel) {
  'use strict';

  function createQueryParam(key, value) {
    return key + '=' + encodeURIComponent(value);
  }

  function getLightboxSrc(host, page, clientId, state, scope, redirectUri, redirectTo) {
    var src = host + '/' + page + '?';
    var queryParams = [];

    queryParams.push(createQueryParam('client_id', clientId));
    queryParams.push(createQueryParam('state', state));
    queryParams.push(createQueryParam('scope', scope));
    queryParams.push(createQueryParam('redirect_uri', redirectUri));

    src += queryParams.join('&');
    return src;
  }

  function openLightbox(page, options) {
    options = options || {};

    /*jshint validthis: true*/
    var self = this;
    return p().then(function() {
      if (self._lightbox) {
        throw new Error('lightbox already open');
      }

      var requiredOptions = ['scope', 'state', 'redirect_uri'];
      Options.checkRequired(requiredOptions, options);

      self._lightbox = new Lightbox({
        window: self._window
      });

      var src = getLightboxSrc(self._fxaHost, page, self._clientId,
            options.state, options.scope, options.redirect_uri,
            options.redirectTo);
      self._lightbox.load(src);

      self._iframeChannel = new IFrameChannel({
        iframeHost: self._fxaHost,
        contentWindow: self._lightbox.getContentWindow(),
        window: self._window
      });

      return self._iframeChannel.attach();
    })
    .then(function (result) {
      self.unload();
      return result;
    }, function (err) {
      self.unload();
      throw err;
    });
  }

  /**
   * Authenticate users with a lightbox
   *
   * @class LightboxAPI
   */
  function LightboxAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }
    this._clientId = clientId;

    options = options || {};
    this._fxaHost = options.fxaHost || Constants.DEFAULT_FXA_HOST;
    this._window = options.window || window;
  }

  LightboxAPI.prototype = {
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
     */
    signIn: function (config) {
      return openLightbox.call(this, Constants.SIGNIN_ENDPOINT, config);
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
      return openLightbox.call(this, Constants.SIGNUP_ENDPOINT, config);
    },

    /**
     * Unload the lightbox
     *
     * @method unload
     */
    unload: function () {
      var self = this;
      return p().then(function () {
        if (! self._lightbox) {
          throw new Error('lightbox not open');
        }

        self._lightbox.unload();
        delete self._lightbox;

        self._iframeChannel.detach();
        delete self._iframeChannel;
      });
    }
  };

  return LightboxAPI;
});

