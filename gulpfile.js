var _ = require('lodash'),
    config = require('./gulpconfig'),
    exec = require('child_process').exec,
    fs = require('fs'),
    gulp = require('gulp'),
    taskListing = require('gulp-task-listing');

function initRssGulp() {
  var externalTasks = fs.readdirSync('./tasks');
  _.each(externalTasks, function(task) {
    require('./tasks/' + task)(gulp, config);
  });
}

gulp.task('compile:js', function(cb) {
  exec('npm run npm:babel:js', function (err, stdout, stderr) {
    console.info(stdout);
    console.info(stderr);
    cb(err);
  });
});

initRssGulp();
gulp.task('help', taskListing);
