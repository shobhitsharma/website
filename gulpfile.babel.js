'use strict';

import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import gzip from 'gulp-gzip';
import image from 'gulp-image';
import rename from 'gulp-rename';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
import sequence from 'run-sequence';
import history from 'connect-history-api-fallback';
import LessCleanCSS from 'less-plugin-clean-css';
import LessAutoprefixPlugin from 'less-plugin-autoprefix';

dotenv.config();

const settings = {
  ENV: process.env.NODE_ENV || 'development', // NODE_ENV
  PORT: parseInt(process.env.DEV_PORT || 3001), // Development server port
  SRC_DIR: 'public/', // Relative paths to sources and output directories
  BUILD_DIR: process.env.BUILD || 'dist/',
  src: function (path) {
    return this.SRC_DIR + path;
  },
  dest: function (path) {
    return this.BUILD_DIR + path;
  }
};

const reload = browserSync.reload;
const lessAutoprefixPlugin = new LessAutoprefixPlugin({
  browsers: '> 1%'
});

sequence.use(gulp);

function onError(err) {
  gutil.log(err.message);
  process.exit(1);
}

/*
 * $ gulp scripts
 *
 * Uses browserify to minify files
 */
gulp.task('scripts', () => {
  let bundler = browserify({
    entries: settings.src('app/index.js'),
    debug: true
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
    .pipe(gulpif(settings.ENV === 'production', gzip()))
    .pipe(gulp.dest(settings.dest('js')))
    .pipe(reload({
      stream: true
    }));
});

/*
 * $ gulp styles
 *
 * Managing less, autoprefixers and css cleanup
 */
gulp.task('styles', () => {
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
    .pipe(gulpif(settings.ENV === 'production', gzip()))
    .pipe(gulp.dest(settings.dest('css')))
    .pipe(reload({
      stream: true
    }));
});

/**
 * $ gulp html
 *
 * Interpolates index
 */
gulp.task('html', () => {
  return gulp.src(settings.src('index.html'))
    .pipe(gulp.dest(settings.BUILD_DIR))
    .pipe(reload({
      stream: true
    }));
});

/**
 * $ gulp assets
 *
 * Optimize and manipulate assets
 */
gulp.task('assets', () => {
  return gulp.src(settings.src('assets/**/*'))
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10
    }))
    .pipe(gulpif(settings.ENV !== 'production', gulp.dest(settings.src('assets'))))
    .pipe(gulpif(settings.ENV === 'production', gulp.dest(settings.dest('assets'))));
});

/**
 * $ gulp nodemon
 *
 * Start node server and watches backend
 */
gulp.task('nodemon', (cb) => {
  var called = false;
  return nodemon({
      script: 'bin/www',
      ignore: [
        'gulpfile.babel.js',
        'node_modules/'
      ]
    })
    .on('start', () => {
      if (!called) {
        called = true;
        cb();
      }
    });
});

/**
 * $ gulp server
 *
 * Start webserver and activate watchers
 */
gulp.task('server', ['build', 'nodemon'], (cb) => {
  browserSync({
    port: settings.PORT,
    server: {
      baseDir: settings.BUILD_DIR,
      middleware: [history()]
    }
  });
  gulp.watch(settings.src('app/**/*.js'), ['scripts']);
  gulp.watch(settings.src('styles/**/*.less'), ['styles']);
  gulp.watch(settings.src('index.html'), ['html']);
});

/**
 * $ gulp build
 *
 * Minifies scripts, styles and assets
 */
gulp.task('build', (done) => {
  var tasks = ['scripts', 'styles', 'html'];

  if (settings.ENV === 'production') {
    tasks.push('assets');
  }

  return sequence(tasks, done);
});

/**
 * $ gulp
 *
 * Default task runner and watchman
 */
gulp.task('default', ['server']);
