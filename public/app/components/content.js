import $ from 'jquery';
import Backbone from 'backbone';
import ContainerView from './container/main.js';

export default class ContentView extends Backbone.View {

  get className() {
    return 'container';
  }

  constructor(options) {
    super(options);

    this.model.on('change:content', this.build, this);
  }

  render() {
    this.$el.empty();

    return this;
  }

  build() {
    this.$el.append(
      new ContainerView({
        model: this.model
      }).render().el
    );
  }

}
