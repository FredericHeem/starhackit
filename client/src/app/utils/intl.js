import Debug from 'debug';
let debug = new Debug("intl");
import {Promise} from 'es6-promise';

export default function(language = 'en'){
    debug(language);
    return new Promise((resolve) => {
        if (!window.Intl) {
            // Safari only
            debug("fetch intl");
            require.ensure([
                'intl', `intl/locale-data/jsonp/${language}.js`
            ], function(require) {
                require('intl');
                require(`intl/locale-data/jsonp/${language}.js`);
                resolve();
            });
        } else {
            resolve();
        }
    });
};
