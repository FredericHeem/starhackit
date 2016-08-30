import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Debug from 'debug';

let debug = new Debug("i18n");

debug('navigator.languages: ', navigator.languages);

const languagesDetectorOption = {
  // order and from where user language should be detected
    order: ['localStorage', 'navigator', 'querystring', 'cookie'],
    //order: ['navigator'],
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',

    // cache user language on
    caches: ['localStorage', 'cookie']

    // optional expire and domain for set cookie
    //cookieMinutes: 10,
    //cookieDomain: 'myDomain'
};

export default {
    load() {
        debug('load');
        return new Promise((resolve/*, reject*/) => {
            i18next.on('languageChanged', function(lng) {
                debug('languageChanged to ', lng);
                resolve(lng);
            });

            i18next.on('initialized', function(option) {
                debug('initialized:  ', option);
            });

            i18next
                .use(LanguageDetector)
                .use(XHR)
                .init({
                    fallbackLng: 'en',
                    // have a common namespace used around the full app
                    ns: ['common'],
                    defaultNS: 'common',
                    debug: false,
                    interpolation: {
                        escapeValue: false // not needed for react!!
                    },
                    detection: languagesDetectorOption
                }, (err) => {
                    if (err) {
                        debug('error loading i18n: ', err);
                    } else {
                        debug('i18n done: ');
                    }
                });
        });
    }
};
