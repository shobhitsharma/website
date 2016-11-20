import Backbone from 'backbone';

export default class ErrorView extends Backbone.View {

  get className() {
    return 'error';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  template () {
    return `<div class="container">404 NOT FOUND</div>`;
  }

  render() {
    this.$el.empty().append(this.template(this.model.toJSON()));

    return this;
  }

}
