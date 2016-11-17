/**
 * @file API router
 *
 * @author Shobhit Sharma
 */
var express = require('express');
var router = express.Router();
var cors = require('cors');
var _ = require('underscore');
var Blog = require('./blog.js');

var API = function (app, options) {
  options = options || {};

  var corsOptions = {
    allowedHeaders: 'Accept,Origin,X-Access-Token,Content-Type,X-Requested-With',
    credentials: false,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    origin: '*'
  };

  var blog = new Blog();

  router.use(cors(corsOptions));

  router.route('/:version/me')
    .get(function (req, res, next) {
      blog.handshake(function (err, result) {
        if (err) {
          return next(err);
        }
        res.send(result);
      });
    });

  router.route('/:version/posts')
    .get(function (req, res, next) {
      res.status(200).send({
        posts: []
      });
    });

  return router;
};

module.exports = API;
