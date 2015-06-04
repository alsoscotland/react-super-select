var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    markdownToJson = require('gulp-markdown-to-json'),
    minifyCss = require('gulp-minify-css'),
    reactify = require('reactify'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence'),
    shell = require('gulp-shell');

module.exports = function(gulp, config) {

  gulp.task('build:docs', function() {
    runSequence('docs_clean',
                'docs_annotate_source',
                'docs_add_version',
                'docs_markdown',
                'docs_js_unbundled',
                'docs_files',
                'docs_fonts',
                'docs_images',
                'docs_less-compile',
                'docs_css',
                'docs_css-vendor',
                'test_page_js_bundled',
                'live_examples_js_bundled',
                'docs_js_bundled');
  });

  // Version Printer Component, leveraged by documentation pages
  var rssversion = JSON.parse(require('fs').readFileSync('./package.json')).version;
  var rssversionVar = 'var RSS_VERSION = \\"' + rssversion + '\\";';
  var rssVersionShellCmd = 'echo "' + rssversionVar +'"|cat - ./scripts/support/version-printer-base.txt > ./tmp/version_tmp && mv ./tmp/version_tmp '+ config.documentation.version_printer;
  gulp.task('docs_add_version', shell.task([rssVersionShellCmd]));

  // Generate Annotated Source documentation with docco
  gulp.task('docs_annotate_source', shell.task([
    'source ./scripts/docco_clean.sh',
    'source ./scripts/docco_build.sh',
    'source ./scripts/copy_docco_docs.sh',
    'source ./scripts/docco_clean.sh'
  ]));

  // clean docs
  gulp.task('docs_clean', function(done) {
    del(config.documentation.clean, done);
  });

  gulp.task('docs_js_bundled', function() {
    return gulp.src(config.documentation.docs_bundle)
          .pipe(browserify({
            transform: [reactify]
          }))
          .on('error', gutil.log)
          .pipe(rename('r-ss-docs-bundle.js'))
          .pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('live_examples_js_bundled', function() {
    return gulp.src(config.documentation.live_examples_bundle)
          .pipe(browserify({
            transform: [reactify]
          }))
          .on('error', gutil.log)
          .pipe(rename('r-ss-live-examples-bundle.js'))
          .pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('test_page_js_bundled', function() {
    return gulp.src(config.documentation.test_page_bundle)
          .pipe(browserify({
            transform: [reactify]
          }))
          .on('error', gutil.log)
          .pipe(rename('test-page-app.js'))
          .pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('docs_js_unbundled', function() {
    var stream = gulp.src(config.documentation.js_unbundled);
    return stream.pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('docs_less-compile', function () {
      return gulp.src(config.documentation.less.files)
          .pipe(less())
          .pipe(rename("react-super-select.css"))
          .pipe(gulp.dest(config.documentation.less.dest));
  });

  gulp.task('docs_css', function() {
    return gulp.src(config.documentation.css)
      .pipe(minifyCss())
      .pipe(concat('examples-app.css'))
      .pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('docs_css-vendor', function() {
    var stream = gulp.src(config.documentation.css_vendor);
    return stream.pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('docs_files', function() {
    var stream = gulp.src(config.documentation.example.files);
    return stream.pipe(gulp.dest(config.documentation.example.dist));
  });

  gulp.task('docs_fonts', function() {
    var stream = gulp.src(config.documentation.fonts.files);
    return stream.pipe(gulp.dest(config.documentation.fonts.dist));
  });

  gulp.task('docs_images', function() {
    var stream = gulp.src(config.documentation.img.files);
    return stream.pipe(gulp.dest(config.documentation.img.dist));
  });

  gulp.task('docs_markdown', function() {
    var stream = gulp.src(config.documentation.markdown.files);
    stream.pipe(markdownToJson({
      pedantic: true,
      smartypants: true,
      gfm: true
    }))
    .pipe(gulp.dest(config.documentation.markdown.dest));
  });

};
