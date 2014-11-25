/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/url',
  './lightbox',
  './iframe_channel'
], function (p, Constants, Options, Url, Lightbox, IFrameChannel) {
  'use strict';

  function getLightboxSrc(host, page, clientId, state, scope,
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

  function getLightbox() {
    //jshint validthis: true
    var self = this;
    if (self._lightbox) {
      return self._lightbox;
    }

    self._lightbox = new Lightbox({
      window: self._window
    });

    return self._lightbox;
  }

  function openLightbox(page, config) {
    config = config || {};

    /*jshint validthis: true*/
    var self = this;
    return p().then(function() {
      if (self._lightbox && self._lightbox.isLoaded()) {
        throw new Error('lightbox already open');
      }

      var lightbox = getLightbox.call(self);

      var src = getLightboxSrc(self._fxaHost, page, self._clientId,
            config.state, config.scope, config.redirect_uri,
            config.force_email);
      lightbox.load(src);

      return lightbox;
    });
  }

  function getChannel(lightbox) {
    //jshint validthis: true
    var self = this;
    if (self._channel) {
      return self._channel;
    }

    self._channel = new IFrameChannel({
      iframeHost: self._fxaHost,
      contentWindow: lightbox.getContentWindow(),
      window: self._window
    });

    return self._channel;
  }

  function waitForAuthentication(lightbox) {
    /*jshint validthis: true*/
    var self = this;
    return p().then(function () {
      var channel = getChannel.call(self, lightbox);
      return channel.attach();
    });
  }

  function authenticate(page, config) {
    /*jshint validthis: true*/
    var self = this;

    return p().then(function () {
      var requiredOptions = ['scope', 'state', 'redirect_uri'];
      Options.checkRequired(requiredOptions, config);

      return openLightbox.call(self, page, config);
    })
    .then(function (lightbox) {
      return waitForAuthentication.call(self, lightbox);
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
   * @constructor
   */
  function LightboxAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }
    this._clientId = clientId;

    options = options || {};
    this._fxaHost = options.fxaHost || Constants.DEFAULT_FXA_HOST;
    this._window = options.window || window;
    this._lightbox = options.lightbox;
    this._channel = options.channel;
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
        self._channel.detach();
      });
    }
  };

  return LightboxAPI;
});

