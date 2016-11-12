import $ from 'jquery';
import Backbone from 'backbone';

import Router from './router';
import Helper from './helper';
import Controller from './controller';
import MainView from './components/main.js';

$(() => {
  console.debug('Shobhit Sharma UI Initialized', Helper);
  const router = new Router();
  const controller = new Controller();

  const view = new MainView({
    model: controller
  });

  $('#application').empty().append(view.render().$el);

  Backbone.history.start({
    pushState: true
  });
});
