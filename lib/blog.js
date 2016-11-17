/**
 * Medium Blog Integration
 *
 * @module Blog
 * @fileoverview Medium API methods
 */
'use strict';

require('dotenv').config();

var medium = require('medium-sdk');

function Blog(config) {
  this.config = config || {};
  this.redirectURL = process.env.MEDIUM_CALLBACK;
  this.client = new medium.MediumClient({
    clientId: process.env.MEDIUM_CLIENTID,
    clientSecret: process.env.MEDIUM_CLIENTSECRET
  });
  this.client.setAccessToken(process.env.MEDIUM_ACCESS_TOKEN);

  return this;
}

Blog.prototype.handshake = function (callback) {
  callback = callback || function () {};
  var self = this;
  var url = self.client.getAuthorizationUrl('secretState', self.redirectURL, [
    medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST
  ]);

  self.client.exchangeAuthorizationCode(null, self.redirectURL, function (err, token) {
    self.client.getUser(function (err, user) {
      if (err) {
        return callback(err);
      }
      callback(null, user);
    });
  });
};

module.exports = Blog;
