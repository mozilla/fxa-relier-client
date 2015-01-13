/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise',
  'client/lib/object',
  'client/lib/options',
  '../api',
  './lightbox',
  './iframe_channel'
], function (p, ObjectHelpers, Options, AuthenticationAPI, Lightbox, IFrameChannel) {
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
   */
  function LightboxAPI(clientId, options) {
    AuthenticationAPI.call(this, clientId, options);

    options = options || {};
    this._lightbox = options.lightbox;
    this._channel = options.channel;
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

