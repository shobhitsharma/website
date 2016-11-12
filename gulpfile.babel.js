'use strict';

import fs from 'fs';
import url from 'url';
import setup from 'config';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import hbsfy from 'hbsfy';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import LessAutoprefixPlugin from 'less-plugin-autoprefix';
import minifyCSS from 'gulp-minify-css';
import rename from 'gulp-rename';
import shell from 'gulp-shell';
import browserSync from 'browser-sync';
import sequence from 'run-sequence';
import history from 'connect-history-api-fallback';

const config = {
  PRODUCTION: true, // Production mode is disabled when running default task (dev mode)
  PORT: setup.port || 8080, // Development server port
  SRC_DIR: 'public/', // Relative paths to sources and output directories
  BUILD_DIR: 'dist/',
  src: function (path) {
    return this.SRC_DIR + path;
  },
  dest: function (path) {
    return this.BUILD_DIR + path;
  }
};

const lessAutoprefixPlugin = new LessAutoprefixPlugin({
  browsers: '> 1%'
});

sequence.use(gulp);

gulp.task('scripts', function () {
  let bundler = browserify({
    entries: config.src('app/index.js'),
    debug: true,
    transform: [hbsfy]
  });

  return bundler
    .transform(babelify, {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(
      gulpif(config.PRODUCTION, uglify())
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest('js')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(config.src('styles/index.less'), {
      base: '.'
    })
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(less({
      plugins: [lessAutoprefixPlugin]
    }))
    .pipe(
      gulpif(config.PRODUCTION, minifyCSS())
    )
    .pipe(rename('bundle.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest('css')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('assets', function () {
  // TODO: Optimize svg and images here
  return gulp.src(config.src('assets/**/*'))
    .pipe(gulp.dest(config.dest('assets')));
});

gulp.task('html', function () {
  return gulp.src(config.src('index.html'))
    .pipe(gulp.dest(config.BUILD_DIR))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/**
 * $ gulp dev
 *
 * Sets NODE_ENV variable
 */
gulp.task('dev', function () {
  config.PRODUCTION = false;
});

/**
 * $ gulp update
 *
 * Pulls latest commit and install dependencies
 */
gulp.task('update', function (done) {
  return gulp.src('/', {
      read: false
    })
    .pipe(shell([
      'git config --global pull.default current',
      'git fetch --all',
      'git pull',
      'npm install'
    ], done));
});

/**
 * $ gulp clean
 *
 * Cleans up previous `dist` directory
 */
gulp.task('clean', function (done) {
  return gulp.src('/', {
      read: false
    })
    .pipe(shell([
      'rm -rf dist/'
    ], done));
});

/**
 * $ gulp server
 *
 * Start webserver and activate watchers
 */
gulp.task('server', ['build'], function () {
  browserSync({
    port: config.PORT,
    server: {
      baseDir: config.BUILD_DIR,
      middleware: [history()]
    }
  });

  gulp.watch([config.src('app/**/*.js'), config.src('app/**/*.hbs')], ['scripts']);
  gulp.watch(config.src('styles/**/*.less'), ['styles']);
  gulp.watch(config.src('index.html'), ['html']);
});

/**
 * $ gulp build
 *
 * Minifies scripts, styles and assets
 */
gulp.task('build', function (done) {
  return sequence('clean', 'scripts', 'styles', 'assets', 'html', done);
});

/**
 * $ gulp deploy
 *
 * Pulls latest code, cleans and minifies
 */
gulp.task('deploy', function (done) {
  return sequence('update', 'clean', 'build', done);
});

/**
 * $ gulp
 *
 * Default task runner and watchman
 */
gulp.task('default', ['dev', 'server']);
