import Backbone from 'backbone';

import SidebarView from './sidebar/sidebar.js';
import ContentView from './content/content.js';


export default class ContainerView extends Backbone.View {

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(`
      <div class="sidebar"></div>
      <div class="content"></div>
    `);

    this.sidebarView = new SidebarView({
      el: this.$('.sidebar'),
      model: this.model
    }).render();

    this.contentView = new ContentView({
      el: this.$('.content'),
      model: this.model
    }).render();

    return this;
  }

}
