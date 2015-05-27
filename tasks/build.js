var runSequence = require('run-sequence');

module.exports = function(gulp) {

  gulp.task('build', function() {
    runSequence('jsx',
                'build:docs',
                'build:dist',
                'build:lib');
  });

};
