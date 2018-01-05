const path = require('path');
const runSequence = require('run-sequence');

module.exports = function(gulp, plugins, PATHS, browserSync, onError) {
  gulp.task('_copy-html-to-dist', false, () => {
    return gulp
      .src(`${path.join(PATHS.SRC_DIR, '**/*.html')}`)
      .pipe(plugins.replace(/stylesheets/g, 'css'))
      .on('error', onError)
      .pipe(gulp.dest(PATHS.DIST_DIR));
  });

  gulp.task('_lint-html', false, () => {
    return gulp
      .src(`${path.join(PATHS.SRC_DIR, '**/*.html')}`)
      .pipe(plugins.w3cjs())
      .pipe(plugins.w3cjs.reporter())
      .on('error', onError);
  });

  gulp.task('_append-version-and-minify-html', false, () => {
    return gulp
      .src(`${path.join(PATHS.DIST_DIR, '**/*.html')}`)
      .pipe(plugins.versionAppend(['html', 'js', 'css']))
      .pipe(plugins.htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(gulp.dest(PATHS.DIST_DIR));
  });

  return function(callback) {
    runSequence(
      '_copy-html-to-dist',
      '_add-versioning-tags-to-html',
      '_lint-html',
      callback,
    );
  };
};
