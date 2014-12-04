/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * helpers to work with URLs
 */
define([], function () {
  'use strict';

  function createQueryParam(key, value) {
    return key + '=' + encodeURIComponent(value);
  }

  function objectToQueryString(obj) {
    var queryParams = [];

    for (var key in obj) {
      queryParams.push(createQueryParam(key, obj[key]));
    }

    return '?' + queryParams.join('&');
  }

  return {
    createQueryParam: createQueryParam,
    objectToQueryString: objectToQueryString
  };
});


