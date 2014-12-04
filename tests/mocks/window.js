/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A simple window mock
 */

define([], function () {
  'use strict';

  function DOMElement(type) {
    this.type = type;
    this._events = {};
    this._attributes = {};
  }

  DOMElement.prototype = {
    setAttribute: function (attrName, attrValue) {
      this._attributes[attrName] = attrValue;
    },

    getAttribute: function (attrName) {
      return this._attributes[attrName];
    },

    appendChild: function () {
    },

    removeChild: function () {
    },

    addEventListener: function (eventName, callback/*, bubble*/) {
      this._events[eventName] = this._events[eventName] || [];
      this._events[eventName].push(callback);
    },

    removeEventListener: function (eventName, callback) {
      if (this._events[eventName]) {
        var index = this._events[eventName].indexOf(callback);
        if (index > -1) {
          this._events[eventName].splice(index, 1);
        }
      }
    },

    triggerEventListener: function (eventName, event) {
      if (this._events[eventName]) {
        this._events[eventName].forEach(function (handler) {
          handler(event);
        });
      }
    }
  };

  function IFrame() {
    DOMElement.call(this, 'iframe');
    this.contentWindow = new WindowMock();
  }
  IFrame.prototype = new DOMElement();

  function Document() {
    DOMElement.call(this, 'document');
    this.body = new DOMElement('body');
  }
  Document.prototype = new DOMElement();
  Document.prototype.createElement = function (type) {
    if (type === 'iframe') {
      return new IFrame();
    }

    return new DOMElement(type);
  };


  function WindowMock() {
    DOMElement.call(this, 'window');
    this.document = new Document();

    this.location = {
      href: null
    };
  }
  WindowMock.prototype = new DOMElement();
  WindowMock.prototype.postMessage = function (message, targetOrigin, origin) {
    this.triggerEventListener('message', {
      origin: origin,
      data: message
    });
  };

  return WindowMock;
});




