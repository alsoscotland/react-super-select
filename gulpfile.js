var config = require('./gulpconfig'),
    gulp = require('gulp');

function initRssGulp(gulp, config) {
  require('./tasks/bump')(gulp);
  require('./tasks/jsx')(gulp);
  require('./tasks/linting')(gulp, config);
  require('./tasks/docs')(gulp, config);
  require('./tasks/dist')(gulp, config);
  require('./tasks/lib')(gulp, config);
  require('./tasks/release')(gulp, config);
  require('./tasks/build')(gulp);
  require('./tasks/dev')(gulp, config);
}

initRssGulp(gulp, config);
