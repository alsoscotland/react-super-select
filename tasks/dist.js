// from react-component-gulp-tasks
// https://github.com/JedWatson/react-component-gulp-tasks
var babelify = require('babelify'),
    browserify = require('browserify'),
    exec = require('child_process').exec,
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    shim = require('browserify-shim'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify');

module.exports = function(gulp, config) {

  // clean is run via npm

  gulp.task('dist:build', function(cb) {
    exec('npm run dist:build', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });

  gulp.task('build:dist:scripts', function() {

    var standalone = browserify('./' + config.component.src + '/' + config.component.file, {
        standalone: config.component.name
      })
      .transform(babelify.configure({
        plugins: [require('babel-plugin-object-assign')]
      }))
      .transform(shim);

    config.component.dependencies.forEach(function(pkg) {
      standalone.exclude(pkg);
    });

    return standalone.bundle()
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source(config.component.pkgName + '.js'))
      .pipe(gulp.dest(config.component.dist))
      .pipe(rename(config.component.pkgName + '.min.js'))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest(config.component.dist));

  });

  var buildTasks = ['build:dist:scripts'];

  if (config.component.less) {
    gulp.task('build:dist:css', function() {
      return gulp.src(config.component.less)
        .pipe(less())
        .pipe(gulp.dest('dist'));
    });
    buildTasks.push('build:dist:css');
  }

  gulp.task('build:dist-gulp-sequence', buildTasks);

};
