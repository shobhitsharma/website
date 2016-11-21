import Backbone from 'backbone';

import ProjectsView from './projects.js';
import BlogView from './blog.js';
import ErrorView from './error.js';

export default class ContainerView extends Backbone.View {

  constructor(options) {
    super(options);
  }

  render() {
    this.$el.empty().append(`<div class="content"></div>`);

    this.build();

    return this;
  }

  build() {
    console.debug('container', 'main', this.model);
    const view = this.model.get('content');

    this.views = {
      projects: new ProjectsView(),
      blog: new BlogView()
    };

    this.$('.content').empty();

    if (this.views[view]) {
      this.$('.content').append(this.views[view].render().el);
    } else if (view === 'default') {
      this.$('.content').append(this.views.projects.render(true).el);
      this.$('.content').append(this.views.blog.render(true).el);
    } else {
      this.$('.content').append(new ErrorView().render().el);
    }
  }

}
