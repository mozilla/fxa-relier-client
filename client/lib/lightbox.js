/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'client/lib/dom'
  'client/lib/iframe'
], function (dom, IFrame) {
  'use strict';


  /**
   * Create a lightbox.
   *
   * @class Lightbox
   * @constructor
   * @param {options={}} options
   * @param {String} options.window
   * The window object
   */
  function Lightbox(options) {
    options = options || {};

    this._window = options.window;
  }

  Lightbox.prototype = {
    /**
     * Load content into the lightbox
     * @method load
     * @param {String} src
     * URL to load.
     * @param {options={}} options
     * @param {Number} [options.zIndex]
     * z-index to set on the background.
     * @default 100
     * @param {String} [options.background]
     * Lightbox background CSS.
     * @default rgba(0,0,0,0.5)
     */
    load: function (src, options) {
      options = options || {};

      var backgroundStyle = options.background || 'rgba(0,0,0,0.5)';
      var zIndexStyle = options.zIndex || 100;

      var background = this._backgroundEl = dom.createElement(this._window, 'div', {
        id: 'fxa-background',
        style: dom.cssPropsToString({
          background: backgroundStyle,
          bottom: 0,
          left: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          'z-index': zIndexStyle
        })
      });

      this._iframe = new IFrame({
        window: this._window
      });
      this._iframe.load(src, background);

      this._window.document.body.appendChild(background);
    },

    /**
     * Get the content iframe element.
     * @method getContentElement
     * @returns {DOM Element}
     */
    getContentElement: function () {
      return this._iframe.getContentElement();
    },

    /**
     * Get the content window in the iframe.
     * @method getContentWindow
     * @returns {DOM Element}
     */
    getContentWindow: function () {
      return this._iframe.getContentWindow();
    },

    /**
     * Check if the lightbox is loaded
     * @method isLoaded
     * @returns {Boolean}
     */
    isLoaded: function () {
      return !! this._backgroundEl;
    },

    /**
     * Unload the lightbox
     * @method unload
     */
    unload: function () {
      if (this._backgroundEl) {
        this._window.document.body.removeChild(this._backgroundEl);
        delete this._backgroundEl;

        this._iframe.unload();
        delete this._iframe;
      }
    }
  };

  return Lightbox;
});

