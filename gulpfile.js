var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    shell = require('gulp-shell'),
    initGulpTasks = require('react-component-gulp-tasks');

var paths = {
  js: ['./src/**/*.js'],
  lint: {
    js: [
      '!./src/**/*.js',
      './src/**/*-spec.js',
      'tmp/jsx/**/*.js',
      'gulpfile.js'
    ]
  }
};

gulp.task('jsx', function() {
  return gulp.src(['./gulpfile.js'], { read: false })
    .pipe(shell(['$(npm bin)/jsx ./src/ tmp/jsx --cache-dir tmp/jsx-cache']));
});

// lint-js-watch mimics lint-js but will not stop watch process on error
gulp.task('lint-js-watch', ['jsx'], function() {
  return gulp.src(paths.lint.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['jsx', 'lint-js-watch']);
});

/**
 * Task configuration is loaded from config.js
 *
 * Make any changes to the source or distribution files
 * and directory configuration there
 */

var config = require('./gulpconfig');


/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */

initGulpTasks(gulp, config);
