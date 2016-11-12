import Backbone from 'backbone';

import ProjectsView from './projects/projects.js';
import BlogView from './blog/blog.js';
import ErrorView from './error/error.js';

export default class ContainerView extends Backbone.View {

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(`<div class="content"></div>`);

    this.view = new ProjectsView({
      el: this.$('.content'),
      model: this.model
    }).render();

    return this;
  }

}
