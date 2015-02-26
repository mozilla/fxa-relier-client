/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'client/auth/lightbox/iframe_channel',
  'tests/mocks/window'
], function (bdd, assert, IFrameChannel, WindowMock) {
  'use strict';

  var FXA_HOST = 'https://accounts.firefox.com';

  bdd.describe('auth/lightbox/iframe_channel', function () {
    var windowMock;
    var contentWindowMock;
    var iframeChannel;

    bdd.beforeEach(function () {
      windowMock = new WindowMock();
      contentWindowMock = new WindowMock();

      iframeChannel = new IFrameChannel({
        window: windowMock,
        contentWindow: contentWindowMock,
        iframeHost: FXA_HOST
      });
    });

    bdd.afterEach(function () {
      try {
        iframeChannel.detach();
      } catch(e) {
        // the iframeChannel might not be attached.
      }
    });

    bdd.describe('attach', function () {
      bdd.it('should prepare to receive postMessages', function () {
        iframeChannel.attach();

        assert.isTrue(true);
      });

      bdd.it('should ignore messages from unexpected domains', function () {
        iframeChannel.attach();

        contentWindowMock.addEventListener('message', assert.fail);

        windowMock.postMessage(
            IFrameChannel.stringifyFxAEvent('ping'), '*', 'unexpected.domain');
      });

      bdd.it('should respond to pings from FXA_HOST', function () {
        var dfd = this.async();

        iframeChannel.attach();

        contentWindowMock.addEventListener('message', dfd.callback(function (event) {
          var parsed = IFrameChannel.parseFxAEvent(event.data);
          assert.equal(parsed.command, 'ping');
          assert.ok(parsed.data.version);
        }));

        windowMock.postMessage(
              IFrameChannel.stringifyFxAEvent('ping'), '*', FXA_HOST);
      });

      bdd.it('should reject the promise on error', function () {
        var promise = iframeChannel.attach();

        windowMock.postMessage(
            IFrameChannel.stringifyFxAEvent('error', { reason: 'client error' }), '*', FXA_HOST);

        return promise.then(assert.fail, function (err) {
          assert.equal(err.reason, 'client error');
        });
      });

      bdd.it('should reject the promise on oauth_cancel', function () {
        var promise = iframeChannel.attach();

        windowMock.postMessage(
              IFrameChannel.stringifyFxAEvent('oauth_cancel'), '*', FXA_HOST);

        return promise.then(assert.fail, function (err) {
          assert.equal(err.reason, 'cancel');
        });
      });

      bdd.it('should fulfill the promise on oauth_complete', function () {
        var promise = iframeChannel.attach();

        windowMock.postMessage(
            IFrameChannel.stringifyFxAEvent('oauth_complete', { code: 'code' }), '*', FXA_HOST);

        return promise.then(function (data) {
          assert.equal(data.code, 'code');
        });
      });
    });
  });
});



