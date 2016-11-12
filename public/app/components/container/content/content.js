import Backbone from 'backbone';
import Template from './content.hbs';

import StreamView from '../stream/stream.js';
import PricingView from '../pricing/pricing.js';
import DevelopersView from '../developers/developers.js';
import ProductsView from '../products/products.js';
import RegistrationView from '../registration/registration.js';
import ErrorView from '../error/error.js';

export default class ContentView extends Backbone.View {

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    let views = {
      stream: new StreamView({
        model: this.model
      }),
      pricing: new PricingView({
        model: this.model
      }),
      developers: new DevelopersView({
        model: this.model
      }),
      products: new ProductsView({
        model: this.model
      }),
      registration: new RegistrationView({
        model: this.model
      }),
      error: new ErrorView({
        model: this.model
      })
    };
    let module = this.model.get('module');
    let selected = views[module] || views.error;

    this.$el.empty().append(selected.render().el);

    return this;
  }

}
