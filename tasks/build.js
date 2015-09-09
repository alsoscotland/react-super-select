var runSequence = require('run-sequence');

module.exports = function(gulp) {

  gulp.task('build', function() {
    runSequence('build:docs',
                'build:dist',
                'build:lib');
  });

};
