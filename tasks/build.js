var exec = require('child_process').exec;

module.exports = function(gulp) {

  gulp.task('dist:build', function(cb) {
    exec('npm run build', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });

};
