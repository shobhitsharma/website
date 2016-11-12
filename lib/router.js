/**
 * @file Router
 *
 * @author Shobhit Sharma <hi@shobhit.com>
 */
var express = require('express');
var router = express.Router();
var path = require('path');

module.exports = function (app, options) {
  options = options || {};

  router.use('/api', function (req, res, next) {
    res.send({
      status: 'api_not_implemented'
    });
  });

  router.use('/', function (req, res, next) {
    res.render('home');
  });

  router.use('/:entity*', function (req, res, next) {
    res.render('home');
  });

  return router;
};
