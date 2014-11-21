/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/lib/function',
  'client/lib/object',
  'client/lib/events'
], function (p, FunctionHelpers, ObjectHelpers, Events) {
  'use strict';

  function IFrameChannel(options) {
    options = options || {};

    this._window = options.window;
    this._contentWindow = options.contentWindow;
    this._iframeHost = options.iframeHost;
  }

  IFrameChannel.prototype = {
    version: '0.0.0',

    attach: function () {
      this._boundOnMessage = FunctionHelpers.bind(onMessage, this);
      Events.addEventListener(this._window, 'message', this._boundOnMessage);

      this._deferred = p.defer();
      return this._deferred.promise;
    },

    detach: function () {
      Events.removeEventListener(this._window, 'message', this._boundOnMessage);
    },

    send: function (command, data) {
      var dataToSend = ObjectHelpers.extend({ version: this.version }, data);
      var msg = stringifyFxAEvent(command, dataToSend);

      this._contentWindow.postMessage(msg, this._iframeHost);
    }
  };

  // commands that come from the iframe. They are called
  // in the Lightbox object context.
  var COMMANDS = {
    error: function (command, data) {
      this.detach();
      this._deferred.reject(data);
    },
    /*jshint camelcase:false*/
    ping: function (command, data) {
      // ping is used to get the RP's origin. If the RP's origin is not
      // whitelisted, it cannot be iframed.
      this.send(command, data);
    },
    ignore: function (command, data) {
      console.log('ignoring command: %s', command);
    },
    oauth_cancel: function (command, data) {
      this.detach();
      return this._deferred.reject({ reason: 'cancel' });
    },
    oauth_complete: function (command, data) {
      this.detach();
      this._deferred.resolve(data);
    }
  };

  function onMessage(event) {
    /*jshint validthis: true*/
    if (event.origin !== this._iframeHost) {
      return;
    }

    var parsed = parseFxAEvent(event.data);
    var command = parsed.command;
    var data = parsed.data;

    var handler = COMMANDS[command] || COMMANDS.ignore;
    handler.call(this, command, data);
  }

  function parseFxAEvent(msg) {
    var components = msg.split('!!!');
    return {
      command: components[0],
      data: JSON.parse(components[1] || '{}')
    };
  }

  function stringifyFxAEvent(command, data) {
    return command + '!!!' + JSON.stringify(data || '');
  }

  IFrameChannel.stringifyFxAEvent = stringifyFxAEvent;
  IFrameChannel.parseFxAEvent = parseFxAEvent;

  return IFrameChannel;
});


