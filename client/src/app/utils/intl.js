/* eslint global-require: 0*/
import Debug from 'debug';

let debug = new Debug("intl");

if (!window.Intl) {
    debug('loading intl');
    window.Intl = require('intl');
} else {
    debug('intl built-in');
}
