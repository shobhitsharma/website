import Backbone from 'backbone';

class BlogPreview extends Backbone.View {

}

export default class BlogView extends Backbone.View {

  get className() {
    return 'blog';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  template () {
    return `<div class="container">Blog View</div>`;
  }

  render() {
    this.$el.empty().append(this.template(this.model.toJSON()));

    return this;
  }

}
