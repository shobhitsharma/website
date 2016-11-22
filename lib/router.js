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

  router.route('/').get(index);

  router.route('/:entity*').get(index);

  function index(req, res, next) {
    res.render('index', {
      title: 'shobhit.',
      description: 'I write code. I play guitar. I wander avidly.'
    });
  }

  return router;
};
