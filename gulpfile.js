// основной модуль
import gulp from 'gulp';

// импорт путей
import { path } from './gulp/config/path.js';
// импорт общих плагинов
import { plugins } from './gulp/config/plugins.js';
// настройки проекта
import { settings } from './gulp/settings.js'
// импорт вспомогательных функций
import * as func from './gulp/config/functions.js'

// Передвем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path: path,
  gulp: gulp,
  plugins: plugins,
  settings: settings,
  func: func,
}

// Импорт задач
import { assets } from './gulp/tasks/assets.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { pug } from './gulp/tasks/pug.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { favicon } from './gulp/tasks/favicon.js';
import { otfToTtf, ttfToWoff, copyFonts, fontsStyle } from './gulp/tasks/fonts.js';
import { svgSpriteTask } from './gulp/tasks/svgSprite.js';
import { pngSpriteTask } from './gulp/tasks/pngSprite.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.files, assets);
  if (!app.settings.pug.usePug) {
    gulp.watch(path.watch.html, html);
  }
  if (app.settings.pug.usePug) {
    gulp.watch(path.watch.pug, pug);
  }
  gulp.watch(path.watch.scss, scss);
  if (app.settings.js.processJs) {
    gulp.watch(path.watch.js, js);
  }
  gulp.watch(path.watch.img, images);
  if (app.settings.svg.processSvgSprite) {
    gulp.watch(path.watch.svgicons, svgSpriteTask)
  };
}

// Послеовательная обработка шрифтов
const fontsTask = gulp.series(otfToTtf, ttfToWoff, copyFonts, fontsStyle);

const mainTasks = gulp.series(
  fontsTask,
  assets,
  html,
  pug,
  scss,
  js,
  favicon,
  images,
  pngSpriteTask,
  svgSpriteTask
  );

// Сценарии выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZip = gulp.series(reset, mainTasks, zip);
const deployFtp = gulp.series(reset, mainTasks, ftp);

// экспорт сценариев
export { dev };
export { build };
export { deployZip };
export { deployFtp };
// задачи, для которых watcher не стоит или отключаемый, и может понадобиться обновить, не перезапуская сборку
export { fontsTask };
export { svgSpriteTask };
export { pngSpriteTask };
export { favicon };



// Выполненение сценария по умолчанию
gulp.task('default', dev);
