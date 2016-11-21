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
var FeedParser = require('feedparser');
var medium = require('medium-sdk');

// Use Q if native promises are not available
if (typeof Promise === 'undefined') {
  Promise = require('q').Promise;
}

/**
 *
 *
 * @param {any} config
 * @returns
 */
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

/**
 *
 *
 * @param {any} callback
 */
Blog.prototype.handshake = function (callback) {
  callback = callback || function () {};

  this.client.getUser(function (err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

/**
 *
 *
 * @param {any} callback
 * @returns
 */
Blog.prototype.publish = function (callback) {
  return callback(new Error('Publishing Posts not yet implemented.'));
};

/**
 *
 *
 * @param {any} params
 * @param {any} callback
 */
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

Blog.prototype.feed = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var feedparser = new FeedParser({
    resume_saxerror: false,
    normalize: true
  });
  var posts = [];
  var req = request('https://medium.com/feed/' + process.env.MEDIUM_USERID);

  req.setMaxListeners(50);
  req.on('error', function (error) {
    return callback(error);
  });
  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) {
      return this.emit('error', new Error('Bad status code'));
    }

    stream.pipe(feedparser);
  });

  feedparser.on('error', function (error) {
    return callback(error);
  });
  feedparser.on('readable', function () {
    var stream = this;
    var meta = this.meta;
    var item = null;

    while (item = stream.read()) {
      var content = item.description || '';
      var post = {
        title: item.title,
        link: item.link,
        excerpt: content.replace(/(<([^>]+)>)/ig, ' ').substring(0, 250) + '...',
        tags: item.categories
      };

      if (options.fulltext) {
        post.content = content;
      }

      posts.push(post);
    }
  });
  feedparser.on('end', function () {
    callback(null, posts);
  });
};

/**
 *
 *
 * @param {any} obj
 * @returns
 */
function serialize(obj) {
  return '?' + Object.keys(obj).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(obj[k]));
    return a;
  }, []).join('&');
}

module.exports = Blog;
