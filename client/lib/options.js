/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Helper functions for working with options
 */


define([], function () {
  'use strict';

  function checkRequired(requiredOptions, options) {
    for (var i = 0, requiredOption; requiredOption = requiredOptions[i]; ++i) {
      if (! (requiredOption in options)) {
        throw new Error(requiredOption + ' is required');
      }
    }
  }

  return {
    checkRequired: checkRequired
  };

});


