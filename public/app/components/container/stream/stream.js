import Backbone from 'backbone';
import Template from './stream.hbs';

export default class StreamView extends Backbone.View {

  get className() {
    return 'streams';
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
