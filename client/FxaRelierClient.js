/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'p-promise',
  'client/auth/lightbox/api',
  'client/lib/options'
], function (p, LightboxAPI, Options) {
  'use strict';

  function FxaRelierClient(options) {
    Options.checkRequired(['clientId'], options);

    this.auth = {
      lightbox: new LightboxAPI(options)
    };
  }

  FxaRelierClient.prototype = {
    version: '0.0.0'
  };

  return FxaRelierClient;
});

