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
        window: windowMock
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

        lightbox.load(CONTENT_URL);

        assert.equal(child.type, 'div');
        // ensure some default styles are set
        var style = child.getAttribute('style');
        assert.include(style, 'z-index:100');
        assert.include(style, 'background:rgba(0,0,0,0.5)');

        var src = lightbox.getContentElement().getAttribute('src');
        assert.equal(src, CONTENT_URL);

        var contentWindow = lightbox.getContentWindow();
        assert.isTrue(contentWindow instanceof WindowMock);
      });

      bdd.it('relier can set `zIndex` and `background`', function () {
        var child;
        windowMock.document.body.appendChild = function (_child) {
          child = _child;
        };

        lightbox.load(CONTENT_URL, {
          zIndex: 150,
          background: '#000'
        });

        // ensure some overridden styles are set
        var style = child.getAttribute('style');
        assert.include(style, 'z-index:150');
        assert.include(style, 'background:#000')
      });
    });
  });
});



