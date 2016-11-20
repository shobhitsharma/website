import $ from 'jquery';
import Backbone from 'backbone';
import ContainerView from './container/main.js';

export default class ContentView extends Backbone.View {

  get className() {
    return 'container';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(
      new ContainerView({
        model: this.model
      }).render().el
    );

    return this;
  }

}
