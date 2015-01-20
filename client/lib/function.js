/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * Simple function helpers.
 *
 * @class Function
 * @static
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
     * [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
     *
     * @example
     *     function add(a, b) {
     *       return a + b;
     *     }
     *
     *     var add10To = partial(add, 10);
     *     var result = add10To(9);
     *     // result is 19
     *
     * @method partial
     * @param method {Function}
     * Method to call with the arguments on final evaluation.
     * @returns {Function}
     */
    partial: partial
  };
});

