import Backbone from 'backbone';
import Controller from './controller';

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
    Controller.set({
      content: 'default'
    });
  }

  blog() {
    console.debug('router', 'blog');
    Controller.set({
      content: 'blog'
    });
  }

  projects() {
    console.debug('router', 'projects');
    Controller.set({
      content: 'projects'
    });
  }

  error() {
    console.debug('router', 'error');
    Controller.set({
      content: 'error'
    });
  }

}
