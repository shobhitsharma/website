'use strict';

var express = require('express');
var handlebars = require('express-handlebars');
var bundle = require('./package.json');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Router = require('./lib').Router;

var app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.engine('.hbs', handlebars({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'public/views/layouts'),
  partialsDir: path.join(__dirname, 'public/views/partials')
}));
app.set('view engine', '.hbs');

app.use(favicon(path.join(__dirname, 'public', '/assets/favicon.ico')));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, process.env.BUILD)));
app.use('/', new Router(app));

// Application settings
app.set('trust proxy', true);
app.set('strict routing', true);
app.set('x-powered-by', false);

app.use(logger('dev'));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
