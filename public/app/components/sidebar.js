import $ from 'jquery';
import Backbone from 'backbone';
import Hello from '../data/hello.json';

export default class SidebarView extends Backbone.View {

  get className() {
    return 'sidebar';
  }

  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change:sidebar', this.render);
  }

  template() {
    let locale = window.navigator.language || 'en-US';
    locale = locale.split('-');
    let hello = locale.length ? Hello[(locale[1] || 'us').toUpperCase()] : Hello.US;

    return `
      <div class="profile">
        <div class="user">
          <img class="image" src="/assets/shobhit.png"/>
        </div>
        <div class="info">
          <h1 class="name">` + hello + `.<br/>I'm Shobhit.</h1>
          <h4 class="description">I write code. I play guitar. I wander avidly.</h4>
        </div>
        <div class="dev-badges">
          <span class="devicons devicons-javascript_badge"></span>
          <span class="devicons devicons-nodejs_small"></span>
          <span class="devicons devicons-npm"></span>
          <span class="devicons devicons-swift"></span>
          <span class="devicons devicons-gulp"></span>
          <span class="devicons devicons-java"></span>
          <span class="devicons devicons-go"></span>
          <span class="devicons devicons-less"></span>
          <span class="devicons devicons-linux"></span>
        </div>
      </div>
    `;
  }

  render() {
    this.$el.empty().append(this.template(this.model.toJSON()));

    return this;
  }

}
