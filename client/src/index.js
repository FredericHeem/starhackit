if (!window.Promise) {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
  require.ensure([
  ], function (require) {
    require('babel-polyfill');
    require('./app/main').default()
  });
} else {
  require('./app/main').default()
}
