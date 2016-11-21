import Backbone from 'backbone';

export default class PostsModel extends Backbone.Model {

  get defaults() {
    return {};
  }

  get url() {
    return '/api/1/posts';
  }

  parse(data) {
    return data || [];
  }

}
