import Backbone from 'backbone';

export default class Router extends Backbone.Router {

  get routes() {
    return {
      '(/)': 'default',
      'home': 'home',
      'developers': 'developers',
      'pricing': 'pricing',
      'registration': 'registration',
      '*error': 'error'
    };
  }

  initialize() {
    // TODO: not yet implemented
  }

  default (path = '') {
    // TODO: not yet implemented
  }

  home() {
    console.log('Docs Module')
  }

  developers() {
    console.log('developers Module')
  }

  pricing() {
    console.log('pricing Module')
  }

  registration() {
    console.log('registration Module')
  }

  error() {
    console.log('Error')
  }

}
