import Backbone from 'backbone';

export class Controller extends Backbone.Model {

  get defaults() {
    return {
      sidebar: null,
      content: null
    };
  }

}

export default new Controller();
