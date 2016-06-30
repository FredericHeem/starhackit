import Debug from 'debug';
let debug = new Debug("intl");

export default function(language = 'en'){
    debug(language);
    return new Promise((resolve) => {
        if (!window.Intl) {
            // Safari only
            debug("fetch intl");
            require.ensure([
            ], function(require) {
                require('intl');
                require(`intl/locale-data/jsonp/en.js`);
                //require(`intl/locale-data/jsonp/ru.js`);
                //require(`intl/locale-data/jsonp/de.js`);
                //require(`intl/locale-data/jsonp/fr.js`);
                resolve();
            });
        } else {
            resolve();
        }
    });
}
