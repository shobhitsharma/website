import Backbone from 'backbone';
import Template from './header.hbs';

export default class HeaderView extends Backbone.View {

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(Template(this.model.toJSON()));

    return this;
  }

}
