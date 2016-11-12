import Backbone from 'backbone';

export default class Router extends Backbone.Router {

  get routes() {
    return {
      '(/)': 'default',
      'blog(/)': 'blog',
      'blog/:postId': 'blog',
      'projects(/)(/:project)': 'projects',
      '*error': 'error'
    };
  }

  initialize() {}

  default (path = '') {
    console.debug('router', 'index');
  }

  blog() {
    console.debug('router', 'blog');
  }

  projects() {
    console.debug('router', 'projects');
  }

  error() {
    console.debug('router', 'error');
  }

}
