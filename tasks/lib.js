var babel = require('gulp-babel'),
    del = require('del'),
    less = require('gulp-less');

module.exports = function(gulp, config) {

  gulp.task('clean:lib', function(done) {
    del([config.component.lib], done);
  });

  gulp.task('build:lib:js', ['clean:lib'], function() {
    return gulp.src([
        config.component.src + '/**/*.js',
        '!**/__tests__/**/*'
      ])
      .pipe(babel({
        plugins: [require('babel-plugin-object-assign')]
      }))
      .pipe(gulp.dest(config.component.lib));
  });

  var libTasks = ['build:lib:js'];

  if (config.component.less) {
    gulp.task('build:lib:css', ['clean:lib'], function() {
      return gulp.src(config.component.less)
        .pipe(less())
        .pipe(gulp.dest('lib'));
    });
    libTasks.push('build:lib:css');
  }

  gulp.task('build:lib', libTasks);

};
