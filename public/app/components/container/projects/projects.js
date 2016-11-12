import Backbone from 'backbone';
import Template from './projects.hbs';

export default class ProjectsView extends Backbone.View {

  get className() {
    return 'projects';
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
