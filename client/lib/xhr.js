/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'promise',
  'components/micrajax/micrajax',
  './function'
], function (promise, micrajax, FunctionHelpers) {
  'use strict';

  var partial = FunctionHelpers.partial;
  var Promise = promise.Promise;

  var NodeXMLHttpRequest;
  try {
    // If embedded in node, use the xhr2 module
    if (typeof require !== 'undefined') {
      NodeXMLHttpRequest = require('xhr2');
    }
  } catch (e) {
    NodeXMLHttpRequest = null;
  }

  function getXHRObject(xhr) {
    if (xhr) {
      return xhr;
    } else if (NodeXMLHttpRequest) {
      return new NodeXMLHttpRequest();
    }
    // fallback to the system default
  }

  /**
   * Provides XHR functionality for use in either a browser or node
   * environment.
   *
   * @class Xhr
   * @static
   */

  function request(method, path, data, options) {
    options = options || {};

    return new Promise(function(resolve, reject) {
      micrajax.ajax({
        type: method,
        url: path,
        data: data,
        contentType: options.contentType || 'application/json',
        headers: options.headers,
        xhr: getXHRObject(options.xhr),
        success: function (data, responseText, jqXHR) {
          resolve(data);
        },
        error: function (jqXHR, status, responseText) {
          reject(responseText);
        }
      });
    });
  }

  var XHR = {
    /**
     * Perform a GET request
     * @method get
     * @param {String} path endpoint URL
     * @param {Object || String} [data]
     * data to send
     * @param {Object} [options={}]
     * Options
     * @param {String} [options.contentType="application/json"]
     * Content type of `data`.
     * @param {Object} [options.headers]
     * Headers to pass with request.
     * @param {Object} [options.xhr]
     * XMLHttpRequest compatible object to use for XHR requests
     * @return {Promise} A promise that will be fulfilled with JSON `xhr.responseText` of the request
     */
    get: partial(request, 'GET'),

    /**
     * Perform a POST request
     * @method post
     * @param {String} path endpoint URL
     * @param {Object || String} [data]
     * data to send
     * @param {Object} [options={}]
     * Options
     * @param {String} [options.contentType="application/json"]
     * Content type of `data`.
     * @param {Object} [options.headers]
     * Headers to pass with request.
     * @param {Object} [options.xhr]
     * XMLHttpRequest compatible object to use for XHR requests
     * @return {Promise} A promise that will be fulfilled with JSON `xhr.responseText` of the request
     */
    post: partial(request, 'POST')
  };

  return XHR;
});
