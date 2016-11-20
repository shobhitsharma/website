import Backbone from 'backbone';

import SidebarView from './sidebar.js';
import ContentView from './content.js';

export default class MainView extends Backbone.View {

  get id() {
    return 'shobhit';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty();

    this.$el.append(
      new SidebarView({
        model: this.model
      }).render().el
    );

    this.$el.append(
      new ContentView({
        model: this.model
      }).render().el
    );

    return this;
  }

}
