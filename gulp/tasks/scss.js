import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCSS from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss';
import gropCssMediaQueries from 'gulp-group-css-media-queries';
import autoPrefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import postcssAnimation from 'postcss-animation';
import postcssFlexbugs from 'postcss-flexbugs-fixes';

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.scss, { sourcemaps: !app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'SCSS',
            message: 'Error: <%= error.message %>'
          })
        )
      )
      .pipe(
        sass({
          outputStyle: 'expanded'
        })
      )
      .pipe(
        postcss([
          postcssAnimation(),
          postcssFlexbugs(),
          autoPrefixer({
            grid: true,
            overrideBrowserlist: [app.settings.css.overrideBrowserlist],
            cascade: true
          })
        ])
      )
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(
        app.plugins.if(
          app.isBuild || app.settings.img.compressImgDevMode,
          gropCssMediaQueries()
        )
      )
      .pipe(
        app.plugins.if(
          app.isBuild || app.settings.img.webpCssDevMode,
          webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp'
          })
        )
      )
      // .pipe(autoPrefixer({
      //   grid: true,
      //   overrideBrowserlist: [app.settings.css.overrideBrowserlist],
      //   cascade: true,
      // }))
      .pipe(
        app.plugins.if(
          app.isBuild && app.settings.css.uncompressedCssCopy,
          gropCssMediaQueries()
        )
      )
      // несжатый дубль файла стилей
      .pipe(
        app.plugins.if(
          !app.isBuild && app.settings.css.uncompressedCssCopy,
          app.gulp.dest(app.path.build.css)
        )
      )
      .pipe(cleanCSS())
      .pipe(
        rename({
          extname: '.min.css'
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
};
