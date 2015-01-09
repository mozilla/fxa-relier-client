/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.config('requirejs', {
    options: {
      baseUrl: './',
      include: ['client/FxaRelierClient'],
      name: 'components/almond/almond',
      wrap: {
        startFile: 'config/start.frag',
        endFile: 'config/end.frag'
      },
      paths: {
        'p-promise': 'components/p-promise/p',
        'micrajax': 'components/micrajax/micrajax'
      }
    },
    prod: {
      options: {
        out: 'build/fxa-relier.client.min.js',
        optimize: 'uglify2',
        generateSourceMaps: true,
        preserveLicenseComments: false
      }
    },
    debug: {
      options: {
        out: 'build/fxa-relier-client.js',
        optimize: 'none',
        preserveLicenseComments: true
      }
    }
  });
};
