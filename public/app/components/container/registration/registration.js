import Backbone from 'backbone';
import Template from './registration.hbs';

export default class RegistrationView extends Backbone.View {

  get className() {
    return 'registration';
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
