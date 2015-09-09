var _ = require('lodash'),
    config = require('./gulpconfig'),
    fs = require('fs'),
    gulp = require('gulp'),
    taskListing = require('gulp-task-listing');

function initRssGulp() {
  var externalTasks = fs.readdirSync('./tasks');
  _.each(externalTasks, function(task) {
    require('./tasks/' + task)(gulp, config);
  });
}

initRssGulp();
gulp.task('help', taskListing);
