# StarHackIt React Frontend

An ES6 React based frontend starter kit:

* ES6/ES7 with `babel`
* Internationalization with `i18next` and `react-intl`
* Find bugs, enforce coding standards with `eslint` and its plugins: `react`, `promise`, `mocha`.
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
| `npm run test:watch` |  Watch the code and run the unit test |
| `npm run selenium-install`  |  Intall the Selenium driver for end to end testing |
| `npm run e2e`  |  Run the end to end tests with Nigthwatch/Selenium |
| `npm run build`| Create a production build  |
| `npm run start:prod`| start a web server to serve the production build  |
| `npm run bundle-size`| Create a report to show the size of each dependencies |
| `npm run lint`| Lint the source code |
| `npm run cpd`| Run the copy and paste detector |
| `npm run clean`| Clean the project |

### Install

To download and install the dependencies set in [package.json](package.json):

    $ npm install

### Build & Serve

[Webpack](https://webpack.github.io/) has become the defacto standard for building React frontend, it is configured through 3 files:

* [webpack.config.js](webpack.config.js): the configuration common to all environment.
* [webpack.dev.js](webpack.dev.js): the configuration for development environment. Thanks to the Webpack plugin `OpenBrowserPlugin`, a new browser page will be opened at the right URL i.e: `http://localhost:8080`
* [webpack.prod.js](webpack.prod.js): the configuration for production environment. The `UglifyJsPlugin` and the `CompressionPlugin` plugins are invoked to respectively remove code duplication, obfuscate and compress the code.

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
    $ npm run e2e

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
Version: webpack 2.2.1
Time: 75371ms
                                Asset       Size  Chunks                    Chunk Names
                   assets/img/es7.png    7.54 kB          [emitted]
            0.69345a87444cda514c02.js    65.3 kB       0  [emitted]
          app.69345a87444cda514c02.js     493 kB       2  [emitted]  [big]  app
       vendor.69345a87444cda514c02.js     681 kB       3  [emitted]  [big]  vendor
        0.69345a87444cda514c02.js.map     470 kB       0  [emitted]
        1.69345a87444cda514c02.js.map    57.9 kB       1  [emitted]
      app.69345a87444cda514c02.js.map    3.39 MB       2  [emitted]         app
   vendor.69345a87444cda514c02.js.map    4.74 MB       3  [emitted]         vendor
         1.69345a87444cda514c02.js.gz    3.67 kB          [emitted]
     1.69345a87444cda514c02.js.map.gz    9.31 kB          [emitted]
         0.69345a87444cda514c02.js.gz    18.2 kB          [emitted]
       app.69345a87444cda514c02.js.gz     105 kB          [emitted]
    vendor.69345a87444cda514c02.js.gz     177 kB          [emitted]
     0.69345a87444cda514c02.js.map.gz     105 kB          [emitted]
   app.69345a87444cda514c02.js.map.gz     627 kB          [emitted]  [big]
vendor.69345a87444cda514c02.js.map.gz    1.04 MB          [emitted]  [big]

```

To find out exactly the weight of each individual library, the tool [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

```
$ npm run bundle-size

react-dom: 510.95 KB (15.7%)
material-ui: 363.37 KB (11.2%)
core-js: 256.05 KB (7.89%)
intl: 192.53 KB (5.93%)
lodash: 139.63 KB (4.30%)
mobx: 109.76 KB (3.38%)
react: 104.36 KB (3.22%)
react-s-alert: 80.15 KB (2.47%)
i18next: 76.49 KB (2.36%)
react-router: 74.46 KB (2.30%)
glamor: 66.29 KB (2.04%)
lodash.merge: 56.82 KB (1.75%)
buffer: 47.47 KB (1.46%)
history: 46.82 KB (1.44%)
mobx-react: 40.76 KB (1.26%)
react-helmet: 36.79 KB (1.13%)
react-redux: 36.22 KB (1.12%)
axios: 35.24 KB (1.09%)
inline-style-prefixer: 31.87 KB (0.982%)
reactabular-table: 31.84 KB (0.981%)
checkit: 31.25 KB (0.963%)
glamorous: 30.64 KB (0.944%)
fbjs: 30.46 KB (0.939%)
create-react-class: 27 KB (0.832%)
regenerator-runtime: 24.22 KB (0.747%)
ladda: 23.57 KB (0.726%)
prop-types: 21.42 KB (0.660%)
redux: 20.35 KB (0.627%)
qs: 16.67 KB (0.514%)
bowser: 16.56 KB (0.511%)
react-ga: 15.75 KB (0.486%)
redux-act: 13.15 KB (0.405%)
lodash.throttle: 13 KB (0.401%)
redux-logger: 12.79 KB (0.394%)
style-loader: 11.25 KB (0.347%)
deep-diff: 11.21 KB (0.346%)
react-router-redux: 11.05 KB (0.341%)
react-pagify: 9.71 KB (0.299%)
react-addons-create-fragment: 9.46 KB (0.292%)
i18next-browser-languagedetector: 9.08 KB (0.280%)
debug: 8.89 KB (0.274%)
react-event-listener: 8.5 KB (0.262%)
recompose: 8.14 KB (0.251%)
babel-runtime: 7.81 KB (0.241%)
react-tap-event-plugin: 7.29 KB (0.225%)
react-ladda: 7.27 KB (0.224%)
i18next-xhr-backend: 6.86 KB (0.211%)
lodash.keys: 6.46 KB (0.199%)
lodash.isarguments: 5.58 KB (0.172%)
redux-act-async: 5.38 KB (0.166%)
node-libs-browser: 5.17 KB (0.160%)
  process: 5.17 KB (100%)
  <self>: 0 B (0.00%)
i18next-localstorage-cache: 5.15 KB (0.159%)
lodash.isarray: 5.04 KB (0.155%)
react-side-effect: 4.62 KB (0.142%)
query-string: 4.15 KB (0.128%)
deep-equal: 3.8 KB (0.117%)
lodash._getnative: 3.78 KB (0.116%)
base64-js: 3.4 KB (0.105%)
lodash-es: 3.29 KB (0.101%)
keycode: 2.7 KB (0.0831%)
ms: 2.65 KB (0.0818%)
css-loader: 2.14 KB (0.0659%)
object-assign: 2.06 KB (0.0635%)
ieee754: 2.01 KB (0.0618%)
warning: 1.76 KB (0.0544%)
invariant: 1.48 KB (0.0456%)
hoist-non-react-statics: 1.35 KB (0.0418%)
shallowequal: 1.16 KB (0.0356%)
symbol-observable: 1.12 KB (0.0346%)
webpack: 1.09 KB (0.0335%)
classnames: 1.08 KB (0.0332%)
segmentize: 1 KB (0.0309%)
exenv: 863 B (0.0260%)
babel-polyfill: 833 B (0.0251%)
css-in-js-utils: 760 B (0.0229%)
inherits: 672 B (0.0202%)
redux-thunk: 529 B (0.0159%)
hyphenate-style-name: 339 B (0.0102%)
simple-assign: 281 B (0.00846%)
strict-uri-encode: 182 B (0.00548%)
isarray: 132 B (0.00397%)
react-addons-transition-group: 59 B (0.00178%)
intl .: 15 B (0.000452%)
<self>: 410.96 KB (12.7%)



```
