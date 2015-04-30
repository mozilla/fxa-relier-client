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
  './iframe_channel'
], function (p, ObjectHelpers, Options, Constants, BaseBroker,
    IFrameChannel) {
  'use strict';

  function openIFrame
  function getChannel(iframe) {
    //jshint validthis: true
    var self = this;
    if (self._channel) {
      return self._channel;
    }

    self._channel = new IFrameChannel({
      iframeHost: self._contentHost,
      contentWindow: iframe.getContentWindow(),
      window: self._window
    });

    return self._channel;
  }

  function waitForAuthentication(iframe) {
    /*jshint validthis: true*/
    var self = this;
    return p().then(function () {
      var channel = getChannel.call(self, iframe);
      return channel.attach();
    });
  }

  /**
   * Authenticate users with a iframe
   *
   * @class IFrameBroker
   * @extends BaseBroker
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.contentHost]
   *   Firefox Accounts Content Server host
   *   @param {String} [options.oauthHost]
   *   Firefox Accounts OAuth Server host
   *   @param {Object} [options.window]
   *   window override, used for unit tests
   *   @param {Object} [options.channel]
   *   channel override, used for unit tests
   */
  function IFrameBroker(clientId, options) {
    options = options || {};

    BaseBroker.call(this, clientId, options);

    this._channel = options.channel;
    this._contentHost = options.contentHost || Constants.DEFAULT_CONTENT_HOST;
    this._target = options.target;
    this.setContext('iframe');
  }
  IFrameBroker.prototype = Object.create(BaseBroker.prototype);

  ObjectHelpers.extend(IFrameBroker.prototype, {
    openFxa: function (fxaUrl, options) {
      /*jshint validthis: true*/
      var self = this;

      return openIFrame.call(self, fxaUrl, options)
        .then(function (iframe) {
          return waitForAuthentication.call(self, iframe);
        })
        .then(function (result) {
          self.stopListening();
          return result;
        }, function (err) {
          self.stopListening();
          throw err;
        });
    },

    /**
     * Stop listening for messages from the iframe
     * @method stopListening
     */
    stopListening: function () {
      var self = this;
      return p().then(function () {
        self._channel.detach();
      });
    },

    /**
     * Unload the iframe from the DOM, stop listening for messages.
     * @method unload
     */
    unload: function () {
    }
  });

  return IFrameBroker;
});

