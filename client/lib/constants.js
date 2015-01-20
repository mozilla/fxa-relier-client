/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Constants
 *
 * @class Constants
 * @static
 */
define([], function () {
  'use strict';

  return {
    /**
     * Default content server host
     * @property DEFAULT_CONTENT_HOST
     * @type {String}
     */
    DEFAULT_CONTENT_HOST: 'https://accounts.firefox.com',
    /**
     * Default oauth server host
     * @property DEFAULT_OAUTH_HOST
     * @type {String}
     */
    DEFAULT_OAUTH_HOST: 'https://oauth.accounts.firefox.com/v1',
    /**
     * Default profile server host
     * @property DEFAULT_PROFILE_HOST
     * @type {String}
     */
    DEFAULT_PROFILE_HOST: 'https://profile.accounts.firefox.com/v1',
    /**
     * Sign in action
     * @property SIGNIN_ACTION
     * @type {String}
     */
    SIGNIN_ACTION: 'signin',
    /**
     * Sign up action
     * @property SIGNUP_ACTION
     * @type {String}
     */
    SIGNUP_ACTION: 'signup',
    /**
     * Force auth action
     * @property FORCE_AUTH_ACTION
     * @type {String}
     */
    FORCE_AUTH_ACTION: 'force_auth'
  };
});


