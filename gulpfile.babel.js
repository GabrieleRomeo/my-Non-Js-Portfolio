'use strict';

const gulp = require('gulp-help')(require('gulp'));
const path = require('path');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const del = require('del');
const args = require('yargs').argv;
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const shell = require('shelljs');
const $ = require('gulp-load-plugins')();
const nodeSassGlobbing = require('node-sass-globbing');
const readlineSync = require('readline-sync');
const fs = require('fs');

import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel.js';

// Initialise environments
let development = $.environments.development;
let production = $.environments.production;

/**
 * Imports tasks
 */
const getTask = task => require('./gulp-tasks/' + task)(gulp, $);

/**
 * Utility function that takes in an error, makes the OS beep and
 * prints the error to the console
 */
let onError = error => {
  gutil.beep();
  gutil.log(error.message);
  browserSync.notify(error.message);
  this.emit('end');
  process.exit(2);
};

/**
 * Utility function that returns the package.json config file
 */
let getConfig = () => {
  let json = JSON.parse(fs.readFileSync('./package.json'));
  return json;
};

// Initialise file path store
const PATHS = {};

PATHS.ROOT = '.';
PATHS.SRC_DIR = path.join(PATHS.ROOT, 'src');
PATHS.DIST_DIR = path.join(PATHS.ROOT, 'public');
PATHS.TMP = path.join(PATHS.SRC_DIR, 'tmp');
PATHS.CSS_SRC = path.join(PATHS.SRC_DIR, 'stylesheets');
PATHS.CSS_CMPS = path.join(PATHS.SRC_DIR, 'components');
PATHS.CSS_DST = path.join(PATHS.DIST_DIR, 'css');
PATHS.JS_SRC = path.join(PATHS.SRC_DIR, 'js');
PATHS.JS_DST = path.join(PATHS.DIST_DIR, 'js');
PATHS.IMAGES_SRC = path.join(PATHS.SRC_DIR, 'img');
PATHS.IMAGES_DST = path.join(PATHS.DIST_DIR, 'img');

// Versioning pattern
const VERSIONING = '?v=@version@';
const RELEASEBRANCH = 'release-branch';

// Gulp HELPS
const HELPS = {};

HELPS.deploy = 'Deploy the software on GitHub and publish on gh-pages the ./';
HELPS.deploy += PATHS.DIST_DIR + ' dir';

HELPS.release = 'Update the release version and switch to the release branch';

HELPS.production = 'Clean the dist, Build, and Move all the other assets ';
HELPS.production += 'and Start the server for a preview';

HELPS.updateVersion = 'It bumps the package.json to the next minor revision. ';
HELPS.updateVersion += 'i.e. from 0.1.1 to 0.1.2';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                           GENERAL SUB-TASKS
 NOTE: Tasks which begin with an underscore are considered private and they
       shouldn't be launched directly
    Use gulp help for helps
    Use gulp help --all to watch all tasks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

gulp.task('_sass', false, () => {
  return gulp
    .src(PATHS.CSS_SRC + '/main.scss')
    .pipe($.sass({ importer: nodeSassGlobbing }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.sourcemaps.write())
    .on('error', onError)
    .pipe(gulp.dest(PATHS.CSS_SRC));
});

gulp.task('_minify-styles', false, () => {
  return gulp
    .src(['**/*.css', '!**/*min.css'], { cwd: PATHS.CSS_SRC })
    .pipe($.rename({ suffix: '.min' }))
    .pipe(development($.sourcemaps.init()))
    .pipe($.cssnano())
    .pipe(development($.sourcemaps.write()))
    .pipe(production($.size({ showFiles: true })))
    .on('error', onError)
    .pipe(development(gulp.dest(PATHS.CSS_SRC)))
    .pipe(production(gulp.dest(PATHS.CSS_DST)))
    .pipe(browserSync.stream());
});

gulp.task('_lint', false, () => {
  return gulp
    .src(['portfolio.js', '**/*.js', '!**/*min.js'], { cwd: PATHS.JS_SRC })
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .on('error', onError);
});

gulp.task('_jasmine', false, () => {
  return gulp
    .src(path.join(PATHS.JS_DST, 'main.min.js'))
    .pipe($.jasmineBrowser.specRunner())
    .on('error', onError);
});

gulp.task('_minify-scripts', false, () => {
  return gulp
    .src(path.join(PATHS.JS_SRC, 'portfolio.js'))
    .pipe(webpack(webpackConfig))
    .pipe($.concat('main.js'))
    .pipe(production($.uglify()))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(production($.size({ showFiles: true })))
    .on('error', onError)
    .pipe(development(gulp.dest(PATHS.JS_SRC)))
    .pipe(production(gulp.dest(PATHS.JS_DST)));
});

gulp.task('_lint-html', false, () => {
  return gulp
    .src(path.join(PATHS.SRC_DIR, '**/*.html'))
    .pipe($.w3cjs())
    .pipe($.w3cjs.reporter())
    .on('error', onError);
});

gulp.task('_append-version-and-minify-html', false, () => {
  return gulp
    .src(path.join(PATHS.DIST_DIR, '**/*.html'))
    .pipe($.versionAppend(['html', 'js', 'css']))
    .pipe($.htmlmin({ removeComments: true, collapseWhitespace: true }))
    .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_copy-html-to-dist', false, () => {
  return gulp
    .src(path.join(PATHS.SRC_DIR, '**/*.html'))
    .pipe($.replace(/stylesheets/g, 'css'))
    .on('error', onError)
    .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_mv-assets-to-dist', false, () => {
  let all = path.join(PATHS.SRC_DIR, '**/**');
  //let excludeJs  = '!' + PATHS.JS_SRC + '{,/**}';
  let excludeCss = '!' + PATHS.CSS_SRC + '{,/**}';
  let excludeImg = '!' + PATHS.IMAGES_SRC + '{,/**}';
  let excludeTmp = '!' + PATHS.TMP + '{,/**}';

  return gulp
    .src([all, excludeCss, excludeImg, excludeTmp])
    .on('error', onError)
    .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_images', false, () => {
  return gulp
    .src(['**/*.{png,gif,jpg}'], { cwd: PATHS.IMAGES_SRC })
    .pipe(
      $.cache(
        $.imagemin({
          optimizationLevel: 5,
          progressive: true,
          interlaced: true,
        }),
      ),
    )
    .pipe(
      $.print(filepath => {
        return 'Image built: ' + filepath;
      }),
    )
    .on('error', onError)
    .pipe(gulp.dest(PATHS.IMAGES_DST));
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
    .on('error', onError)
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
  'Start the browserSync server',
  () => {
    let baseDir = production() ? PATHS.DIST_DIR : PATHS.SRC_DIR;

    browserSync.init({
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
          browserSync.reload();
        },
      ]);

      gulp.watch(baseDir + '/*.html').on('change', browserSync.reload);
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

gulp.task('build-scripts', false, callback => {
  runSequence('_lint', '_minify-scripts', '_jasmine', callback);
});

gulp.task('build-styles', false, callback => {
  runSequence('_sass', '_minify-styles', callback);
});

gulp.task('pre-build-html', false, callback => {
  runSequence(
    '_copy-html-to-dist',
    '_add-versioning-tags-to-html',
    '_lint-html',
    callback,
  );
});

gulp.task('build-html', false, callback => {
  runSequence(
    '_copy-html-to-dist',
    '_add-versioning-tags-to-html',
    '_lint-html',
    '_append-version-and-minify-html',
    callback,
  );
});

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
    ['build-styles', 'build-scripts', '_images', '_mv-assets-to-dist'],
    'pre-build-html',
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

gulp.task('release', HELPS.release, callback => {
  let config = getConfig();

  const updateTypeList = [
    'automatic bump',
    'major',
    'minor',
    'patch',
    'prerelease',
    'custom version',
  ];
  let updateType = '';
  let specificVersion = '';
  let index;

  let gulpReleaseTask = 'gulp ';

  if (
    readlineSync.keyInYNStrict('Do you want to update the release version?')
  ) {
    shell.echo('CURRENT VERSION: ' + config.version);

    index = readlineSync.keyInSelect(updateTypeList, 'Which type of bump?');

    if (index === -1) {
      // CANCEL was pressed
      return;
    } else if (index > 0 && index < updateTypeList.length - 1) {
      updateType = updateTypeList[index];
    } else if (index === updateTypeList.length - 1) {
      // Specific version
      updateType = 'version';
      specificVersion = readlineSync.question('Specify the version, please: ', {
        limit: /^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?(?:\+((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?$/gm,
        limitMessage: 'Sorry, $<lastInput> is not a valid Semantic Version.',
      });
    }

    runSequence('_checkout-release', 'production', () => {
      gulpReleaseTask += `update-version --type=${updateType} ${specificVersion}`;

      let child = exec(gulpReleaseTask);

      child.stdout.on('data', data => shell.echo(data));
    });
  } else {
    // Do not update the version, switch to the release branch immediately
    runSequence('_checkout-release', 'production', callback);
  }
});

gulp.task('deploy', HELPS.deploy, callback => {
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
});
