/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Helper functions for working with functions
 */
define([], function () {
  'use strict';

  function bind(func, context) {
    return function() {
      var args = [].slice.call(arguments, 0);
      func.apply(context, args);
    };
  }

  return {
    bind: bind
  };
});



