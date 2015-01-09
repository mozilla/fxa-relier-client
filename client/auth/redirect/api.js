/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  '../base/api',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/object'
], function (AuthenticationAPI, Constants, Options, ObjectHelpers) {
  'use strict';

  /**
   * Authenticate a user with the redirect flow.
   *
   * @class RedirectAPI
   * @extends AuthenticationAPI
   * @constructor
   */
  function RedirectAPI(clientId, options) {
    AuthenticationAPI.call(this, clientId, options);
  }

  RedirectAPI.prototype = Object.create(AuthenticationAPI.prototype);
  ObjectHelpers.extend(RedirectAPI.prototype, {
    openFxa: function (fxaUrl) {
      this._window.location.href = fxaUrl;
    }
  });

  return RedirectAPI;
});

