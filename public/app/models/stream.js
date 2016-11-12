import Backbone from 'backbone';

export default class StreamModel extends Backbone.Model {

  get defaults() {
    return {
      selected: null
    };
  }

}
