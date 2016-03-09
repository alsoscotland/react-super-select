/*
 * This file controls the behaviour of the build tasks in gulpfile.js
 */

var COMPONENT_NAME = 'react-super-select';

// Read the package.json to detect the package name and dependencies
var pkg = JSON.parse(require('fs').readFileSync('./package.json'));

module.exports = {

  component: {
    file: COMPONENT_NAME + '.js',
    js: './src/react-super-select.js',
    less: './src/react-super-select.less',
    name: COMPONENT_NAME,
    lib: 'lib',
    src: 'src',
    pkgName: pkg.name,
    lint: {
      js: [
        './src/**/*-spec.js',
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
      'docs_generated/*'
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
    css: [
      './lib/react-super-select.css',
      './src_docs/**/*.css',
      '!./src_docs/stylesheets/docco.css'
    ],
    less: {
      files: './src/app.less',
      dest: './src_docs/stylesheets'
    },
    css_vendor: ['./src_docs/stylesheets/docco.css'],
    lint: {
      js: [
        './src_docs/all-*.js'
      ]
    },
    markdown: {
      files: ['./src_docs/markdown/**/*.md'],
      dest: './src_docs/markdown/js'
    },
    fonts: {
      files: 'src_docs/fonts/*',
      dist: 'docs_generated/public/fonts'
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
