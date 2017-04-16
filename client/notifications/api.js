/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/lib/constants',
  'client/lib/xhr'
], function (p, Constants, Xhr) {
  /**
   * @class NotificationAPI
   * @constructor
   * @param {Object} [options={}] - configuration
   *   @param {String} [options.notificationPos]
   *   Position at which to start reading events (defaults to head of stream)
   *   @param {String} [options.notificationsServer]
   *   Firefox Accounts Notifications Server url
   */
  function NotificationsAPI(options) {
    options = options || {};
    if (options.notificationsPos) {
      this._curPos = options.notificationsPos;
    } else {
      this._curPos = this.head();
    }
    this._notificationsServer = options.notifictionsServer || Constants.DEFAULT_NOTIFICATIONS_SERVER;
  }

  NotificationsAPI.prototype = {

    /**
     * Find the current head position in the event stream.  See:
     * https://github.com/mozilla/fxa-notification-server/blob/master/docs/api.md#get-v1eventshead
     *
     * @method head
     * @param {String} token
     * OAuth token for accessing the API
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to the reported head position.
     */
    head: function (token, options) {
      if (! token) {
        return p.reject(new Error('token is required'));
      }
      if (! options.headers) {
        options.headers = {};
      }
      options.headers.Authorization = 'Bearer ' + token;
      var endpoint = this._notificationsServer + 'events/head';
      return Xhr.get(endpoint, {}, options)
        .then(function (res) {
          return res.pos;
        });
    },

    /**
     * Read events from the notification stream. See:
     * https://github.com/mozilla/fxa-notification-server/blob/master/docs/api.md#get-v1events
     *
     * @method events
     * @param {String} token
     * OAuth token for accessing the API
     * @param {Object} [options={}] - configuration
     *   @param {String} [options.num]
     *   The number of events to fetch (default 1000)
     *   @param {String} [options.iss]
     *   Only fetch events from this issuer
     *   @param {String} [options.uid]
     *   Only fetch events relevant to this uid
     *   @param {String} [options.rid]
     *   Only fetch events relevant to this rid
     *   @param {String} [options.xhr]
     *   XMLHttpRequest compatible object to use to make the request.
     * @returns {Promise}
     * Response resolves to a list of events.
     */
    events: function (token, options) {
      if (! token) {
        return p.reject(new Error('clientSecret is required'));
      }
      if (! options.headers) {
        options.headers = {};
      }
      options.headers.Authorization = 'Bearer ' + token;
      var endpoint = this._notificationsServer + 'events';
      endpoint += '?pos=' + this._curPos;
      if (options.iss) {
        endpoint += '&iss=' + options.iss;
      }
      if (options.uid) {
        endpoint += '&uid=' + options.uid;
      }
      if (options.rid) {
        endpoint += '&rid=' + options.rid;
      }
      return Xhr.get(endpoint, {}, options)
          .then(function (res) {
            // Advance position for subsequent reads.
            this._curPos = res.next_pos;
            // Return the events.
            return res.events;
          });
    }
  };

  return NotificationsAPI;
});


