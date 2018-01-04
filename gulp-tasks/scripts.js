import webpack from 'webpack-stream';
import webpackConfig from '../webpack.config.babel.js';

const path = require('path');
const runSequence = require('run-sequence');

module.exports = function(gulp, plugins, PATHS, browserSync, onError) {
  const { development, production } = plugins.environments;

  gulp.task('_lint', false, () => {
    return gulp
      .src(['**/*.js', '!**/*min.js'], { cwd: PATHS.JS_SRC })
      .pipe(plugins.jshint('../.jshintrc'))
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'))
      .on('error', onError);
  });

  gulp.task('_minify-scripts', false, () => {
    return gulp
      .src(`../${path.join(PATHS.JS_SRC, 'portfolio.js')}`)
      .pipe(webpack(webpackConfig))
      .pipe(plugins.concat('main.js'))
      .pipe(production(plugins.uglify()))
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(production(plugins.size({ showFiles: true })))
      .on('error', onError)
      .pipe(development(gulp.dest(`../${PATHS.JS_SRC}`)))
      .pipe(production(gulp.dest(`../${PATHS.JS_DST}`)));
  });

  gulp.task('_jasmine', false, () => {
    return gulp
      .src(`../${path.join(PATHS.JS_DST, 'main.min.js')}`)
      .pipe(plugins.jasmineBrowser.specRunner())
      .on('error', onError);
  });

  return function(callback) {
    runSequence('_lint', '_minify-scripts', '_jasmine', callback);
  };
};
