import webpack from 'webpack-stream';

export const vendors = (cb) => {
  if (
    app.settings.assets.copyAssets &&
    !app.func.fileExist(app.settings.assets.addAssets)
  ) {
    app.gulp
      .src(app.settings.assets.addAssets)
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'copyVendors',
            message: 'Error: <%= error.message %>'
          })
        )
      )
      .pipe(
        webpack({
          mode: 'production',
          output: {
            filename: 'vendors.min.js'
          }
        })
      )
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browserSync.stream());
  } else {
    cb();
  }
};
