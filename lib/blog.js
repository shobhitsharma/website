/**
 * Medium Blog Integration
 *
 * @module Blog
 * @fileoverview Medium API methods
 */
'use strict';

require('dotenv').config();

var assert = require('assert');
var request = require('request');
var medium = require('medium-sdk');

// Use Q if native promises are not available
if (typeof Promise === 'undefined') {
  Promise = require('q').Promise;
}

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

  this.client.getUser(function (err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

Blog.prototype.publish = function (callback) {
  return callback(new Error('Publishing Posts not yet implemented.'));
};

Blog.prototype.posts = function (params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  assert.equal(typeof (callback), 'function', "argument 'callback' must be a function");

  var URI = 'https://medium.com/' + process.env.MEDIUM_USERID + '/latest' + serialize(params);
  var options = {
    url: URI,
    headers: {
      'Accept': 'application/json'
    }
  };

  request(options, function cb(error, response, body) {
    if (error) {
      return callback(error);
    }

    if (response.statusCode === 200) {
      var formatted = body.replace('])}while(1);</x>', '');

      try {
        var parsed = JSON.parse(formatted);

        callback(null, parsed.payload);
      } catch (e) {
        return callback(e);
      }
    } else {
      callback(new Error('Unable to retrieve data this time.'));
    }
  });
};

function serialize(obj) {
  return '?' + Object.keys(obj).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(obj[k]));
    return a;
  }, []).join('&');
}

module.exports = Blog;
