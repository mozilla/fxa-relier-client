/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/responder',
  'client/notifications/api',
  'client/lib/constants'
], function (bdd, assert, Responder, NotificationsAPI, Constants) {
  'use strict';

  bdd.describe('NotificationsAPI', function () {
    var api;
    var responder;

    bdd.beforeEach(function () {
      api = new NotificationsAPI({
        notificationsPos: '0'
      });
      responder = new Responder();
    });

    bdd.afterEach(function () {
      responder.restore();
    });

    bdd.describe('head', function () {
      bdd.it('fetches and returns the head position in the stream', function () {
        var endpoint = Constants.DEFAULT_NOTIFICATIONS_SERVER + 'events/head';
        var mockXHR = responder.respondWith('GET', endpoint, {
          body: JSON.stringify({
            pos: '2'
          })
        });

        return api.head('token', {
          xhr: mockXHR
        })
        .then(function (pos) {
          assert.equal(pos, '2');
        });
      });
    });

    bdd.describe('events', function () {
      bdd.it('fetches events from current position in the stream', function () {
        var endpoint = Constants.DEFAULT_NOTIFICATIONS_SERVER + 'events';
        endpoint += '?pos=0';
        var mockXHR = responder.respondWith('GET', endpoint, {
          body: JSON.stringify({
            next_pos: '3',
            events: ['event0', 'event1', 'event2']
          })
        });

        return api.events('token', {
          xhr: mockXHR
        })
        .then(function (events) {
          assert.equal(events.length, 3);
          assert.equal(events[0], 'event0');
          assert.equal(events[1], 'event1');
          assert.equal(events[2], 'event2');
        });
      });
    });
  });
});

