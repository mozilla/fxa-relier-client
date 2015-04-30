/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*globals define*/

define([
  'client/lib/dom'
], function (dom) {
  'use strict';


  /**
   * Create a lightbox.
   *
   * @class IFrame
   * @constructor
   * @param {options={}} options
   * @param {String} options.window
   * The window object
   */
  function IFrame(options) {
    options = options || {};

    this._window = options.window;
  }

  IFrame.prototype = {
    /**
     * Load content into the iframe
     * @method load
     * @param {String} src
     * URL to load.
     * @param {DOMElement} target
     * Target to attach iframe to.
     */
    load: function (src, target) {
      var iframe = dom.createElement(this._window, 'iframe', {
        id: 'fxa',
        src: src,
        width: '600',
        height: '400',
        allowtransparency: 'true',
        border: '0',
        style: dom.cssPropsToString({
          background: 'transparent',
          border: 'none',
          display: 'block',
          height: '600px',
          margin: '0 auto 0 auto',
          position: 'relative',
          top: '10%',
          width: '400px'
        })
      });

      target.appendChild(iframe);

      this._iframe = iframe;
      this._contentWindow = iframe.contentWindow;
    },

    /**
     * Get the content iframe element.
     * @method getContentElement
     * @returns {DOM Element}
     */
    getContentElement: function () {
      return this._iframe;
    },

    /**
     * Get the content window in the iframe.
     * @method getContentWindow
     * @returns {DOM Element}
     */
    getContentWindow: function () {
      return this._contentWindow;
    },

    /**
     * Check if the iframe is loaded
     * @method isLoaded
     * @returns {Boolean}
     */
    isLoaded: function () {
      return !! this._iframe;
    },

    /**
     * Unload the iframe
     * @method unload
     */
    unload: function () {
      if (this._iframe) {
        this._iframe.parentNode.removeChild(this._iframe);
        delete this._iframe;
        delete this._contentWindow;
      }
    }
  };

  return IFrame;
});

