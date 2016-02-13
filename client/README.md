# StarHackIt React Frontend

An ES6 React based Frontend starter kit.

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
Time: 232605ms
                                  Asset       Size  Chunks             Chunk Names
                           vendor.js.gz     192 kB          [emitted]  
   f4769f9bdb7466be65088239c12046d1.eot    20.1 kB          [emitted]  
  fa2772327f55d8198301fdb8bcfc8158.woff    23.4 kB          [emitted]  
   e18bbf611f2a2e43afc071aa2f4e1512.ttf    45.4 kB          [emitted]  
   89889688147bd7575d6327160d64e760.svg     109 kB          [emitted]  
   32400f4e08932a94d8bfd2422702c446.eot    70.8 kB          [emitted]  
 db812d8a70a4e88e888744c1c9a27e89.woff2    66.6 kB          [emitted]  
  a35720c2fed2c7f043bc7e4ffb45e073.woff    83.6 kB          [emitted]  
   a3de2170e4e9df77161ea5d3f31b2668.ttf     142 kB          [emitted]  
   f775f9cca88e21d45bebe185b27c0e5b.svg     366 kB          [emitted]  
            app.3a4a2b4005aa04943b48.js     294 kB       0  [emitted]  app
                cdb54c2343bdc084a6ba.js    54.3 kB       1  [emitted]  
                              vendor.js     666 kB       2  [emitted]  vendor
           app.3a4a2b4005aa04943b48.css     5.5 kB       0  [emitted]  app
        vendor.66dd96318dba1d00b1f4.css     132 kB       2  [emitted]  vendor
             cdb54c2343bdc084a6ba.js.gz    14.9 kB          [emitted]  
e18bbf611f2a2e43afc071aa2f4e1512.ttf.gz    23.4 kB          [emitted]  
89889688147bd7575d6327160d64e760.svg.gz    26.8 kB          [emitted]  
     vendor.66dd96318dba1d00b1f4.css.gz    20.4 kB          [emitted]  
         app.3a4a2b4005aa04943b48.js.gz    63.6 kB          [emitted]  
a3de2170e4e9df77161ea5d3f31b2668.ttf.gz    83.6 kB          [emitted]  
f775f9cca88e21d45bebe185b27c0e5b.svg.gz     111 kB          [emitted]  
 448c34a56d699c29117adc64c43affeb.woff2      18 kB          [emitted]  
                             index.html    1.36 kB          [emitted]  

```

To find out exactly the weight of each individual library, the tool [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

```
$ npm run bundle-size

react: 602.07 KB (19.0%)    
  <self>: 602.07 KB (100%)
moment: 411.37 KB (13.0%)
  <self>: 411.37 KB (100%)
lodash: 401.81 KB (12.7%)
  <self>: 401.81 KB (100%)
material-ui: 367.95 KB (11.6%)
  <self>: 367.95 KB (100%)
intl: 158.28 KB (5.01%)
  <self>: 158.28 KB (100%)
i18next: 82.05 KB (2.60%)
  <self>: 82.05 KB (100%)
react-helmet: 73.5 KB (2.33%)
  core-js: 42.9 KB (58.4%)
    <self>: 42.9 KB (100%)
  react-side-effect: 4.76 KB (6.48%)
    <self>: 4.76 KB (100%)
  fbjs: 2.31 KB (3.15%)
    <self>: 2.31 KB (100%)
  <self>: 23.53 KB (32.0%)
react-router: 72.15 KB (2.28%)
  <self>: 72.15 KB (100%)
when: 60.25 KB (1.91%)
  <self>: 60.25 KB (100%)
react-intl: 55.29 KB (1.75%)
  <self>: 55.29 KB (100%)
history: 52.88 KB (1.67%)
  <self>: 52.88 KB (100%)
inline-style-prefixer: 42.29 KB (1.34%)
  <self>: 42.29 KB (100%)
intl-messageformat-parser: 36.82 KB (1.16%)
  <self>: 36.82 KB (100%)
fbjs: 32.93 KB (1.04%)
  <self>: 32.93 KB (100%)
es6-promise: 31.55 KB (0.998%)
  <self>: 31.55 KB (100%)
checkit: 29.25 KB (0.925%)
  <self>: 29.25 KB (100%)
font-awesome: 29.21 KB (0.924%)
  <self>: 29.21 KB (100%)
reflux-core: 27.18 KB (0.860%)
  <self>: 27.18 KB (100%)
axios: 26.04 KB (0.824%)
  <self>: 26.04 KB (100%)
ladda: 21.33 KB (0.675%)
  <self>: 21.33 KB (100%)
reactabular: 20.3 KB (0.642%)
  <self>: 20.3 KB (100%)
intl-messageformat: 17.18 KB (0.543%)
  <self>: 17.18 KB (100%)
intl-relativeformat: 14.66 KB (0.464%)
  <self>: 14.66 KB (100%)
react-textarea-autosize: 13.38 KB (0.423%)
  <self>: 13.38 KB (100%)
qs: 13.18 KB (0.417%)
  <self>: 13.18 KB (100%)
react-ga: 9.91 KB (0.313%)
  <self>: 9.91 KB (100%)
i18next-xhr-backend: 9.7 KB (0.307%)
  <self>: 9.7 KB (100%)
i18next-browser-languagedetector: 9.14 KB (0.289%)
  <self>: 9.14 KB (100%)
bowser: 8.52 KB (0.270%)
  <self>: 8.52 KB (100%)
lodash.merge: 8.33 KB (0.264%)
  <self>: 8.33 KB (100%)
react-pagify: 8.19 KB (0.259%)
  <self>: 8.19 KB (100%)
react-tap-event-plugin: 8.02 KB (0.254%)
  fbjs: 1.09 KB (13.6%)
    <self>: 1.09 KB (100%)
  <self>: 6.93 KB (86.4%)
debug: 7.67 KB (0.243%)
  <self>: 7.67 KB (100%)
style-loader: 7.04 KB (0.223%)
  <self>: 7.04 KB (100%)
eventemitter3: 7 KB (0.222%)
  <self>: 7 KB (100%)
lodash.debounce: 6.89 KB (0.218%)
  <self>: 6.89 KB (100%)
lodash.keys: 6.46 KB (0.204%)
  <self>: 6.46 KB (100%)
lodash.isarguments: 6.24 KB (0.197%)
  <self>: 6.24 KB (100%)
reflux: 6.09 KB (0.193%)
  <self>: 6.09 KB (100%)
core-js: 5.29 KB (0.167%)
  <self>: 5.29 KB (100%)
lodash.isarray: 5.04 KB (0.160%)
  <self>: 5.04 KB (100%)
reflux-promise: 4.7 KB (0.149%)
  <self>: 4.7 KB (100%)
i18next-localstorage-cache: 4.03 KB (0.128%)
  <self>: 4.03 KB (100%)
lodash.istypedarray: 4.02 KB (0.127%)
  <self>: 4.02 KB (100%)
lodash._isiterateecall: 3.96 KB (0.125%)
  <self>: 3.96 KB (100%)
react-side-effect: 3.95 KB (0.125%)
  fbjs: 2.72 KB (68.8%)
    <self>: 2.72 KB (100%)
  <self>: 1.23 KB (31.2%)
deep-equal: 3.8 KB (0.120%)
  <self>: 3.8 KB (100%)
lodash._getnative: 3.78 KB (0.120%)
  <self>: 3.78 KB (100%)
lodash.keysin: 3.75 KB (0.119%)
  <self>: 3.75 KB (100%)
lodash.throttle: 3.45 KB (0.109%)
  <self>: 3.45 KB (100%)
cookie: 3.29 KB (0.104%)
  <self>: 3.29 KB (100%)
lodash.isplainobject: 3.17 KB (0.100%)
  <self>: 3.17 KB (100%)
intl-format-cache: 2.86 KB (0.0905%)
  <self>: 2.86 KB (100%)
ms: 2.28 KB (0.0720%)
  <self>: 2.28 KB (100%)
lodash.restparam: 2.26 KB (0.0716%)
  <self>: 2.26 KB (100%)
babel-runtime: 2.11 KB (0.0666%)
  <self>: 2.11 KB (100%)
react-ladda: 2.04 KB (0.0645%)
  <self>: 2.04 KB (100%)
process: 2.01 KB (0.0635%)
  <self>: 2.01 KB (100%)
lodash._bindcallback: 1.86 KB (0.0589%)
  <self>: 1.86 KB (100%)
lodash.flowright: 1.84 KB (0.0582%)
  <self>: 1.84 KB (100%)
react-cookie: 1.82 KB (0.0576%)
  <self>: 1.82 KB (100%)
lodash._createassigner: 1.79 KB (0.0567%)
  <self>: 1.79 KB (100%)
warning: 1.76 KB (0.0558%)
  <self>: 1.76 KB (100%)
react-doc-meta: 1.56 KB (0.0493%)
  <self>: 1.56 KB (100%)
lodash._basefor: 1.53 KB (0.0483%)
  <self>: 1.53 KB (100%)
invariant: 1.48 KB (0.0468%)
  <self>: 1.48 KB (100%)
css-loader: 1.47 KB (0.0465%)
  <self>: 1.47 KB (100%)
query-string: 1.44 KB (0.0455%)
  <self>: 1.44 KB (100%)
lodash.toplainobject: 1.1 KB (0.0348%)
  <self>: 1.1 KB (100%)
classnames: 1.08 KB (0.0340%)
  <self>: 1.08 KB (100%)
segmentize: 1 KB (0.0317%)
  <self>: 1 KB (100%)
lodash._basecopy: 954 B (0.0295%)
  <self>: 954 B (100%)
lodash._arrayeach: 942 B (0.0291%)
  <self>: 942 B (100%)
lodash._arraycopy: 863 B (0.0267%)
  <self>: 863 B (100%)
inherits: 672 B (0.0208%)
  <self>: 672 B (100%)
bootstrap: 413 B (0.0128%)
  <self>: 413 B (100%)
material-ui/lib/TextField/index.js|/Users/frederic/starhackit/client: 350 B (0.0108%)
  <self>: 0 B (0.00%)
webpack: 336 B (0.0104%)
  <self>: 336 B (100%)
intl-messageformat/lib/main.js|/Users/frederic/starhackit/client: 288 B (0.00890%)
  <self>: 0 B (0.00%)
strict-uri-encode: 182 B (0.00562%)
  <self>: 182 B (100%)
react-addons-pure-render-mixin: 72 B (0.00222%)
  <self>: 72 B (100%)
react-dom: 63 B (0.00195%)
  <self>: 63 B (100%)
react-addons-transition-group: 59 B (0.00182%)
  <self>: 59 B (100%)
react-addons-create-fragment: 59 B (0.00182%)
  <self>: 59 B (100%)
react-addons-linked-state-mixin: 55 B (0.00170%)
  <self>: 55 B (100%)
react-addons-update: 45 B (0.00139%)
  <self>: 45 B (100%)
intl-relativeformat .: 15 B (0.000463%)
  <self>: 15 B (100%)
intl .: 15 B (0.000463%)
  <self>: 15 B (100%)
intl-messageformat .: 15 B (0.000463%)
  <self>: 15 B (100%)
<self>: 268.12 KB (8.48%)

```
