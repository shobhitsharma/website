'use strict';

import $ from 'jquery';
import Backbone from 'backbone';

import Router from './router';
import Helper from './helper';
import Controller from './controller';
import MainView from './components/main.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(function (reg) {
    reg.onupdatefound = function () {
      var installingWorker = reg.installing;
      installingWorker.onstatechange = function () {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              console.debug('service-wroker', 'Content Upgraded');
            } else {
              console.debug('service-wroker', 'Content Offline');
            }
            break;
          case 'redundant':
            console.error('service-wroker', 'Redundant SW init');
            break;
        }
      };
    };
  }).catch(function (e) {
    console.error('Error during service worker registration:', e);
  });
}

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
