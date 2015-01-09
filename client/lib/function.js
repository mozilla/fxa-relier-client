/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * Simple function helpers.
 *
 * @module Function
 */
define(function () {
  'use strict';

  function partial(method/*, ...*/) {
    var args = [].slice.call(arguments, 1);
    return function () {
      return method.apply(this, args.concat([].slice.call(arguments, 0)));
    };
  }


  return {
    /**
     * Partially apply a function by filling in any number of its arguments,
     * without changing its dynamic this value. A close cousin of
     * Function.prototype.bind.
     *
     * example:
     * function add(a, b) {
     *   return a + b;
     * }
     *
     * var add1 = partial(add, 1);
     * var result = add1(9);
     * // result is 10
     *
     * @method partial
     * @param {Function} method
     * method to pass arguments to.
     * @returns {Function}
     */
    partial: partial
  };
});

