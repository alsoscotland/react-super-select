var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    shell = require('gulp-shell'),
    initGulpTasks = require('react-component-gulp-tasks'),
    recess = require('gulp-recess');

var paths = {
  js: ['./src/**/*.js'],
  lint: {
    js: [
      './src/**/*-spec.js',
      './tmp/jsx/**/*.js',
      'gulpfile.js'
    ],
    css: [
      './src/app.less'
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

gulp.task('lint-less', function () {
    return gulp.src(paths.lint.css)
        .pipe(recess({
          strictPropertyOrder: false,
          noIDs: true,
          noJSPrefix: true,
          noOverqualifying: false,
          noUnderscores: true,
          noUniversalSelectors: false
        }))
        .pipe(recess.reporter({
          fail: false
        }))
        .pipe(gulp.dest('dist'));
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

gulp.task('watch:examples-lint', [
  'jsx',
  'lint-js-watch',
  'build:example:files',
  'lint-less',
  'watch:example:scripts'
], function() {
  gulp.watch(config.example.files.map(function(i) { return config.example.src + '/' + i; }), ['build:example:files']);
  gulp.watch([paths.lint.css], ['lint-less', 'build:example:css']);
});

gulp.task('devlint', [
  'dev:server',
  'watch:examples-lint'
]);

