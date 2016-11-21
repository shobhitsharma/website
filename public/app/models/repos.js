import Backbone from 'backbone';
import Repos from '../data/repos.json';

export default class ReposModel extends Backbone.Model {

  initialize () {
    this.set({
      teaser: Repos.sort(function (a, b) {
        return new Date(b.updated_at) - new Date(a.updated_at) ;
      }).slice(0, 7),
      all: Repos
    });
  }

}
