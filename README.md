# shobh.it

### Development

To get started and setup for development environment:

```shell
# Install basic dependencies
$ npm install

# Watches changes in `public` and reloads through browserify
$ gulp
```

To build a minified version of the application (production mode) simply run:

```shell
# Express implementation
$ npm start

# Minifies and Creates `dist`
$ gulp build
```

### Testing

The spec suits and view tests are written with mocha assertions and sinon stubs.

```
$ npm test
```

### Resources

 * ECMAScript 6 - [Babel](https://babeljs.io/)
 * [Browserify](http://browserify.org)
 * [Gulp](http://gulpjs.com)
 * [Handlebars](http://handlebarsjs.com)
 * [less.js](http://lesscss.org)
 * [Autoprefixer](https://github.com/postcss/autoprefixer)
 * [Browsersync](http://www.browsersync.io)
