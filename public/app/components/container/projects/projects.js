import $ from 'jquery';
import Backbone from 'backbone';
import Template from './projects.hbs';
import Repos from '../../../data/repos.json';

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
      <a class="repo-info" href="` + this.model.get('html_url') + `" target="_blank">
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

    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.empty().append(Template(this.model.toJSON()));
    const $list = this.$('.repos');

    Repos.forEach((repo) => {
      let repoView = new RepoView({
        model: new Backbone.Model(repo)
      });

      $list.append(repoView.render().el);
    });

    return this;
  }

}
