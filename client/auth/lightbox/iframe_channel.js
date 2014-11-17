/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'p-promise'
], function (p) {
  'use strict';

  function bind(func, context) {
    return function() {
      var args = [].slice.call(arguments, 0);
      func.apply(context, args);
    };
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


  function IFrameChannel(options) {
    options = options || {};

    this._contentWindow = options.contentWindow;
    this._window = options.window;
    this._iframeHost = options.iframeHost;
  }

  IFrameChannel.stringifyFxAEvent = stringifyFxAEvent;
  IFrameChannel.parseFxAEvent = parseFxAEvent;

  IFrameChannel.prototype = {
    version: '0.0.0',

    attach: function () {
      this._boundOnMessage = bind(this.onMessage, this);
      this._window.addEventListener('message', this._boundOnMessage, false);

      this._deferred = p.defer();
      return this._deferred.promise;
    },

    detach: function () {
      this._window.removeEventListener('message', this._boundOnMessage, false);
    },

    onMessage: function (event) {
      if (event.origin !== this._iframeHost) {
        return;
      }

      var parsed = parseFxAEvent(event.data);
      var command = parsed.command;
      var data = parsed.data;

      var handler = this.commands[command] || this.commands.ignore;
      handler.call(this, command, data);
    },

    // commands that come from the iframe. They are called
    // in the Lightbox object context.
    commands: {
      error: function (command, data) {
        this.detach();
        this._deferred.reject(data);
      },
      /*jshint camelcase:false*/
      ping: function (command, data) {
        // ping is used to get the RP's origin. If the RP's origin is not
        // whitelisted, it cannot be iframed.
        var msg = stringifyFxAEvent(command, { version: this.version });

        this._contentWindow.postMessage(msg, this._iframeHost);
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
    }
  };

  return IFrameChannel;
});


