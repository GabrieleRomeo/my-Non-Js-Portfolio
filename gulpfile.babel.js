'use strict';

const gulp = require('gulp-help')(require('gulp'));
const path = require('path');
const bSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const del = require('del');
const args = require('yargs').argv;
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const shell = require('shelljs');
const $ = require('gulp-load-plugins')();

import {
  getConfig,
  RELEASEBRANCH,
  VERSIONING,
  HELPS,
  PATHS,
} from './gulp.config';

// Initialise environments
const development = $.environments.development;
const production = $.environments.production;

/**
 * Utility function that takes in an error, makes the OS beep and
 * prints the error to the console
 */
const onErr = error => {
  gutil.beep();
  gutil.log(error.message);
  bSync.notify(error.message);
  this.emit('end');
  process.exit(2);
};

/**
 * Imports tasks
 */
const getTask = t => require(`./gulp-tasks/${t}`)(gulp, $, PATHS, bSync, onErr);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                           GENERAL SUB-TASKS
 NOTE: Tasks which begin with an underscore are considered private and they
       shouldn't be launched directly
    Use gulp help for helps
    Use gulp help --all to watch all tasks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

gulp.task('build-styles', false, getTask('sass'));

gulp.task('build-scripts', false, getTask('scripts'));

gulp.task('build-images', false, getTask('images'));

gulp.task('_mv-assets-to-dist', false, () => {
  let all = path.join(PATHS.SRC_DIR, '**/**');
  //let excludeJs  = '!' + PATHS.JS_SRC + '{,/**}';
  let excludeCss = '!' + PATHS.CSS_SRC + '{,/**}';
  let excludeImg = '!' + PATHS.IMAGES_SRC + '{,/**}';
  let excludeTmp = '!' + PATHS.TMP + '{,/**}';

  return gulp
    .src([all, excludeCss, excludeImg, excludeTmp])
    .on('error', onErr)
    .pipe(gulp.dest(PATHS.DIST_DIR));
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                VERSIONING TASKS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

gulp.task(
  'update-version',
  HELPS.updateVersion,
  () => {
    let type = args.type;
    let version = args.version;
    let options = {};

    if (version) {
      options.version = version;
    } else {
      options.type = type;
    }

    return gulp
      .src([path.join(PATHS.ROOT, 'package.json')])
      .pipe($.bump(options))
      .pipe(gulp.dest(PATHS.ROOT));
  },
  {
    options: {
      'type major':
        'Set the package.json to the next major release (bumps 1.0.0)',
      'type minor':
        'Set the package.json to the next minor revision (bumps 0.1.0)',
      'type patch': 'Set the package.json to the next patch (bumps 0.0.2)',
      'type prerelease':
        'Set the package.json to the next pre-release (bumps 0.0.1-2)',
      'type version X.X.X': 'Set the package.json to the specified revision',
    },
  },
);

gulp.task('_add-versioning-tags-to-html', false, () => {
  return gulp
    .src(path.join(PATHS.DIST_DIR, '**/*.html'))
    .pipe($.replace(/(href="css\/.+)\.css/g, '$1.css' + VERSIONING))
    .pipe($.replace(/(src="js\/.+)\.js/g, '$1.js' + VERSIONING))
    .on('error', onErr)
    .pipe(gulp.dest(PATHS.DIST_DIR));
});

/*******************************************************************************
*
*                             RELEASE SUB-TASKS
*
*******************************************************************************/

gulp.task('_checkout-master', false, callback => {
  $.git.checkout('master', err => {
    if (err) {
      throw err;
    }

    callback();
  });
});

gulp.task('_checkout-develop', false, callback => {
  $.git.checkout('develop', err => {
    if (err) {
      throw err;
    }

    callback();
  });
});

gulp.task('_checkout-release', false, () => {
  // Create and switch to the release branch

  let branchName = `${RELEASEBRANCH}-remove-after`;

  $.git.checkout(branchName, { args: '-b', '--track': 'develop' }, err => {
    if (err) {
      throw err;
    }
  });
});

gulp.task('_add-and-commit', false, () => {
  let config = getConfig();
  let version = 'v' + config.version;

  return gulp
    .src(path.join(PATHS.DIST_DIR, '/*'))
    .pipe($.git.add())
    .pipe($.git.commit(`Version update ${version}`));
});

gulp.task('_add-git-tag', false, callback => {
  let config = getConfig();

  let version = 'v' + config.version;

  $.git.tag(version, 'Version ' + version, err => {
    if (err) {
      throw err;
    }

    callback();
  });
});

gulp.task('_push', false, callback => {
  $.git.push('origin', ['master', 'develop'], { args: ' --tags' }, err => {
    if (err) {
      throw err;
    }

    callback();
  });
});

gulp.task('_release-merge', false, callback => {
  let cmd = 'git branch | grep "' + RELEASEBRANCH + '"';
  let relBr = shell.exec(cmd, { silent: true }).stdout.trim();

  if (relBr.indexOf(RELEASEBRANCH) === -1) {
    shell.echo(`It seems that a ${RELEASEBRANCH} x.x.x branch does not exist`);
    return;
  }

  $.git.merge(relBr, { args: '--no-ff' }, err => {
    if (err) {
      throw err;
    }

    callback();
  });
});

gulp.task('_publish-gh-pages', false, callback => {
  shell.exec('git subtree split --prefix ' + PATHS.DIST_DIR + ' -b gh-pages');
  shell.exec('git push -f origin gh-pages:gh-pages');
  shell.exec('git branch -D gh-pages');

  callback();
});

gulp.task('_delete-release-branch', false, callback => {
  let config = getConfig();
  let cmd = 'git branch -D ' + RELEASEBRANCH + config.version;
  let child = exec(cmd);

  child.stdout.on('data', data => shell.echo(data));
  child.stdout.on('end', () => callback());
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                   SERVER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

gulp.task(
  'server',
  'Starts the browserSync server',
  () => {
    let baseDir = production() ? PATHS.DIST_DIR : PATHS.SRC_DIR;

    bSync.init({
      server: {
        baseDir: baseDir + '/',
      },
    });

    if (development) {
      // Watch .scss files
      gulp.watch(path.join(PATHS.CSS_SRC, '**/*.scss'), ['build-styles']);
      gulp.watch(path.join(PATHS.CSS_CMPS, '**/*.scss'), ['build-styles']);

      // Watch .js files
      gulp.watch(path.join(PATHS.JS_SRC, '**/*.js'), [
        'build-scripts',
        () => {
          bSync.reload();
        },
      ]);

      gulp.watch(baseDir + '/*.html').on('change', bSync.reload);
    }
  },
  {
    options: {
      'env=production':
        'Set the production environment. ' +
        'Serving files from: /' +
        PATHS.DIST_DIR,
    },
  },
);

/*******************************************************************************
*
*                               BUILD SUB-TASKS
*
*******************************************************************************/

gulp.task('build-clean', false, () => {
  return del([
    path.join(PATHS.DIST_DIR, '**/*.html'),
    PATHS.CSS_DST,
    PATHS.JS_DST,
    PATHS.IMAGES_DST,
  ]);
});

gulp.task('build-html', false, getTask('html'));

/*******************************************************************************
*
*                               MAIN TASKS
*
*******************************************************************************/

gulp.task('default', callback => {
  runSequence(
    ['build-styles', 'build-scripts'],
    '_lint-html',
    'server',
    callback,
  );
});

gulp.task('production', HELPS.production, callback => {
  $.environments.current(production);

  runSequence(
    'build-clean',
    ['build-styles', 'build-scripts', 'build-images', '_mv-assets-to-dist'],
    'build-html',
    'server',
    callback,
  );
});

/*
* GIT FLOW - Release Branches
*
* Creating this branch starts the next release cycle, so no new features can be
* added after this point-only bug fixes, documentation generation, and other
* release-oriented tasks should go in this branch.
*
* Tag: increment major or minor number
*
*/
gulp.task('release', HELPS.release, getTask('release'));

gulp.task('deploy', HELPS.deploy, getTask('deploy'));
