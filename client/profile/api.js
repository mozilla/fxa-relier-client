/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/xhr',
  'client/lib/object'
], function (p, Constants, Xhr, ObjectHelpers) {
  'use strict';

  /**
   * @class ProfileAPI
   * @constructor
   * @param {string} clientId - the OAuth client ID for the relier
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.profileHost]
   *   Firefox Accounts Profile Server host
   */
  function ProfileAPI(clientId, options) {
    if (! clientId) {
      throw new Error('clientId is required');
    }
    this._clientId = clientId;

    options = options || {};
    this._profileHost = options.profileHost || Constants.DEFAULT_PROFILE_HOST;
  }

  ProfileAPI.prototype = {
    /**
     * Fetch a user's profile data.
     *
     * @method fetch
     * @param {String} token
     * Scoped OAuth token that can be used to access the profile data
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to the user's profile data on success.
     */
    fetch: function (token, options) {
      if (! token) {
        throw new Error('token is required');
      }

      var xhrOptions = ObjectHelpers.extend({
        headers: {
          Authorization: 'Bearer ' + token
        }
      }, options);

      var self = this;
      return Xhr.get(self._profileHost + '/profile', {}, xhrOptions)
        .then(function (profileData) {
          self._profileData = profileData;
          return profileData;
        });
    },

    /**
     * Get all the user's profile data. Must be called after `fetch`
     *
     * @method all
     * @returns {Object}
     * User's profile data that was fetched using `fetch`.
     */
    all: function () {
      return this._profileData;
    }
  };

  return ProfileAPI;
});


