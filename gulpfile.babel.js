'use strict';

import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import del from 'del';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import hbsfy from 'hbsfy';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import rename from 'gulp-rename';
import shell from 'gulp-shell';
import browserSync from 'browser-sync';
import sequence from 'run-sequence';
import history from 'connect-history-api-fallback';
import LessCleanCSS from 'less-plugin-clean-css';
import LessAutoprefixPlugin from 'less-plugin-autoprefix';

dotenv.config();

const settings = {
  ENV: process.env.NODE_ENV || 'development', // NODE_ENV
  PORT: process.env.PORT || 3000, // Development server port
  SRC_DIR: 'public/', // Relative paths to sources and output directories
  BUILD_DIR: process.env.BUILD || 'dist/',
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

function onError(err) {
  gutil.log(err.message);
  process.exit(1);
}

/*
 $ gulp clean
 */
gulp.task('clean', function (done) {
  del(['dist'], done);
});

gulp.task('scripts', function (done) {
  let bundler = browserify({
    entries: settings.src('app/index.js'),
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
      gulpif(settings.ENV === 'production', uglify({
        compress: {
          dead_code: true,
          drop_debugger: true,
          unused: true,
          warnings: true,
          drop_console: true
        }
      }))
    )
    .pipe(gulpif(settings.ENV !== 'production', sourcemaps.write('./')))
    .pipe(gulp.dest(settings.dest('js')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/*
 $ gulp styles
 */
gulp.task('styles', function () {
  var browsers = [
    'Android >= 2.3',
    'Chrome >= 20',
    'Firefox >= 24',
    'Explorer >= 8',
    'iOS >= 6',
    'Opera >= 12',
    'Safari >= 6'
  ];
  var autoprefix = new LessAutoprefixPlugin({
    browsers: browsers,
    map: true
  });
  var cleancss = new LessCleanCSS({
    advanced: true
  });

  return gulp.src(settings.src('styles/index.less'))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
      plugins: [cleancss, autoprefix]
    }).on('error', onError))
    .pipe(rename('bundle.css'))
    .pipe(gulpif(settings.ENV !== 'production', sourcemaps.write('./')))
    .pipe(gulp.dest(settings.dest('css')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('assets', function () {
  // TODO: Optimize svg and images here
  return gulp.src(settings.src('assets/**/*'))
    .pipe(gulp.dest(settings.dest('assets')));
});

gulp.task('html', function () {
  return gulp.src(settings.src('index.html'))
    .pipe(gulp.dest(settings.BUILD_DIR))
    .pipe(browserSync.reload({
      stream: true
    }));
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
    port: settings.PORT,
    server: {
      baseDir: settings.BUILD_DIR,
      middleware: [history()]
    }
  });

  gulp.watch([settings.src('app/**/*.js'), settings.src('app/**/*.hbs')], ['scripts']);
  gulp.watch(settings.src('styles/**/*.less'), ['styles']);
  gulp.watch(settings.src('index.html'), ['html']);
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
 * $ gulp
 *
 * Default task runner and watchman
 */
gulp.task('default', ['server']);
