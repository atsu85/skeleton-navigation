var gulp = require('gulp');
var gutil = require('gulp-util');
var linter = require('gulp-aurelia-template-lint');
var config = new (require('aurelia-template-lint').Config);
var fail   = require('gulp-fail');
var gulpIf = require('gulp-if');

var paths = require('../paths');

/* breaking change from beta to RC: `<content>` element will be replaced with `<slot>` - see http://blog.durandal.io/2016/05/23/aurelia-shadow-dom-v1-slots-prerelease/
config.obsoleteTags.push('content');
*/

gulp.task('lint-templates', () => {
  var errorsCount = 0;
  var reporter = (error, file) => {
    errorsCount++;
    gutil.log(gutil.colors.red(`ERROR: ${error.message} - ${file}(${error.line}:${error.column})`));
  }
  return gulp.src(paths.html)
  .pipe(linter(config, reporter))
  .pipe(gulp.dest('output'))
  .pipe(
    gulpIf(
      () => { return errorsCount !== 0; },
      fail(
        () => { return `Found ${errorsCount} errors when linting HTML templates`; },
        true
      )
    )
  );
});
