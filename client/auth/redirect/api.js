/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  '../api',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/object'
], function (AuthenticationAPI, Constants, Options, ObjectHelpers) {
  'use strict';

  /**
   * Authenticate a user with the redirect flow.
   *
   * @class RedirectAPI
   * @constructor
   */
  function RedirectAPI(clientId, options) {
    AuthenticationAPI.call(this, clientId, options);
  }

  RedirectAPI.prototype = Object.create(AuthenticationAPI.prototype);
  ObjectHelpers.extend(RedirectAPI.prototype, {
    authenticate: function (page, config) {
      var requiredOptions = ['scope', 'state', 'redirect_uri'];
      Options.checkRequired(requiredOptions, config);

      var self = this;
      var fxaUrl = self.getFxaUrl(self._fxaHost, page, self._clientId,
            config.state, config.scope, config.redirect_uri,
            config.force_email);


      this._window.location.href = fxaUrl;
    }

  });

  return RedirectAPI;
});

