import i18next from 'i18next';
import Promise from 'bluebird';
import XHR from 'i18next-xhr-backend/lib';
import LanguageDetector from 'i18next-browser-languagedetector';
import Debug from 'debug';

let debug = new Debug("i18n");

export default {
    load() {
        return new Promise((resolve/*, reject*/) => {
            i18next
                .use(XHR)
                .use(LanguageDetector)
                .init({
                    fallbackLng: 'en',
                    // have a common namespace used around the full app
                    ns: ['common'],
                    defaultNS: 'common',

                    debug: true,

                    interpolation: {
                        escapeValue: false // not needed for react!!
                    }
                }, (err, t) => {
                    if (err) {
                        debug('error loading i18n: ', err);
                    }
                    debug('i18n done');
                    resolve(t);
                });
        });
    }
};
