import Backbone from 'backbone';

export default class Controller extends Backbone.Model {

  get defaults() {
    return {
      state: 'default',
      sidebar: 'default',
      content: 'default'
    };
  }

}
