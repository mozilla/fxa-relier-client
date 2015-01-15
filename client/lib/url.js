/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Helpers functions to work with URLs
 *
 * @class Url
 * @static
 */
define([], function () {
  'use strict';

  /**
   * Create a query parameter string from a key and value
   *
   * @method createQueryParam
   * @param {String} key
   * @param {Variant} value
   * @returns {String}
   * URL safe serialized query parameter
   */
  function createQueryParam(key, value) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }

  /**
   * Create a query string out of an object.
   * @method objectToQueryString
   * @param {Object} obj
   * Object to create query string from
   * @returns {String}
   * URL safe query string
   */
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


