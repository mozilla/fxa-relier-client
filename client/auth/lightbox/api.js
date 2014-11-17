/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  '../constants',
  './lightbox',
  './iframe_channel'
], function (p, Constants, Lightbox, IFrameChannel) {
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
    if (this._lightbox) {
      return p.reject(new Error('lightbox already open'));
    }

    this._lightbox = new Lightbox({
      src: getLightboxSrc(
        this._fxaHost, page, this._clientId,
          options.state, options.scope, options.redirect_uri, options.redirectTo),
      window: this._window
    });
    this._lightbox.load();

    this._iframeChannel = new IFrameChannel({
      iframeHost: this._fxaHost,
      contentWindow: this._lightbox.getContentWindow(),
      window: this._window
    });

    var self = this;
    return this._iframeChannel.attach()
      .then(function (result) {
        self.unload();
        return result;
      }, function (err) {
        self.unload();
        throw err;
      });
  }

  function LightboxAPI(options) {
    options = options || {};

    this._fxaHost = options.fxaHost || Constants.DEFAULT_FXA_HOST;
    this._window = options.window || window;
    this._clientId = options.clientId;
  }

  LightboxAPI.prototype = {
    signIn: function (options) {
      return openLightbox.call(this, Constants.SIGNIN_ENDPOINT, options);
    },

    signUp: function (options) {
      return openLightbox.call(this, Constants.SIGNUP_ENDPOINT, options);
    },

    unload: function () {
      if (! this._lightbox) {
        throw new Error('lightbox not open');
      }

      this._lightbox.unload();
      delete this._lightbox;

      this._iframeChannel.detach();
      delete this._iframeChannel;
    }
  };

  return LightboxAPI;
});

