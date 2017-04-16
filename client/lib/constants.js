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
     * @default https://accounts.firefox.com
     * @type {String}
     */
    DEFAULT_CONTENT_HOST: 'https://accounts.firefox.com',
    /**
     * Default oauth server host
     * @property DEFAULT_OAUTH_HOST
     * @default https://oauth.accounts.firefox.com/v1
     * @type {String}
     */
    DEFAULT_OAUTH_HOST: 'https://oauth.accounts.firefox.com/v1',
    /**
     * Default profile server host
     * @property DEFAULT_PROFILE_HOST
     * @default https://profile.accounts.firefox.com/v1
     * @type {String}
     */
    DEFAULT_PROFILE_HOST: 'https://profile.accounts.firefox.com/v1',
    /**
     * Default notifications server url
     * @property DEFAULT_NOTIFICATIONS_SERVER
     * @type {String}
     */
    DEFAULT_NOTIFICATIONS_SERVER: 'https://notifications.accounts.firefox.com/v1',
    /**
     * Sign in action
     * @property SIGNIN_ACTION
     * @default  "signin"
     * @type {String}
     */
    SIGNIN_ACTION: 'signin',
    /**
     * Sign up action
     * @property SIGNUP_ACTION
     * @default  "signup"
     * @type {String}
     */
    SIGNUP_ACTION: 'signup',
    /**
     * Force auth action
     * @property FORCE_AUTH_ACTION
     * @default  "force_auth"
     * @type {String}
     */
    FORCE_AUTH_ACTION: 'force_auth',
    /**
     * Best choice action
     * @property BEST_CHOICE_ACTION
     * @default null
     * @type {String}
     */
    BEST_CHOICE_ACTION: null
  };
});


