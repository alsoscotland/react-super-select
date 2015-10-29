var babel = require('gulp-babel'),
    del = require('del'),
    less = require('gulp-less');

module.exports = function(gulp, config) {

  // clean is run via npm script

  gulp.task('build:lib:js', function() {
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
    gulp.task('build:lib:css', function() {
      return gulp.src(config.component.less)
        .pipe(less())
        .pipe(gulp.dest('lib'));
    });
    libTasks.push('build:lib:css');
  }

  gulp.task('build:lib-gulp-sequence', libTasks);

};
