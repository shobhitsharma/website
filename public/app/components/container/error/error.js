import Backbone from 'backbone';
import Template from './error.hbs';

export default class ErrorView extends Backbone.View {

  get className() {
    return 'error';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(Template(this.model.toJSON()));

    return this;
  }

}
