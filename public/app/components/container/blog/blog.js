import Backbone from 'backbone';
import Template from './blog.hbs';

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

  render() {
    this.$el.empty().append(Template(this.model.toJSON()));

    return this;
  }

}
