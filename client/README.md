# StarHackIt React Frontend

An ES6 React based Frontend starter kit.

## Development and build process

[npm](https://www.npmjs.com/) is used to define the 3rd party dependencies required by the frontend. *npm* comes with [node](https://nodejs.org) so make sure there are already installed:

    $ node -v
    v4.2.2

    $ npm -v
    2.14.7

These are the main *npm* commands for a normal developer workflow:

| npm command    | details  |
|----------------|----------|
| `npm install`  | Install dependencies  |
| `npm start`    | Start a development web server  |
| `npm test`     |  Perform the end to end testing |
| `npm run build`| Create a production build  |
| `npm run bundle-size`| Create a report to show the size of each dependencies |

### Install

To download and install the dependencies set in [package.json](package.json):

    $ npm install

The `postinstall` npm script also installs the [Selenium](http://www.seleniumhq.org/) driver locally for end to end testing.

### Build & Serve

[Webpack](https://webpack.github.io/) has become the defacto standard for building React frontend, it is configured through 3 files:

* [webpack.config.js](webpack.config.js): the configuration common to all environment.
* [webpack.dev.js](webpack.dev.js): the configuration for development environment. Thanks to the Webpack plugin `OpenBrowserPlugin`, a new browser page will be opened at the right URL i.e: `http://localhost:8080`
* [webpack.prod.js](webpack.prod.js): the configuration for production environment. The `DedupePlugin`, `UglifyJsPlugin` and the `CompressionPlugin` plugins are invoked to respectively remove code duplication, obfuscate and compress the code.

To run the development web server:

    $ npm start

> **Hot reloading**: Webpack detects any change in the code, it rebuilds automatically and pushes the new change the browser, no manual browser refresh required.

### Test

To execute the end to end testing, a.k.a _e2e testing_, first make sure the frontend and backend are running, then run:

    $ npm test

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

    $ npm build

*webpack* will produce a report with all the assets and their respective size.

```
Version: webpack 1.12.13
Time: 112794ms
                                  Asset       Size  Chunks             Chunk Names
f775f9cca88e21d45bebe185b27c0e5b.svg.gz     111 kB          [emitted]  
   f4769f9bdb7466be65088239c12046d1.eot    20.1 kB          [emitted]  
  fa2772327f55d8198301fdb8bcfc8158.woff    23.4 kB          [emitted]  
   e18bbf611f2a2e43afc071aa2f4e1512.ttf    45.4 kB          [emitted]  
   89889688147bd7575d6327160d64e760.svg     109 kB          [emitted]  
   32400f4e08932a94d8bfd2422702c446.eot    70.8 kB          [emitted]  
 db812d8a70a4e88e888744c1c9a27e89.woff2    66.6 kB          [emitted]  
  a35720c2fed2c7f043bc7e4ffb45e073.woff    83.6 kB          [emitted]  
   a3de2170e4e9df77161ea5d3f31b2668.ttf     142 kB          [emitted]  
   f775f9cca88e21d45bebe185b27c0e5b.svg     366 kB          [emitted]  
            app.eed40199d2a8825dece0.js     294 kB       0  [emitted]  app
                73ebcf9d7b9014997d10.js    54.3 kB       1  [emitted]  
                              vendor.js     681 kB       2  [emitted]  vendor
           app.eed40199d2a8825dece0.css     5.5 kB       0  [emitted]  app
        vendor.9d779207507930899248.css     132 kB       2  [emitted]  vendor
             73ebcf9d7b9014997d10.js.gz    14.9 kB          [emitted]  
e18bbf611f2a2e43afc071aa2f4e1512.ttf.gz    23.4 kB          [emitted]  
89889688147bd7575d6327160d64e760.svg.gz    26.8 kB          [emitted]  
     vendor.9d779207507930899248.css.gz    20.5 kB          [emitted]  
         app.eed40199d2a8825dece0.js.gz    63.6 kB          [emitted]  
a3de2170e4e9df77161ea5d3f31b2668.ttf.gz    83.6 kB          [emitted]  
                           vendor.js.gz     197 kB          [emitted]  
 448c34a56d699c29117adc64c43affeb.woff2      18 kB          [emitted]  
                             index.html    1.36 kB          [emitted]  
                            favicon.ico    1.15 kB          [emitted]

```

To find out exactly the weight of each individual library, the tool [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

```
$ npm run bundle-size

react: 635 KB (19.4%)       
  fbjs: 32.93 KB (5.19%)
    <self>: 32.93 KB (100%)
  <self>: 602.07 KB (94.8%)
material-ui: 492.71 KB (15.1%)
  lodash.merge: 55.98 KB (11.4%)
    lodash._createassigner: 9.88 KB (17.6%)
      lodash._isiterateecall: 3.96 KB (40.1%)
        <self>: 3.96 KB (100%)
      lodash.restparam: 2.26 KB (22.9%)
        <self>: 2.26 KB (100%)
      lodash._bindcallback: 1.86 KB (18.9%)
        <self>: 1.86 KB (100%)
      <self>: 1.79 KB (18.1%)
    lodash.keys: 6.46 KB (11.5%)
      <self>: 6.46 KB (100%)
    lodash.isarguments: 6.24 KB (11.1%)
      <self>: 6.24 KB (100%)
    lodash.isarray: 5.04 KB (9.01%)
      <self>: 5.04 KB (100%)
    lodash.isplainobject: 4.69 KB (8.38%)
      lodash._basefor: 1.53 KB (32.5%)
        <self>: 1.53 KB (100%)
      <self>: 3.17 KB (67.5%)
    lodash.istypedarray: 4.02 KB (7.19%)
      <self>: 4.02 KB (100%)
    lodash._getnative: 3.78 KB (6.75%)
      <self>: 3.78 KB (100%)
    lodash.keysin: 3.75 KB (6.70%)
      <self>: 3.75 KB (100%)
    lodash.toplainobject: 2.03 KB (3.63%)
      lodash._basecopy: 954 B (45.8%)
        <self>: 954 B (100%)
      <self>: 1.1 KB (54.2%)
    lodash._arrayeach: 942 B (1.64%)
      <self>: 942 B (100%)
    lodash._arraycopy: 863 B (1.51%)
      <self>: 863 B (100%)
    <self>: 8.33 KB (14.9%)
  inline-style-prefixer: 50.82 KB (10.3%)
    bowser: 8.52 KB (16.8%)
      <self>: 8.52 KB (100%)
    <self>: 42.29 KB (83.2%)
  lodash.throttle: 14.12 KB (2.87%)
    lodash.debounce: 10.67 KB (75.6%)
      lodash._getnative: 3.78 KB (35.4%)
        <self>: 3.78 KB (100%)
      <self>: 6.89 KB (64.6%)
    <self>: 3.45 KB (24.4%)
  lodash.flowright: 1.84 KB (0.374%)
    <self>: 1.84 KB (100%)
  warning: 1.76 KB (0.358%)
    <self>: 1.76 KB (100%)
  react-addons-pure-render-mixin: 72 B (0.0143%)
    <self>: 72 B (100%)
  react-addons-create-fragment: 59 B (0.0117%)
    <self>: 59 B (100%)
  react-addons-transition-group: 59 B (0.0117%)
    <self>: 59 B (100%)
  react-addons-update: 45 B (0.00892%)
    <self>: 45 B (100%)
  <self>: 367.95 KB (74.7%)
moment: 411.37 KB (12.6%)
  <self>: 411.37 KB (100%)
lodash: 401.81 KB (12.3%)
  <self>: 401.81 KB (100%)
intl: 158.28 KB (4.85%)
  <self>: 158.28 KB (100%)
react-intl: 128.6 KB (3.94%)
  intl-messageformat: 54 KB (42.0%)
    intl-messageformat-parser: 36.82 KB (68.2%)
      <self>: 36.82 KB (100%)
    <self>: 17.18 KB (31.8%)
  intl-relativeformat: 14.66 KB (11.4%)
    <self>: 14.66 KB (100%)
  intl-format-cache: 2.86 KB (2.22%)
    <self>: 2.86 KB (100%)
  invariant: 1.48 KB (1.15%)
    <self>: 1.48 KB (100%)
  intl-messageformat/lib/main.js|/Users/frederic/starhackit/client: 288 B (0.219%)
    <self>: 0 B (0.00%)
  intl-relativeformat .: 15 B (0.0114%)
    <self>: 15 B (100%)
  intl-messageformat .: 15 B (0.0114%)
    <self>: 15 B (100%)
  <self>: 55.29 KB (43.0%)
react-pagify: 96.12 KB (2.94%)
  lodash.merge: 87.88 KB (91.4%)
    lodash._stack: 18.16 KB (20.7%)
      lodash._mapcache: 12.38 KB (68.2%)
        <self>: 12.38 KB (100%)
      <self>: 5.77 KB (31.8%)
    lodash.keys: 11.26 KB (12.8%)
      <self>: 11.26 KB (100%)
    lodash.keysin: 11.17 KB (12.7%)
      <self>: 11.17 KB (100%)
    lodash.rest: 6.74 KB (7.67%)
      <self>: 6.74 KB (100%)
    lodash.isplainobject: 3.11 KB (3.54%)
      <self>: 3.11 KB (100%)
    lodash._root: 1.87 KB (2.13%)
      <self>: 1.87 KB (100%)
    lodash._basefor: 1.53 KB (1.74%)
      <self>: 1.53 KB (100%)
    lodash._arrayeach: 942 B (1.05%)
      <self>: 942 B (100%)
    <self>: 33.13 KB (37.7%)
  <self>: 8.24 KB (8.58%)
i18next: 82.05 KB (2.51%)
  <self>: 82.05 KB (100%)
react-helmet: 77.3 KB (2.37%)
  core-js: 42.9 KB (55.5%)
    <self>: 42.9 KB (100%)
  react-side-effect: 7.08 KB (9.15%)
    fbjs: 2.31 KB (32.7%)
      <self>: 2.31 KB (100%)
    <self>: 4.76 KB (67.3%)
  deep-equal: 3.8 KB (4.92%)
    <self>: 3.8 KB (100%)
  <self>: 23.53 KB (30.4%)
react-router: 75.4 KB (2.31%)
  warning: 1.76 KB (2.34%)
    <self>: 1.76 KB (100%)
  invariant: 1.48 KB (1.96%)
    <self>: 1.48 KB (100%)
  <self>: 72.15 KB (95.7%)
history: 64.52 KB (1.98%)
  deep-equal: 3.8 KB (5.89%)
    <self>: 3.8 KB (100%)
  deep-equal/index.js|/Users/frederic/starhackit/client: 2.98 KB (4.62%)
    <self>: 0 B (0.00%)
  warning: 1.76 KB (2.73%)
    <self>: 1.76 KB (100%)
  query-string: 1.62 KB (2.50%)
    strict-uri-encode: 182 B (11.0%)
      <self>: 182 B (100%)
    <self>: 1.44 KB (89.0%)
  invariant: 1.48 KB (2.29%)
    <self>: 1.48 KB (100%)
  <self>: 52.88 KB (82.0%)
when: 60.25 KB (1.84%)
  <self>: 60.25 KB (100%)
reflux-core: 34.18 KB (1.05%)
  eventemitter3: 7 KB (20.5%)
    <self>: 7 KB (100%)
  <self>: 27.18 KB (79.5%)
es6-promise: 31.55 KB (0.966%)
  <self>: 31.55 KB (100%)
checkit: 29.91 KB (0.916%)
  inherits: 672 B (2.19%)
    <self>: 672 B (100%)
  <self>: 29.25 KB (97.8%)
font-awesome: 29.21 KB (0.894%)
  <self>: 29.21 KB (100%)
axios: 26.04 KB (0.797%)
  <self>: 26.04 KB (100%)
ladda: 21.33 KB (0.653%)
  <self>: 21.33 KB (100%)
reactabular: 20.3 KB (0.622%)
  <self>: 20.3 KB (100%)
react-textarea-autosize: 13.38 KB (0.410%)
  <self>: 13.38 KB (100%)
qs: 13.18 KB (0.404%)
  <self>: 13.18 KB (100%)
debug: 9.95 KB (0.305%)
  ms: 2.28 KB (22.9%)
    <self>: 2.28 KB (100%)
  <self>: 7.67 KB (77.1%)
react-ga: 9.91 KB (0.303%)
  <self>: 9.91 KB (100%)
i18next-xhr-backend: 9.7 KB (0.297%)
  <self>: 9.7 KB (100%)
react-tap-event-plugin: 8.02 KB (0.246%)
  fbjs: 1.09 KB (13.6%)
    <self>: 1.09 KB (100%)
  <self>: 6.93 KB (86.4%)
babel-runtime: 7.4 KB (0.226%)
  core-js: 5.29 KB (71.5%)
    <self>: 5.29 KB (100%)
  <self>: 2.11 KB (28.5%)
style-loader: 7.04 KB (0.216%)
  <self>: 7.04 KB (100%)
reflux: 6.09 KB (0.187%)
  <self>: 6.09 KB (100%)
react-doc-meta: 5.51 KB (0.169%)
  react-side-effect: 3.95 KB (71.7%)
    fbjs: 2.72 KB (68.8%)
      <self>: 2.72 KB (100%)
    <self>: 1.23 KB (31.2%)
  <self>: 1.56 KB (28.3%)
react-cookie: 5.11 KB (0.157%)
  cookie: 3.29 KB (64.4%)
    <self>: 3.29 KB (100%)
  <self>: 1.82 KB (35.6%)
reflux-promise: 4.7 KB (0.144%)
  <self>: 4.7 KB (100%)
i18next-localstorage-cache: 4.03 KB (0.123%)
  <self>: 4.03 KB (100%)
webpack: 2.34 KB (0.0715%)
  node-libs-browser: 2.01 KB (86.0%)
    <self>: 0 B (0.00%)
  <self>: 336 B (14.0%)
react-ladda: 2.11 KB (0.0646%)
  react-addons-pure-render-mixin: 72 B (3.33%)
    <self>: 72 B (100%)
  <self>: 2.04 KB (96.7%)
css-loader: 1.47 KB (0.0450%)
  <self>: 1.47 KB (100%)
classnames: 1.08 KB (0.0329%)
  <self>: 1.08 KB (100%)
segmentize: 1 KB (0.0306%)
  <self>: 1 KB (100%)
bootstrap: 413 B (0.0123%)
  <self>: 413 B (100%)
material-ui/lib/TextField/index.js|/Users/frederic/starhackit/client: 350 B (0.0105%)
  <self>: 0 B (0.00%)
react-dom: 63 B (0.00188%)
  <self>: 63 B (100%)
react-addons-linked-state-mixin: 55 B (0.00164%)
  <self>: 55 B (100%)
intl .: 15 B (0.000448%)
  <self>: 15 B (100%)
<self>: 277.4 KB (8.49%)

```
