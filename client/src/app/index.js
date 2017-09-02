/*
if (!window.Promise) {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
  require.ensure([
  ], function (require) {
    require('babel-polyfill');
    require('./main').default()
  });
} else {
  require('./main').default()
}
*/
//TODO
import main from './main';
main();