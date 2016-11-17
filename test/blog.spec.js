var expect = require('chai').expect;
var sinon = require('sinon');

var Blog = require('../lib/blog.js');

var blog = new Blog();

require('dotenv').config();

describe('Blog Platform API', function () {
  describe('#handshake()', function () {
    it('should return user data', function () {
      blog.handshake(function (err, data) {
        if (err) {
          return;
        }
        return data;
      });
    });
  });
});
