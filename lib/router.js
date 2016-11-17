/**
 * @file Router
 *
 * @author Shobhit Sharma <hi@shobhit.com>
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var API = require('./api');

module.exports = function (app, options) {
  options = options || {};

  router.use('/api', new API(app, options));

  router.use('/', function (req, res, next) {
    res.render('home');
  });

  router.use('/:entity*', function (req, res, next) {
    res.render('home');
  });

  return router;
};
