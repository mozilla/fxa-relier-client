/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'client/auth/lightbox/lightbox',
  'tests/mocks/window'
], function (bdd, assert, Lightbox, WindowMock) {
  'use strict';

  var CONTENT_URL = 'https://accounts.firefox.com/signin';

  bdd.describe('auth/lightbox/lightbox', function () {
    var windowMock;
    var lightbox;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();

      lightbox = new Lightbox({
        window: windowMock,
        src: CONTENT_URL
      });
    });

    bdd.afterEach(function () {
      try {
        lightbox.unload();
      } catch(e) {
        // the lightbox might not be loaded.
      }
    });

    bdd.describe('load', function () {
      bdd.it('should load the lightbox', function () {
        var child;
        windowMock.document.body.appendChild = function (_child) {
          child = _child;
        };

        lightbox.load();

        assert.equal(child.type, 'div');

        var src = lightbox.getContentElement().getAttribute('src');
        assert.equal(src, CONTENT_URL);

        var contentWindow = lightbox.getContentWindow();
        assert.isTrue(contentWindow instanceof WindowMock);
      });
    });
  });
});



