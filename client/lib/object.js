/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Helper functions for working with Objects
 */
define([], function () {
  'use strict';

  function extend(target) {
    var sources = [].slice.call(arguments, 1);

    for (var index = 0, source; source = sources[index]; ++index) {
      for (var key in source) {
        target[key] = source[key];
      }
    }

    return target;
  }

  return {
    extend: extend
  };
});




