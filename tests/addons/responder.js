/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A responder that will respond to XHR requests. The usage is similar
 * to sinon's useFakeXMLHttpRequest functionality. Responses automatically
 * kick off 50ms after the last request is opened.
 *
 * To use, create a responder. Register some responses. Profit.
 *
 * Example:
 *
 * var responder = new Responder();
 * responder.respondWith('GET', '/endpoint', { status: 404, headers:
 *    { 'Content-Type': 'text/text', body: 'Not found' });
 *
 * If `status` is not specified, a default of `200` is used.
 * If `headers` is not specified, a default of
 *     `{ 'Content-Type': 'application/json' }` is used.
 */

define([
  'tests/addons/sinon'
], function (sinon) {
  'use strict';

  function Responder(options) {
    options = options || {};
    this._respondAfter = options.respondAfter || 50;
  }
  Responder.prototype = {
    respondWith: function (method, url, response) {
      this._initialize();

      var namespace = method + ': ' + url;
      this._responses[namespace] = response;

      var mockXhrRequest = new this._MockXMLHttpRequest();

      var self = this;
      var origOpen = mockXhrRequest.open;
      mockXhrRequest.open = function () {
        if (self._flushTimeout) {
          // clear any old flush timers, only one flush should be kicked off.
          clearTimeout(self._flushTimeout);
        }

        // get the party started. The responses will be flushed
        // `this._respondAfter` ms after the last request is opened.
        self._flushTimeout = setTimeout(self._flushResponses.bind(self), self._respondAfter);

        // `this` here is valid, call the original open in the context
        // of the mockXhrRequest.
        return origOpen.apply(this, arguments);
      };

      return mockXhrRequest;
    },

    _initialize: function () {
      if (! this._isInitialized) {
        this._isInitialized = true;
        this._requests = [];
        this._responses = {};

        var MockXMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var self = this;
        MockXMLHttpRequest.onCreate = function (_request) {
          self._requests.push(_request);
        };

        this._MockXMLHttpRequest = MockXMLHttpRequest;
      }
    },

    _flushResponses: function () {
      var self = this;
      var requests = self._requests;
      // set up to respond to any new requests that come in.
      self._requests = [];
      requests.forEach(function (request) {
        var namespace = request.method + ': ' + request.url;
        var response = self._responses[namespace];
        if (! response) {
          throw new Error('No response for ' + namespace);
        }
        var status = response.status || 200;
        var headers = response.headers || {
          'Content-Type': 'application/json'
        };
        request.respond(status, headers, response.body);
      });
    },

    restore: function () {
      if (this._isInitialized) {
        delete this._isInitialized;
        this._MockXMLHttpRequest.restore();
      }
    }
  };

  return Responder;

});
