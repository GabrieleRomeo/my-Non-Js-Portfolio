'use strict';

var gulp = require('gulp-help')(require('gulp')),
    path = require('path'),
    jasmine = require('gulp-jasmine'),
    reporters = require('jasmine-reporters'),
    stylish = require('jshint-stylish'),
    browserSync = require("browser-sync").create(),
    runSequence = require('run-sequence'),
    del = require('del'),
    args = require('yargs').argv,
    exec = require('child_process').exec,
    gutil = require('gulp-util'),
    shell = require('shelljs'),
    $ = require('gulp-load-plugins')(),
    readlineSync = require('readline-sync'),
    fs = require('fs');

// Initialise environments
var development = $.environments.development;
var production  = $.environments.production;

/**
 * Utility function that takes in an error, makes the OS beep and
 * prints the error to the console
 */
var onError = function(error) {
    gutil.beep();
    gutil.log(error.message);
    browserSync.notify(error.message);
    this.emit('end');
    process.exit(2);
};

/**
 * Utility function that returns the package.json config file
 */
var getConfig = function() {
    var json = JSON.parse(fs.readFileSync('./package.json'));
    return json;
}


// Initialise file path store
var PATHS = {};

PATHS.ROOT       = '.';
PATHS.SRC_DIR    = path.join(PATHS.ROOT, 'src');
PATHS.DIST_DIR   = path.join(PATHS.ROOT, 'public');
PATHS.TMP        = path.join(PATHS.SRC_DIR, 'tmp');
PATHS.CSS_SRC    = path.join(PATHS.SRC_DIR, 'stylesheets');
PATHS.CSS_DST    = path.join(PATHS.DIST_DIR, 'css');
PATHS.JS_SRC     = path.join(PATHS.SRC_DIR, 'js');
PATHS.JS_DST     = path.join(PATHS.DIST_DIR, 'js');
PATHS.IMAGES_SRC = path.join(PATHS.SRC_DIR, 'img');
PATHS.IMAGES_DST = path.join(PATHS.DIST_DIR, 'img');


// Versioning pattern
var VERSIONING = '?v=@version@';
var RELEASEPREFIX = 'release-';

// Gulp HELPS
var HELPS = {};

HELPS.deploy   = 'Deploy the software on GitHub and publish on gh-pages the ./';
HELPS.deploy  += PATHS.DIST_DIR + ' dir';

HELPS.release  = 'Update the release version and switch to the release branch';

HELPS.production  = 'Clean the dist, Build, and Move all the other assets ';
HELPS.production += 'and Start the server for a preview';

HELPS.updateVersion  = 'It bumps the package.json to the next minor revision. ';
HELPS.updateVersion += 'i.e. from 0.1.1 to 0.1.2';



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

                           GENERAL SUB-TASKS

 NOTE: Tasks which begin with an underscore are considered private and they
       shouldn't be launched directly

    Use gulp help for helps
    Use gulp help --all to watch all tasks

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

gulp.task('_sass', false, function(callback) {
  return $.rubySass(PATHS.CSS_SRC + '/main.scss', {sourcemap: true})
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.sourcemaps.write())
    .on('error', onError)
    .pipe(gulp.dest(PATHS.CSS_SRC))
});

gulp.task('_minify-styles', false, function(callback) {
  return gulp.src(['**/*.css', '!**/*min.css'], {cwd: PATHS.CSS_SRC})
    .pipe($.rename({suffix: '.min'}))
    .pipe(development($.sourcemaps.init()))
    .pipe($.cssnano())
    .pipe(development($.sourcemaps.write()))
    .pipe(production($.size({ showFiles: true })))
    .on('error', onError)
    .pipe(development(gulp.dest(PATHS.CSS_SRC)))
    .pipe(production(gulp.dest(PATHS.CSS_DST)))
    .pipe(browserSync.stream());
});

gulp.task('_lint', false, function (callback) {
  return gulp.src(['portfolio.js','**/*.js', '!**/*min.js'], {cwd: PATHS.JS_SRC})
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .on('error', onError);
});

gulp.task('_jasmine', false, function (callback) {
  return gulp.src(path.join(PATHS.JS_DST, 'main.min.js'))
        .pipe($.jasmineBrowser.specRunner())
        .on('error', onError);
});

gulp.task('_minify-scripts', false, function(callback) {
  return gulp.src(['portfolio.js', '**/*.js', '!**/*min.js'], {cwd: PATHS.JS_SRC})
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(PATHS.TMP))
    .pipe(development($.sourcemaps.init()))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify())
    .pipe(production($.size({ showFiles: true })))
    .on('error', onError)
    .pipe(development($.sourcemaps.write()))
    .pipe(development(gulp.dest(PATHS.JS_SRC)))
    .pipe(production(gulp.dest(PATHS.JS_DST)));
});

gulp.task('_lint-html', false, function(callback) {
    return gulp.src(path.join(PATHS.SRC_DIR, '**/*.html'))
            .pipe($.w3cjs())
            .pipe($.w3cjs.reporter())
            .on('error', onError);
});

gulp.task('_minify-html', false, function(callback) {
    return gulp.src(path.join(PATHS.DIST_DIR, '**/*.html'))
            .pipe($.versionAppend(['html', 'js', 'css']))
            .pipe($.htmlmin({removeComments: true, collapseWhitespace: true}))
            .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_copy-html-to-dist', false, function(callback) {

    return gulp.src(path.join(PATHS.SRC_DIR, '**/*.html'))
           .pipe($.replace(/stylesheets/g, 'css'))
           .on('error', onError)
           .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_mv-assets-to-dist', false, function(callback) {

    var all = path.join(PATHS.SRC_DIR, '**/**');
    var excludeJs  = '!' + PATHS.JS_SRC + '{,/**}';
    var excludeCss = '!' + PATHS.CSS_SRC + '{,/**}';
    var excludeImg = '!' + PATHS.IMAGES_SRC + '{,/**}';
    var excludeTmp = '!' + PATHS.TMP + '{,/**}';


    return gulp.src([all, excludeJs, excludeCss, excludeImg, excludeTmp])
           .on('error', onError)
           .pipe(gulp.dest(PATHS.DIST_DIR));
});

gulp.task('_images', false, function(callback) {
  return gulp.src(['**/*.{png,gif,jpg}'], {cwd: PATHS.IMAGES_SRC})
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true }
    )))
    .pipe($.print(function(filepath) {
      return "Image built: " + filepath;
    }))
    .on('error', onError)
    .pipe(gulp.dest(PATHS.IMAGES_DST));
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                VERSIONING TASKS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


gulp.task('update-version', HELPS.updateVersion, function (callback) {

    var type = args.type;
    var version = args.version;
    var options = {};

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
        'type major': 'Set the package.json to the next major release (bumps 1.0.0)',
        'type minor': 'Set the package.json to the next minor revision (bumps 0.1.0)',
        'type patch': 'Set the package.json to the next patch (bumps 0.0.2)',
        'type prerelease': 'Set the package.json to the next pre-release (bumps 0.0.1-2)',
        'type version X.X.X': 'Set the package.json to the specified revision'
    }
});

gulp.task('_add-versioning-tags-to-html', false, function(callback) {
    return gulp.src(path.join(PATHS.DIST_DIR, '**/*.html'))
           .pipe($.replace(/\.css/g, '.css' + VERSIONING))
           .pipe($.replace(/\.js/g, '.js' + VERSIONING))
           .on('error', onError)
           .pipe(gulp.dest(PATHS.DIST_DIR));
});

/*******************************************************************************
*
*                             RELEASE SUB-TASKS
*
*******************************************************************************/


gulp.task('_checkout-master', false, function(callback) {

    $.git.checkout('master', function (err) {

        if (err) { throw err; }

        callback();
    });
});

gulp.task('_checkout-develop', false, function(callback) {

    $.git.checkout('develop', function (err) {

        if (err) { throw err; }

        callback();
    });
});

gulp.task('_checkout-release', false, function(callback) {

    // Create and switch to the release branch

    var config = getConfig();
    var branchName = RELEASEPREFIX + config.version;

    $.git.checkout(branchName, {args:'-b', '--track':'develop'}, function (err) {
        if (err) throw err;
    });

    callback();
});

gulp.task('_add-git-tag', false, function(callback){

    var config = getConfig();

    var version = 'v' + config.version;

    $.git.tag(version, 'Version ' + version, function (err) {

        if (err) { throw err; }

        callback();
    });
});

gulp.task('_push', false, function(callback){

    $.git.push('origin', ['master', 'develop'], {args: " --tags"}, function (err) {

        if (err) { throw err; }

        callback();
    });
});

gulp.task('_release-merge', false, function(callback) {

    var config = getConfig();
    var vers   = config.version;
    var relBr  = RELEASEPREFIX + vers;

    $.git.merge(relBr, {args: '--no-ff' }, function(err) {

        if (err) { throw err; }

        callback();
    });
});

gulp.task('_publish-gh-pages', false, function(callback) {

    shell.exec('git subtree split --prefix ' + PATHS.DIST_DIR  +' -b gh-pages');
    shell.exec('git push -f origin gh-pages:gh-pages');
    shell.exec('git branch -D gh-pages');

    callback();
});

gulp.task('_delete-release-branch', false, function(callback) {

    var config = getConfig();

    var cmd = 'git branch -D ' + RELEASEPREFIX + config.version;

    var child = exec(cmd);


    child.stdout.on('data', function(data) {
      shell.echo(data);
    });

    child.stdout.on('end', function(data) {
      callback();
    });
});



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                   SERVER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


gulp.task('server', 'Start the browserSync server', function() {

    var baseDir = production() ? PATHS.DIST_DIR : PATHS.SRC_DIR;

    browserSync.init({
        server: {
            baseDir: baseDir + '/'
        }
    });

    if (development) {

        // Watch .scss files
        gulp.watch(path.join(PATHS.CSS_SRC, '**/*.scss'), ['build-styles']);

        // Watch .js files
        gulp.watch(path.join(PATHS.JS_SRC, '**/*.js'), ['build-scripts', function() {
            browserSync.reload();
        }]);


        gulp.watch(baseDir + '/*.html').on('change', browserSync.reload);
    }
},
{
    options: {
        'env=production': 'Set the production environment. ' +
                          'Serving files from: /' + PATHS.DIST_DIR
    }
});


/*******************************************************************************
*
*                               BUILD SUB-TASKS
*
*******************************************************************************/


gulp.task('build-clean', false, function(callback) {
    return del([PATHS.CSS_DST,
                PATHS.JS_DST,
                PATHS.IMAGES_DST]);
});

gulp.task('build-scripts', false, function(callback) {
    runSequence('_lint', '_minify-scripts', '_jasmine', callback);
});

gulp.task('build-styles', false, function(callback) {
    runSequence('_sass', '_minify-styles', callback);
});

gulp.task('build-html', false, function(callback) {
    runSequence('_copy-html-to-dist',
                '_add-versioning-tags-to-html',
                //'_lint-html',
                '_minify-html',
                callback);
});

/*******************************************************************************
*
*                               MAIN TASKS
*
*******************************************************************************/


gulp.task('default', function(callback) {

    runSequence(['build-styles', 'build-scripts', '_images', '_mv-assets-to-dist'],
                '_lint-html',
                'server',
                callback);
});

gulp.task('production', HELPS.production ,function(callback) {

    $.environments.current(production);

    runSequence('build-clean',
                ['build-styles', 'build-scripts', '_images', '_mv-assets-to-dist'],
                'build-html',
                'server',
                callback);
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

gulp.task('release', HELPS.release, function(callback) {

    var config = getConfig();

    var updateTypeList = ['automatic bump',
                          'major',
                          'minor',
                          'patch',
                          'prerelease',
                          'custom version'];
    var updateType = '';
    var specificVersion = '';
    var index;

    var gulpReleaseTask = 'gulp ';


    if (readlineSync.keyInYNStrict('Do you want to update the release version?')) {

        console.log('CURRENT VERSION: ' + config.version);

        index = readlineSync.keyInSelect(updateTypeList, 'Which type of bump?');

        if (index === -1) {
            // CANCEL was pressed
            return;
        }
        else if (index > 0 && index < (updateTypeList.length - 1)) {
            updateType = updateTypeList[index];
        } else if (index === updateTypeList.length - 1) {
            // Specific version
            updateType = 'version';
            specificVersion = readlineSync.question('Specify the version, please: ', {
                limit: /^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?(?:\+((?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*))(?:\.(?:0|(?:[1-9A-Za-z-][0-9A-Za-z-]*)))*))?$/gm,
                limitMessage: 'Sorry, $<lastInput> is not a valid Semantic Version.'
            });
        }

        gulpReleaseTask += 'update-version --type=' + updateType + ' ' + specificVersion;

      var child = exec(gulpReleaseTask);

      child.stdout.on('data', function(data) {
        shell.echo(data);
      });

      child.stdout.on('end', function(data) {
        runSequence('_checkout-release');
        callback();
      });
    } else {
        // Do not update the version, switch to the release branch immediately
        runSequence('_checkout-release');
        callback();
    }


});

gulp.task('deploy', HELPS.deploy, function(callback) {

    var currentBranch = shell.exec('git rev-parse --abbrev-ref HEAD', {silent:true}).stdout;

    if (currentBranch.indexOf(RELEASEPREFIX) === -1) {
        shell.echo('Start the deploy task from the ' + RELEASEPREFIX + 'x.x.x branch');
        return;
    }

    runSequence('_checkout-master',
                '_release-merge',
                '_checkout-develop',
                '_release-merge',
                '_delete-release-branch',
                '_add-git-tag',
                '_push',
                '_publish-gh-pages',
                callback);

});

