var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var runSequence = require('run-sequence'); // only until gulp 4.0
var paths = require('../config').paths;

gulp.task('deploy-production', function(callback) {
  return runSequence(
    ['production'],
    ['deploy-gh-pages'],
    callback
  );
});

// then runs deploy-gh-pages which publishes the ./public folder to gh-pages branch
gulp.task('deploy-gh-pages', function() {
  return gulp.src(paths.dest + '/**/*')
    .pipe(ghPages());
});
