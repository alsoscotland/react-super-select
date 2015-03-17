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
    file: COMPONENT_NAME + '.js',
    name: COMPONENT_NAME,
    src: 'src',
    dist: 'dist',
    pkgName: pkg.name,
    dependencies: dependencies
  },

  example: {
    src: 'src',
    dist: 'example/dist',
    files: [
      'index.html',
      'standalone.html'
    ],
    scripts: [
      'app.js'
    ],
    stylesheets: [
      'app.less'
    ]
  }

};
