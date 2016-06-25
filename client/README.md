# StarHackIt React Frontend

An ES6 React based frontend starter kit:

* ES6/ES7 with `babel`
* Internationalization with `i18next` and `react-intl`
* Find bugs, enforce coding standards with `eslint` and its plugins: `react`, `promise`, `mocha`
* Hot reloading with `react-hot-loader`
* Copy and paste detector with `jscpd`
* Display lint warnings and build errors to directly to the browser with `webpack-hud`
* Unit tests with `karma`, `mocha` and `enzyme`
* Code coverage with `istanbul`
* End to end tests with `nightwatch`
* Concatenation, minification, obfuscation and compression of javascript and css file
* Bundle size and dependencies size under control
* Logging with the `debug` library
* Configuration depending of the environment: dev, uat, prod etc ...

## Development and build process

[npm](https://www.npmjs.com/) is used to define the 3rd party dependencies required by the frontend. *npm* comes with [node](https://nodejs.org) so make sure there are already installed:

    $ node -v
    v5.6

    $ npm -v
    3.6

These are the main *npm* commands for a normal developer workflow:

| npm command    | details  |
|----------------|----------|
| `npm install`  | Install dependencies  |
| `npm start`    | Start a development web server  |
| `npm test`     |  Run the unit tests with Karma |
| `npm run e2e`  |  Intall the Selenium driver for end to end testing |
| `npm run selenium-install`  |  Run the end to end tests with Nigthwatch/Selenium |
| `npm run unit-test-watch` |  Watch the code and run the unit test |
| `npm run build`| Create a production build  |
| `npm run bundle-size`| Create a report to show the size of each dependencies |
| `npm run clean`| Clean the project |
| `npm run lint`| Lint the source code |
| `npm run cpd`| Run the copy and paste detector |

### Install

To download and install the dependencies set in [package.json](package.json):

    $ npm install

### Build & Serve

[Webpack](https://webpack.github.io/) has become the defacto standard for building React frontend, it is configured through 3 files:

* [webpack.config.js](webpack.config.js): the configuration common to all environment.
* [webpack.dev.js](webpack.dev.js): the configuration for development environment. Thanks to the Webpack plugin `OpenBrowserPlugin`, a new browser page will be opened at the right URL i.e: `http://localhost:8080`
* [webpack.prod.js](webpack.prod.js): the configuration for production environment. The `DedupePlugin`, `UglifyJsPlugin` and the `CompressionPlugin` plugins are invoked to respectively remove code duplication, obfuscate and compress the code.

To run the development web server:

    $ npm start

> **Hot reloading**: Webpack detects any change in the code, it rebuilds automatically and pushes the new change the browser, no manual browser refresh required.

### Test

#### Unit test with Karma

Unit tests are written as `mocha` test and executed thanks to `karma`:

    $ npm test

> React components are tested with the [enzyme](http://airbnb.io/enzyme/) library.

#### End to end testing with nightwatch

To execute the end to end testing, a.k.a _e2e testing_, first make sure the frontend and backend are running, then run:

    $ npm run selenium-install
    $ npm run nightwatch

The end to end tests are executed by [nightwatch](http://nightwatchjs.org/) which uses the *Selenium* driver API.

The test suite can be found in [test/nightwatch](test/nightwatch)

## Configuration

The file [src/app/config.js](src/app/config.js) gathers the common configuration and the environment specific configuration which is selected by defining the variable `NODE_ENV` to `production`, `development`, `uat` etc ...
The `NODE_ENV` variable is injected through the *webpack* plugin `DefinePlugin`.

## Logging

The [debug](https://github.com/visionmedia/debug) library is a convenient way to log messages with prefix.
Messages can be switch on and off depending on the prefix, see [src/app/app.js](src/app/app.js)

## CORS

To avoid [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues, the *webpack* development server is configured to act as a proxy server, requests beginning with `/api/v1/` are forwarded to the api server located at `http://localhost:9000`. See the *gulp* task `webpack-dev-server` in [gulpfile.js](gulpfile.js)

## Internationalization

The [i18next](http://i18next.com/) provides internationalization support for this project. Translations are retrieved at run time without bloating the application with all translations.

Here are the i18next plugins configured in [src/app/utils/i18n.js](src/app/utils/i18n.js):

* [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector): language detector used in browser environment for i18next
* [i18next-localstorage-cache](https://github.com/i18next/i18next-localStorage-cache): caching layer for i18next using browsers localStorage
* [i18next-xhr-backend](https://github.com/i18next/i18next-xhr-backend): backend layer for i18next using browsers xhr

The translation files are located in [locales](locales) directory.

In your *React* component, import the `i18next` package and invoke the `t` function to translate the given key:


```
import tr from 'i18next';

...

    <h2 >{tr.t('login')}</h2>
```


### Production build

To build the production version:

    $ npm run build

*webpack* will produce a report with all the assets and their respective size.

```
Version: webpack 1.12.13
Time: 97299ms
                                  Asset       Size  Chunks             Chunk Names
   89889688147bd7575d6327160d64e760.svg     109 kB          [emitted]  
                7a861be0091fbbaa4f64.js    55.4 kB       1  [emitted]  
                              vendor.js     547 kB       2  [emitted]  vendor
           app.95220f341cac6905303b.css    3.19 kB       0  [emitted]  app
        vendor.1e522f46db71337f5a73.css     318 kB       2  [emitted]  vendor
             7a861be0091fbbaa4f64.js.gz    15.2 kB          [emitted]  
89889688147bd7575d6327160d64e760.svg.gz    26.8 kB          [emitted]  
         app.95220f341cac6905303b.js.gz    66.2 kB          [emitted]  
     vendor.1e522f46db71337f5a73.css.gz     123 kB          [emitted]  
                           vendor.js.gz     159 kB          [emitted]  
                             index.html    1.36 kB          [emitted]  
                            favicon.ico    1.15 kB          [emitted]  
            app.95220f341cac6905303b.js     304 kB       0  [emitted]  app

```

To find out exactly the weight of each individual library, the tool [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

```
$ npm run bundle-size

react: 602.07 KB (19.3%)    
  <self>: 602.07 KB (100%)
material-ui: 403.26 KB (12.9%)
  <self>: 403.26 KB (100%)
lodash: 401.81 KB (12.9%)
  <self>: 401.81 KB (100%)
intl: 163.4 KB (5.24%)
  <self>: 163.4 KB (100%)
bootstrap: 139.6 KB (4.48%)
  <self>: 139.6 KB (100%)
react-router: 131.37 KB (4.21%)
  history: 46.46 KB (35.4%)
    <self>: 46.46 KB (100%)
  <self>: 84.92 KB (64.6%)
moment: 121.08 KB (3.88%)
  <self>: 121.08 KB (100%)
i18next: 82.05 KB (2.63%)
  <self>: 82.05 KB (100%)
react-helmet: 73.5 KB (2.36%)
  core-js: 42.9 KB (58.4%)
    <self>: 42.9 KB (100%)
  react-side-effect: 4.76 KB (6.48%)
    <self>: 4.76 KB (100%)
  fbjs: 2.31 KB (3.15%)
    <self>: 2.31 KB (100%)
  <self>: 23.53 KB (32.0%)
react-pagify: 66.91 KB (2.15%)
  lodash.merge: 33.13 KB (49.5%)
    <self>: 33.13 KB (100%)
  lodash.keys: 11.26 KB (16.8%)
    <self>: 11.26 KB (100%)
  lodash.keysin: 11.17 KB (16.7%)
    <self>: 11.17 KB (100%)
  lodash.isplainobject: 3.11 KB (4.64%)
    <self>: 3.11 KB (100%)
  <self>: 8.24 KB (12.3%)
when: 60.25 KB (1.93%)
  <self>: 60.25 KB (100%)
react-intl: 55.29 KB (1.77%)
  <self>: 55.29 KB (100%)
inline-style-prefixer: 42.29 KB (1.36%)
  <self>: 42.29 KB (100%)
intl-messageformat-parser: 36.82 KB (1.18%)
  <self>: 36.82 KB (100%)
fbjs: 32.93 KB (1.06%)
  <self>: 32.93 KB (100%)
es6-promise: 31.49 KB (1.01%)
  <self>: 31.49 KB (100%)
checkit: 29.25 KB (0.938%)
  <self>: 29.25 KB (100%)
reflux-core: 27.18 KB (0.872%)
  <self>: 27.18 KB (100%)
axios: 26.04 KB (0.835%)
  <self>: 26.04 KB (100%)
ladda: 21.33 KB (0.684%)
  <self>: 21.33 KB (100%)
reactabular: 20.3 KB (0.651%)
  <self>: 20.3 KB (100%)
intl-messageformat: 17.18 KB (0.551%)
  <self>: 17.18 KB (100%)
intl-relativeformat: 14.66 KB (0.470%)
  <self>: 14.66 KB (100%)
react-textarea-autosize: 13.38 KB (0.429%)
  <self>: 13.38 KB (100%)
qs: 13.18 KB (0.423%)
  <self>: 13.18 KB (100%)
lodash._mapcache: 12.38 KB (0.397%)
  <self>: 12.38 KB (100%)
react-ga: 9.91 KB (0.318%)
  <self>: 9.91 KB (100%)
i18next-xhr-backend: 9.7 KB (0.311%)
  <self>: 9.7 KB (100%)
i18next-browser-languagedetector: 9.14 KB (0.293%)
  <self>: 9.14 KB (100%)
bowser: 8.52 KB (0.273%)
  <self>: 8.52 KB (100%)
lodash.merge: 8.33 KB (0.267%)
  <self>: 8.33 KB (100%)
react-tap-event-plugin: 8.02 KB (0.257%)
  fbjs: 1.09 KB (13.6%)
    <self>: 1.09 KB (100%)
  <self>: 6.93 KB (86.4%)
debug: 7.67 KB (0.246%)
  <self>: 7.67 KB (100%)
style-loader: 7.04 KB (0.226%)
  <self>: 7.04 KB (100%)
eventemitter3: 7 KB (0.225%)
  <self>: 7 KB (100%)
lodash.debounce: 6.89 KB (0.221%)
  <self>: 6.89 KB (100%)
lodash.rest: 6.74 KB (0.216%)
  <self>: 6.74 KB (100%)
lodash.keys: 6.46 KB (0.207%)
  <self>: 6.46 KB (100%)
lodash.isarguments: 6.24 KB (0.200%)
  <self>: 6.24 KB (100%)
reflux: 6.09 KB (0.195%)
  <self>: 6.09 KB (100%)
lodash._stack: 5.77 KB (0.185%)
  <self>: 5.77 KB (100%)
core-js: 5.29 KB (0.170%)
  <self>: 5.29 KB (100%)
lodash.isarray: 5.04 KB (0.162%)
  <self>: 5.04 KB (100%)
reflux-promise: 4.7 KB (0.151%)
  <self>: 4.7 KB (100%)
i18next-localstorage-cache: 4.03 KB (0.129%)
  <self>: 4.03 KB (100%)
lodash.istypedarray: 4.02 KB (0.129%)
  <self>: 4.02 KB (100%)
lodash._isiterateecall: 3.96 KB (0.127%)
  <self>: 3.96 KB (100%)
react-side-effect: 3.95 KB (0.127%)
  fbjs: 2.72 KB (68.8%)
    <self>: 2.72 KB (100%)
  <self>: 1.23 KB (31.2%)
deep-equal: 3.8 KB (0.122%)
  <self>: 3.8 KB (100%)
lodash._getnative: 3.78 KB (0.121%)
  <self>: 3.78 KB (100%)
lodash.keysin: 3.75 KB (0.120%)
  <self>: 3.75 KB (100%)
lodash.throttle: 3.45 KB (0.111%)
  <self>: 3.45 KB (100%)
cookie: 3.29 KB (0.106%)
  <self>: 3.29 KB (100%)
lodash.isplainobject: 3.17 KB (0.102%)
  <self>: 3.17 KB (100%)
intl-format-cache: 2.86 KB (0.0917%)
  <self>: 2.86 KB (100%)
ms: 2.28 KB (0.0731%)
  <self>: 2.28 KB (100%)
lodash.restparam: 2.26 KB (0.0726%)
  <self>: 2.26 KB (100%)
babel-runtime: 2.11 KB (0.0676%)
  <self>: 2.11 KB (100%)
react-ladda: 2.04 KB (0.0654%)
  <self>: 2.04 KB (100%)
process: 2.01 KB (0.0644%)
  <self>: 2.01 KB (100%)
lodash._root: 1.87 KB (0.0601%)
  <self>: 1.87 KB (100%)
lodash._bindcallback: 1.86 KB (0.0598%)
  <self>: 1.86 KB (100%)
lodash.flowright: 1.84 KB (0.0590%)
  <self>: 1.84 KB (100%)
react-cookie: 1.82 KB (0.0584%)
  <self>: 1.82 KB (100%)
lodash._createassigner: 1.79 KB (0.0575%)
  <self>: 1.79 KB (100%)
warning: 1.76 KB (0.0566%)
  <self>: 1.76 KB (100%)
react-doc-meta: 1.56 KB (0.0500%)
  <self>: 1.56 KB (100%)
lodash._basefor: 1.53 KB (0.0489%)
  <self>: 1.53 KB (100%)
invariant: 1.48 KB (0.0475%)
  <self>: 1.48 KB (100%)
css-loader: 1.47 KB (0.0472%)
  <self>: 1.47 KB (100%)
query-string: 1.44 KB (0.0461%)
  <self>: 1.44 KB (100%)
lodash.toplainobject: 1.1 KB (0.0353%)
  <self>: 1.1 KB (100%)
classnames: 1.08 KB (0.0345%)
  <self>: 1.08 KB (100%)
segmentize: 1 KB (0.0321%)
  <self>: 1 KB (100%)
lodash._basecopy: 954 B (0.0299%)
  <self>: 954 B (100%)
lodash._arrayeach: 942 B (0.0295%)
  <self>: 942 B (100%)
lodash._arraycopy: 863 B (0.0270%)
  <self>: 863 B (100%)
inherits: 672 B (0.0211%)
  <self>: 672 B (100%)
material-ui/lib/TextField/index.js|/Users/frederic/starhackit/client: 350 B (0.0110%)
  <self>: 0 B (0.00%)
webpack: 336 B (0.0105%)
  <self>: 336 B (100%)
intl-messageformat/lib/main.js|/Users/frederic/starhackit/client: 288 B (0.00902%)
  <self>: 0 B (0.00%)
strict-uri-encode: 182 B (0.00570%)
  <self>: 182 B (100%)
react-addons-pure-render-mixin: 72 B (0.00226%)
  <self>: 72 B (100%)
react-dom: 63 B (0.00197%)
  <self>: 63 B (100%)
react-addons-create-fragment: 59 B (0.00185%)
  <self>: 59 B (100%)
react-addons-transition-group: 59 B (0.00185%)
  <self>: 59 B (100%)
react-addons-linked-state-mixin: 55 B (0.00172%)
  <self>: 55 B (100%)
react-addons-update: 45 B (0.00141%)
  <self>: 45 B (100%)
intl .: 15 B (0.000470%)
  <self>: 15 B (100%)
intl-messageformat .: 15 B (0.000470%)
  <self>: 15 B (100%)
intl-relativeformat .: 15 B (0.000470%)
  <self>: 15 B (100%)
<self>: 272.65 KB (8.75%)

```
