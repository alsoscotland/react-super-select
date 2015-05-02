var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    del = require('del'),
    markdownToJson = require('gulp-markdown-to-json'),
    minifyCss = require('gulp-minify-css'),
    shell = require('gulp-shell'),
    jshint = require('gulp-jshint');

var paths = {
  main: ['./src/examples-app.js', './src/props-app.js', './src/keyboard-navigation-app.js', './javascripts/scale.fix.js'],
  js: ['./src/**/*.js'],
  css: ['./src/**/*.css', '!./src/stylesheets/docco.css'],
  css_vendor: ['./src/stylesheets/docco.css'],
  lint: {
    js: [
      './tmp/jsx/**/*.js',
      'gulpfile.js'
    ]
  },
  markdown: {
    files: ['./src/examples/markdown/**/*.md'],
    dest: './src/examples/markdown/js'
  },
  example: {
    src: 'src',
    dist: {
      html: 'example/',
      js: 'example/',
      css: './stylesheets/'
    },
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
  return gulp.src(paths.main)
   .pipe(browserify())
   .pipe(gulp.dest(paths.example.dist.js));
});

gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(minifyCss())
    .pipe(concat('examples-app.css'))
    .pipe(gulp.dest(paths.example.dist.css));
});

gulp.task('css-vendor', function() {
  var stream = gulp.src(paths.css_vendor);
  return stream.pipe(gulp.dest(paths.example.dist.css));
});

gulp.task('files', function() {
  var stream = gulp.src(paths.example.files);
  return stream.pipe(gulp.dest(paths.example.dist.html));
});

gulp.task('markdown', function() {
  var stream = gulp.src(paths.markdown.files);
  stream.pipe(markdownToJson({
    pedantic: true,
    smartypants: true,
    gfm: true
  }))
  .pipe(gulp.dest(paths.markdown.dest));
});

gulp.task('watch', [
  'jsx',
  'lint-js',
], function() {
  gulp.watch([paths.js], ['jsx']);
  gulp.watch([paths.lint.js], ['lint-js']);
  gulp.watch([paths.css], ['css']);
  gulp.watch([paths.markdown.files], ['markdown']);
  gulp.watch([paths.example.files], ['files']);
});

gulp.task('build', [
  'markdown',
  'clean',
  'js',
  'css',
  'css-vendor',
  'files'
]);

