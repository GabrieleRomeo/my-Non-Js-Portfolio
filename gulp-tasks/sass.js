const nodeSassGlobbing = require('node-sass-globbing');
module.exports = function(gulp, plugins, PATHS, browserSync, onError) {
  const { development, production } = plugins.environments;
  return function() {
    gulp
      .src(`${PATHS.CSS_SRC}/main.scss`)
      .pipe(plugins.debug({ title: 'debug-src' }))
      .pipe(plugins.sass({ importer: nodeSassGlobbing }))
      .pipe(plugins.autoprefixer('last 2 version'))
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(development(plugins.sourcemaps.init()))
      .pipe(plugins.cssnano())
      .pipe(development(plugins.sourcemaps.write('maps')))
      .pipe(production(plugins.size({ showFiles: true })))
      .on('error', onError)
      .pipe(gulp.dest(`${PATHS.CSS_DST}`))
      .pipe(plugins.debug({ title: 'destination' }))
      .pipe(browserSync.stream());
  };
};
