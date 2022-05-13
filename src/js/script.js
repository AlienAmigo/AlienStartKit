import * as flsFunctions from './modules/functions.js';

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(() => {
  flsFunctions.isWebp();
  console.log('DOM ready');
});
