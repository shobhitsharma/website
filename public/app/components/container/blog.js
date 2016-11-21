import Backbone from 'backbone';
import PostsModel from '../../models/posts.js';

class PostView extends Backbone.View {

  get className() {
    return 'post';
  }

  constructor(options) {
    super(options);
    this.render();
  }

  render() {
    let description = (this.model.get('content') || {}).subtitle;

    this.$el.empty().append(`
      <a class="item" href="https://medium.com/@sh0bhit/` + this.model.get('uniqueSlug') + `" target="_blank">
        <div class="details">
          <h2 class="name">` + this.model.get('title') + `</h2>
          <h4 class="description">` + description + `</h4>
        </div>
      </a>
    `);

    return this;
  }
}

export default class BlogView extends Backbone.View {

  get className() {
    return 'blog';
  }

  constructor(options) {
    super(options);

    this.model = new PostsModel();

    this.model.on('change', this.build, this);
  }

  template() {
    return `<div class="content-item">
      <h2 class="title">Blog</h2>
      <div class="posts"></div>
    </div>`;
  }

  render(teaser) {
    this.$el.empty().append(this.template());

    this.teaser = !!teaser;

    this.model.fetch();

    return this;
  }

  build() {
    console.debug('container', 'blog', this.model);
    const $list = this.$('.posts');
    const posts = this.model.attributes || [];

    if (this.teaser) {
      Object.keys(posts).forEach((post, index) => {
        let postView = new PostView({
          model: new Backbone.Model(posts[post])
        });

        $list.append(postView.render().el);
      });

      $list.append('<a class="button" href="/blog">View Posts</a>');
    } else {
      Object.keys(posts).forEach((post) => {
        let postView = new PostView({
          model: new Backbone.Model(posts[post])
        });

        $list.append(postView.render().el);
      });
    }
  }

}
