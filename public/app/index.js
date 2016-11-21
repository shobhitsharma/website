import $ from 'jquery';
import Backbone from 'backbone';

import Router from './router';
import Helper from './helper';
import Controller from './controller';
import MainView from './components/main.js';

$(() => {
  console.debug('Shobhit Sharma UI Initialized', Controller);
  const router = new Router();

  const view = new MainView({
    model: Controller
  });

  $('#application').empty().append(view.render().$el);

  Backbone.history.start({
    pushState: true
  });
});
