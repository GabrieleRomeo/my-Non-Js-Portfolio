import { RELEASEBRANCH } from '../gulp.config';

const shell = require('shelljs');
const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');
const runSequence = require('run-sequence');

module.exports = function(gulp, plugins, PATHS) {
  return function(callback) {
    let currentBranch = shell.exec('git rev-parse --abbrev-ref HEAD', {
      silent: true,
    }).stdout;

    // Check if the deploy task has been started from the deploy branch
    if (currentBranch.indexOf(RELEASEBRANCH) === -1) {
      shell.echo(
        gutil.colors.yellow(`Start the deploy task from the
                                            ${RELEASEBRANCH} 'x.x.x branch`),
      );
      return;
    }

    // Check if the index.html file exists into the distribution folder
    fs.access(path.join(PATHS.DIST_DIR, 'index.html'), fs.F_OK, err => {
      if (err) {
        gutil.log(
          gutil.colors.red(`ERROR: The index.html file does not
                                            exist into ${PATHS.DIST_DIR}`),
        );
        return;
      }
    });

    runSequence(
      '_append-version-and-minify-html',
      '_add-and-commit',
      '_checkout-master',
      '_release-merge',
      '_checkout-develop',
      '_release-merge',
      '_delete-release-branch',
      '_add-git-tag',
      '_push',
      '_publish-gh-pages',
      callback,
    );
  };
};
