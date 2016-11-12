import Backbone from 'backbone';
import Template from './pricing.hbs';

export default class PricingView extends Backbone.View {

  get className() {
    return 'pricing';
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
