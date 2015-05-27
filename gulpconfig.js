/*
 * This file controls the behaviour of the build tasks in gulpfile.js
 */

var COMPONENT_NAME = 'react-super-select';

// Read the package.json to detect the package name and dependencies
var pkg = JSON.parse(require('fs').readFileSync('./package.json'));

// Default dependencies from package.json, except reactify (which is used for
// the build). Dependencies can be customised by hard-coding this array.
var dependencies = [];
Object.keys(pkg.dependencies).forEach(function(i) {
  if (i !== 'reactify') dependencies.push(i);
});

module.exports = {

  component: {
    example: {
      dist: 'example/dist'
    },
    file: COMPONENT_NAME + '.js',
    less: './src/react-super-select.less',
    name: COMPONENT_NAME,
    lib: 'lib',
    src: 'src',
    dist: 'dist',
    pkgName: pkg.name,
    dependencies: dependencies,
    lint: {
      js: [
        './src/**/*-spec.js',
        './tmp/jsx/**/*.js',
        'gulpfile.js'
      ],
      less: [
        './src/react-super-select.less'
      ]
    }
  },

  tasks: {
    lint: {
      js: [
        './tasks/*.js'
      ]
    }
  },

  documentation: {
    clean: [
      './src_docs/markdown/js/**/*',
      'docs_generated/*',
      'tmp_docs/cache',
      'tmp_docs/jsx*'
    ],
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
    css: ['./src_docs/**/*.css', '!./src_docs/stylesheets/docco.css'],
    less: {
      files: './src/app.less',
      dest: './src_docs/stylesheets'
    },
    css_vendor: ['./src_docs/stylesheets/docco.css'],
    lint: {
      js: [
        './src_docs/all-*.js',
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
      dist: 'docs_generated',
      files: [
        './src_docs/index.html',
        './src_docs/annotated-source.html',
        './src_docs/react-super-select-examples.html',
        './src_docs/test-page.html'
      ]
    },
    version_printer: './src_docs/version-printer.js'
  }

};
