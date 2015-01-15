/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  '../base/api',
  'client/lib/constants',
  'client/lib/options',
  'client/lib/object'
], function (BaseBroker, Constants, Options, ObjectHelpers) {
  'use strict';

  /**
   * Authenticate a user with the redirect flow.
   *
   * @class RedirectBroker
   * @extends BaseBroker
   * @constructor
   */
  function RedirectBroker(clientId, options) {
    BaseBroker.call(this, clientId, options);
  }

  RedirectBroker.prototype = Object.create(BaseBroker.prototype);
  ObjectHelpers.extend(RedirectBroker.prototype, {
    openFxa: function (fxaUrl) {
      this._window.location.href = fxaUrl;
    }
  });

  return RedirectBroker;
});

