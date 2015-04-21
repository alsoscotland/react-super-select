var browserify = require('gulp-browserify'),
    gulp = require('gulp'),
    del = require('del'),
    minifyCss = require('gulp-minify-css'),
    reactify = require('reactify'),
    rename = require('gulp-rename'),
    runSequence = require('gulp-run-sequence'),
    shell = require('gulp-shell'),
    source = require('vinyl-source-stream'),
    // transform = require('vinyl-transform'),
    jshint = require('gulp-jshint');

var paths = {
  main: './src/examples-app.js',
  js: ['./src/**/*.js'],
  css: ['./stylesheets/**/*.css'],
  lint: {
    js: [
      './tmp/jsx/**/*.js',
      'gulpfile.js'
    ]
  },
  example: {
    src: 'src',
    dist: 'example/',
    files: [
      './src/annotated-source.html',
      './src/react-super-select-examples.html'
    ],
    scripts: [
      'examples-app.js'
    ]
  }
};

gulp.task('clean', function(done) {
  del(['example/*', 'tmp/cache', 'tmp/jsx*'], done);
});

gulp.task('jsx', function() {
  return gulp.src(['./gulpfile.js'], { read: false })
    .pipe(shell(['$(npm bin)/jsx ./src/ tmp/jsx --cache-dir tmp/jsx-cache']));
});

gulp.task('lint-js', ['jsx'], function() {
  return gulp.src(paths.lint.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', function () {
  return gulp.src([paths.main])
   .pipe(browserify())
   .pipe(gulp.dest(paths.example.dist));
});

gulp.task('css', function() {
  var stream = gulp.src(paths.css)
    .pipe(rename('examples-app.css'))
    .pipe(minifyCss());
  return stream.pipe(gulp.dest('example/'));
});

gulp.task('files', function() {
  var stream = gulp.src(paths.example.files);
  return stream.pipe(gulp.dest('example/'));
});

gulp.task('watch', [
  'jsx',
  'lint-js',
], function() {
  gulp.watch([paths.js], ['jsx']);
  gulp.watch([paths.lint.js], ['lint-js']);
  gulp.watch([paths.css], ['css']);
  gulp.watch([paths.example.files], ['files']);
});

gulp.task('build', [
  'clean',
  'js',
  'css',
  'files'
]);

