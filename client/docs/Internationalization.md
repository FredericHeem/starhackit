## Internationalization

The [i18next](http://i18next.com/) provides internationalization support for this project. Translations are retrieved at run time without bloating the application with all translations.

Here are the i18next plugins configured in [src/app/utils/i18n.js](src/app/utils/i18n.js):

- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector): language detector used in browser environment for i18next
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend): backend layer for i18next using browsers xhr

The translation files are located in [locales](locales) directory.
