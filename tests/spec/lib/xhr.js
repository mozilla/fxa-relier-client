/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!bdd',
  'intern/chai!assert',
  'tests/addons/sinon',
  'client/lib/xhr'
], function (bdd, assert, sinon, xhr) {
  'use strict';

  bdd.describe('xhr', function () {
    var mockXMLHttpRequest;
    var mockXHR;
    var serverRequest;

    bdd.beforeEach(function () {
      mockXMLHttpRequest = sinon.useFakeXMLHttpRequest();
      mockXMLHttpRequest.onCreate = function (_request) {
        serverRequest = _request;
      };
      mockXHR = new mockXMLHttpRequest();
    });

    bdd.afterEach(function () {
      mockXMLHttpRequest.restore();
    });

    bdd.describe('get', function () {
      bdd.it('should perform a GET request', function () {
        var dfd = this.async(1000);

        var requestData = { key: 'value' };
        xhr.get('/get_request', requestData, {
          xhr: mockXHR
        })
        .then(dfd.callback(function (resp) {
          assert.equal(serverRequest.method, 'GET');
          assert.equal(serverRequest.url, '/get_request?key=value');
          assert.isTrue(resp.success);
        }), dfd.reject.bind(dfd));

        serverRequest.respond(200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({ success: true }));
      });
    });

    bdd.describe('post', function () {
      bdd.it('should perform a POST request', function () {
        var dfd = this.async(1000);

        var requestData = { key: 'value' };
        xhr.post('/post_request', requestData, {
          xhr: mockXHR
        })
        .then(dfd.callback(function (resp) {
          assert.equal(serverRequest.method, 'POST');
          assert.equal(serverRequest.url, '/post_request')
          assert.equal(serverRequest.requestBody, JSON.stringify(requestData));
          assert.isTrue(resp.success);
        }), dfd.reject.bind(dfd));

        serverRequest.respond(200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({ success: true }));
      });
    });
  });
});
