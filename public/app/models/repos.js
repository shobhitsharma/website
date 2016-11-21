import Backbone from 'backbone';
import Repos from '../data/repos.json';

export default class ReposModel extends Backbone.Model {

  initialize () {
    this.set({
      teaser: Repos.sort(function (a, b) {
        return new Date(b.created_at) > new Date(a.created_at) ;
      }).slice(0, 5),
      all: Repos
    });
  }

}
