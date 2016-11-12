import Backbone from 'backbone';
import $ from 'jquery';

import HeaderView from './header/header.js';
import ContainerView from './container/main.js';

export default class MainView extends Backbone.View {

  get id() {
    return 'shobhit';
  }

  get events() {
    return {
      'click [data-module]': 'hanldeModule'
    };
  }

  constructor(options) {
    super(options);

    this.delegateEvents();
  }

  render() {
    this.$el.empty().append(`
      <div class="header"></div>
      <div class="container"></div>
    `);

    this.headerView = new HeaderView({
      el: this.$('.header'),
      model: this.model
    }).render();

    this.containerView = new ContainerView({
      el: this.$('.container'),
      model: this.model
    }).render();

    return this;
  }

  hanldeModule(e) {
    console.debug('main', 'hanldeModule', e);
    var module = $(e.currentTarget).attr('data-module');

    this.model.set({
      module: module
    });
  }

}
