var shell = require('gulp-shell');

module.exports = function(gulp) {

  gulp.task('component_jsx', function() {
    return gulp.src(['./gulpfile.js'], { read: false })
      .pipe(shell(['$(npm bin)/jsx ./src/ tmp/jsx --cache-dir tmp/jsx-cache']));
  });

  gulp.task('docs_jsx', function() {
    return gulp.src(['./gulpfile.js'], { read: false })
      .pipe(shell(['$(npm bin)/jsx ./src_docs/ tmp_docs/jsx --cache-dir tmp_docs/jsx-cache']));
  });


  var jsxTasks = ['component_jsx', 'docs_jsx'];

  gulp.task('jsx', jsxTasks);

};
