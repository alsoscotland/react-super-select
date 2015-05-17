var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    shell = require('gulp-shell'),
    initGulpTasks = require('react-component-gulp-tasks'),
    recess = require('gulp-recess'),
    less = require('gulp-less'),

    // examples files generation dependency requires below
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gutil = require('gulp-util'),
    markdownToJson = require('gulp-markdown-to-json'),
    minifyCss = require('gulp-minify-css'),
    reactify = require('reactify'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence');

var paths = {
  js: ['./src/*.js'],
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
gulp.task('lint-js', ['jsx'], function() {
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
        }));
});

gulp.task('less-compile', function () {
    return gulp.src(paths.lint.css)
        .pipe(less())
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

gulp.task('watch:examples-lint', function() {
  runSequence(  'jsx',
                'lint-js',
                'build:example:files',
                'lint-less',
                'less-compile',
                'watch:example:scripts',
                function() {
                  gulp.watch([paths.lint.js], ['lint-js']);
                  gulp.watch([paths.lint.css], ['lint-less', 'build:example:css']);
                  gulp.watch(config.example.files.map(function(i) { return config.example.src + '/' + i; }), ['build:example:files']);
                });
});

gulp.task('rssdev', function() {
  runSequence(  'dev:server',
                'docs_watch',
                'watch:examples-lint');
});

// DOCS RELATED GULP TASKS BELOW
var documentation_paths = {
  docs_bundle: [
    './src_docs/index-bundle.js'
  ],
  live_examples_bundle: [
    './src_docs/live-examples-app.js'
  ],
  test_page_bundle: [
    './src_docs/test-page-app.js'
  ],
  js_unbundled: [
    './src_docs/scale.fix.js',
  ],
  super_selects_js: './src_docs/super-selects/**/*.js',
  css: ['./src_docs/**/*.css', '!./src_docs/stylesheets/docco.css'],
  less: {
    files: './src/app.less',
    dest: './src_docs/stylesheets'
  },
  css_vendor: ['./src_docs/stylesheets/docco.css'],
  lint: {
    js: [
      './tmp_docs/jsx/**/*.js'
    ]
  },
  markdown: {
    files: ['./src_docs/markdown/**/*.md'],
    dest: './src_docs/markdown/js'
  },
  fonts: {
    files: 'src_docs/fonts/*',
    dist: 'docs_generated/fonts'
  },
  img: {
    files: 'src_docs/images/*',
    dist: 'docs_generated/images'
  },
  example: {
    src: 'src_docs',
    dist: 'docs_generated',
    files: [
      './src_docs/index.html',
      './src_docs/annotated-source.html',
      './src_docs/react-super-select-examples.html',
      './src_docs/test-page.html'
    ]
  },
  version_printer: './src_docs/version-printer.js'
};

var rssversion = JSON.parse(require('fs').readFileSync('./package.json')).version;
var rssversionVar = 'var RSS_VERSION = \\"' + rssversion + '\\";';
var rssVersionShellCmd = 'echo "' + rssversionVar +'"|cat - ./scripts/support/version-printer-base.txt > ./tmp/version_tmp && mv ./tmp/version_tmp '+ documentation_paths.version_printer;
gulp.task('docs_add_version', shell.task([rssVersionShellCmd]));

gulp.task('docs_annotate_source', shell.task([
  'source ./scripts/docco_clean.sh',
  'source ./scripts/docco_build.sh',
  'source ./scripts/copy_docco_docs.sh',
  'source ./scripts/docco_clean.sh'
]));

gulp.task('docs_clean', function(done) {
  del(['./src_docs/markdown/js/**/*', 'docs_generated/*', 'tmp_docs/cache', 'tmp_docs/jsx*'], done);
});

gulp.task('docs_jsx', function() {
  return gulp.src(['./gulpfile.js'], { read: false })
    .pipe(shell(['$(npm bin)/jsx ./src_docs/ tmp_docs/jsx --cache-dir tmp_docs/jsx-cache']));
});

gulp.task('docs_lint-js', ['jsx'], function() {
  return gulp.src(documentation_paths.lint.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('docs_js_bundled', function() {
  return gulp.src(documentation_paths.docs_bundle)
        .pipe(browserify({
          transform: [reactify]
        }))
        .on('error', gutil.log)
        .pipe(rename('r-ss-docs-bundle.js'))
        .pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('live_examples_js_bundled', function() {
  return gulp.src(documentation_paths.live_examples_bundle)
        .pipe(browserify({
          transform: [reactify]
        }))
        .on('error', gutil.log)
        .pipe(rename('r-ss-live-examples-bundle.js'))
        .pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('test_page_js_bundled', function() {
  return gulp.src(documentation_paths.test_page_bundle)
        .pipe(browserify({
          transform: [reactify]
        }))
        .on('error', gutil.log)
        .pipe(rename('test-page-app.js'))
        .pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('docs_js_unbundled', function() {
  var stream = gulp.src(documentation_paths.js_unbundled);
  return stream.pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('docs_less-compile', function () {
    return gulp.src(documentation_paths.less.files)
        .pipe(less())
        .pipe(rename("react-super-select.css"))
        .pipe(gulp.dest(documentation_paths.less.dest));
});

gulp.task('docs_css', function() {
  return gulp.src(documentation_paths.css)
    .pipe(minifyCss())
    .pipe(concat('examples-app.css'))
    .pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('docs_css-vendor', function() {
  var stream = gulp.src(documentation_paths.css_vendor);
  return stream.pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('docs_files', function() {
  var stream = gulp.src(documentation_paths.example.files);
  return stream.pipe(gulp.dest(documentation_paths.example.dist));
});

gulp.task('docs_fonts', function() {
  var stream = gulp.src(documentation_paths.fonts.files);
  return stream.pipe(gulp.dest(documentation_paths.fonts.dist));
});

gulp.task('docs_images', function() {
  var stream = gulp.src(documentation_paths.img.files);
  return stream.pipe(gulp.dest(documentation_paths.img.dist));
});

gulp.task('docs_markdown', function() {
  var stream = gulp.src(documentation_paths.markdown.files);
  stream.pipe(markdownToJson({
    pedantic: true,
    smartypants: true,
    gfm: true
  }))
  .pipe(gulp.dest(documentation_paths.markdown.dest));
});

gulp.task('docs_watch', [
  'docs_jsx',
  'docs_lint-js',
], function() {
  gulp.watch([documentation_paths.docs_bundle], ['docs_jsx']);
  gulp.watch([documentation_paths.live_examples_bundle], ['docs_jsx']);
  gulp.watch([documentation_paths.lint.js], ['docs_lint-js']);
  gulp.watch([documentation_paths.css], ['docs_css']);
  gulp.watch([documentation_paths.markdown.files], ['docs_markdown']);
  gulp.watch([documentation_paths.example.files], ['docs_files']);
});

gulp.task('docs_build', function() {
  runSequence('docs_clean',
              'docs_annotate_source',
              'docs_add_version',
              'docs_files',
              'docs_markdown',
              'docs_js_unbundled',
              'live_examples_js_bundled',
              'test_page_js_bundled',
              'docs_fonts',
              'docs_images',
              'docs_less-compile',
              'docs_css',
              'docs_css-vendor',
              'docs_js_bundled');
});
