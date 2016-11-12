import Backbone from 'backbone';
import Template from './developers.hbs';

export default class DevelopersView extends Backbone.View {

  get className() {
    return 'developers';
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
