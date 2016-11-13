import $ from 'jquery';
import Backbone from 'backbone';
import Template from './projects.hbs';

class RepoView extends Backbone.View {

  get className() {
    return 'repo';
  }

  constructor(options) {
    super(options);
    this.render();
  }

  render() {

    console.log('>>>>>>', this.model)
    this.$el.empty().append(`
      <a class="repo-info" href="` + this.model.get('url') + `" target="_blank">
        <div class="details">
          <h2 class="name">` + this.model.get('name') + `</h2>
          <h4 class="description">` + this.model.get('description') + `</h4>
          <div class="langs">
            <span class="badge devicons devicons-javascript_badge"></span>
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
    var $list = this.$('.repos');

    // $.get('https://api.github.com/users/shobhitsharma/repos', function (data) {
    //   $list.empty();

    //   data.forEach(function (repo) {
    //     var repoView = new RepoView({
    //       model: new Backbone.Model(repo)
    //     });

    //     $list.append(repoView.render().el);
    //   });
    // });

    [
      {
        name: 'embedo',
        description: 'Embeds and adjusts facebook posts, tweets, videos, instagram easily',
        url: 'https://github.com/shobhitsharma/embedo',
        language: ['javascript']
      }
    ].forEach(function (repo) {
      var repoView = new RepoView({
        model: new Backbone.Model(repo)
      });

      $list.append(repoView.render().el);
    });

    return this;
  }

}
