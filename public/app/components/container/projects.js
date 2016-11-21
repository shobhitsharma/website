import Backbone from 'backbone';
import ReposModel from '../../models/repos.js';

class RepoView extends Backbone.View {

  get className() {
    return 'repo';
  }

  constructor(options) {
    super(options);
    this.render();
  }

  render() {
    let language = (this.model.get('language') || 'default').toLowerCase();

    this.$el.empty().append(`
      <a class="item" href="` + this.model.get('html_url') + `" target="_blank">
        <div class="details">
          <h2 class="name">` + this.model.get('name') + `</h2>
          <h4 class="description">` + this.model.get('description') + `</h4>
          <div class="langs">
            <span class="badge devicons devicons-` + (language || 'github_badge') + `"></span>
          </div>
        </div>
      </a>
    `);

    return this;
  }
}

export default class ProjectsView extends Backbone.View {

  get className() {
    return 'projects';
  }

  constructor(options) {
    super(options);

    this.model = new ReposModel();

    this.model.on('change', this.build, this);
  }

  template() {
    return `<div class="content-item">
      <h2 class="title">Projects</h2>
      <div class="repos"></div>
    </div>`;
  }

  render(teaser) {
    this.$el.empty().append(this.template());

    this.teaser = !!teaser;

    this.build();

    return this;
  }

  build() {
    console.debug('container', 'projects', this.model);
    const $list = this.$('.repos');
    const repositories = this.model.attributes || [];

    if (this.teaser) {
      repositories.teaser.forEach((repo, index) => {
        let repoView = new RepoView({
          model: new Backbone.Model(repo)
        });

        $list.append(repoView.render().el);
      });

      $list.append('<a class="button" href="/projects">View Projects</a>');
    } else {
      repositories.all.forEach((repo) => {
        let repoView = new RepoView({
          model: new Backbone.Model(repo)
        });

        $list.append(repoView.render().el);
      });
    }
  }

}
