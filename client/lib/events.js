/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Cross browser functions for working with event handlers
 */

define([], function () {
  'use strict';

  function addEventListener(target, eventName, handler) {
    if (target.addEventListener) {
      target.addEventListener(eventName, handler, false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventName, handler);
    }
  }

  function removeEventListener(target, eventName, handler) {
    if (target.removeEventListener) {
      target.removeEventListener(eventName, handler, false);
    } else if (target.detachEvent) {
      target.detachEvent('on' + eventName, handler);
    }
  }

  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  };
});


