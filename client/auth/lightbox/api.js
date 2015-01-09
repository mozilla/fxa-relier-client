/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/object',
  'client/lib/options',
  'client/lib/constants',
  '../base/api',
  './lightbox',
  './iframe_channel'
], function (p, ObjectHelpers, Options, Constants, AuthenticationAPI,
    Lightbox, IFrameChannel) {
  'use strict';

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

  function openLightbox(fxaUrl) {
    /*jshint validthis: true*/
    var self = this;
    return p().then(function() {
      if (self._lightbox && self._lightbox.isLoaded()) {
        throw new Error('lightbox already open');
      }

      var lightbox = getLightbox.call(self);

      lightbox.load(fxaUrl);

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
      iframeHost: self._contentHost,
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

  /**
   * Authenticate users with a lightbox
   *
   * @class LightboxAPI
   * @extends AuthenticationAPI
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
  function LightboxAPI(clientId, options) {
    options = options || {};

    AuthenticationAPI.call(this, clientId, options);

    this._lightbox = options.lightbox;
    this._channel = options.channel;
    this._contentHost = options.contentHost || Constants.DEFAULT_CONTENT_HOST;
  }
  LightboxAPI.prototype = Object.create(AuthenticationAPI.prototype);

  ObjectHelpers.extend(LightboxAPI.prototype, {
    openFxa: function (fxaUrl) {
      /*jshint validthis: true*/
      var self = this;

      return openLightbox.call(self, fxaUrl)
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
  });

  return LightboxAPI;
});

