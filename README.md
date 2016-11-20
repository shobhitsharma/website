# shobh.it Source

### Development

To get started and setup for development environment:

```shell
$ cp .env-sample .env # Modify configuration
$ npm start # Install basic dependencies and express starter
$ npm run develop # UI Development and Browserify instance
```

To build a minified version of the application (production mode) simply run:

```shell
$ npm run build # Minifies and creates `dist` for ship
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
