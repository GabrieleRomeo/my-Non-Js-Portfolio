module.exports = function(gulp, plugins, PATHS, browserSync, onError) {
  return function() {
    gulp.task('_images', false, () => {
      return gulp
        .src(['**/*.{png,gif,jpg}'], { cwd: `../${PATHS.IMAGES_SRC}` })
        .pipe(
          plugins.cache(
            plugins.imagemin({
              optimizationLevel: 5,
              progressive: true,
              interlaced: true,
            }),
          ),
        )
        .pipe(
          plugins.print(filepath => {
            return 'Image built: ' + filepath;
          }),
        )
        .on('error', onError)
        .pipe(gulp.dest(PATHS.IMAGES_DST));
    });
  };
};
