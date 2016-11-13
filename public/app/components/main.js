import Backbone from 'backbone';

import SidebarView from './sidebar/sidebar.js';
import ContainerView from './container/main.js';

export default class MainView extends Backbone.View {

  get id() {
    return 'shobhit';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(`
      <div class="sidebar"></div>
      <div class="container"></div>
    `);

    this.sidebarView = new SidebarView({
      el: this.$('.sidebar'),
      model: this.model
    }).render();

    this.containerView = new ContainerView({
      el: this.$('.container'),
      model: this.model
    }).render();

    return this;
  }

}
