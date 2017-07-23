# StarHackIt React Frontend

A functional Preact/React based frontend starter kit:

* `preact` or `react` for pure view layer, 100% stateless compoment.  
* `mobx` for state management.
* `glamorous` for real-time styling.
* `universal-router` for the routing solution: code split, data fetching. 
* Internationalization with `i18next` and `react-intl`
* Find bugs, enforce coding standards with `eslint` and its plugins: `react`, `promise`, `mocha`.
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

### Production build

To build the production version:

    $ npm run build

*webpack* will produce a report with all the assets and their respective size.

```
Version: webpack 3.3.0
Time: 17286ms
                             Asset       Size  Chunks                    Chunk Names
      2.f09209ebd25efb13e2d0.js.gz    9.98 kB          [emitted]         
         0.f09209ebd25efb13e2d0.js     142 kB       0  [emitted]         
         2.f09209ebd25efb13e2d0.js    45.9 kB       2  [emitted]         
         3.f09209ebd25efb13e2d0.js     298 kB    3, 5  [emitted]  [big]  
         4.f09209ebd25efb13e2d0.js    5.21 kB       4  [emitted]         
         5.f09209ebd25efb13e2d0.js    6.26 kB       5  [emitted]         
         6.f09209ebd25efb13e2d0.js    5.62 kB       6  [emitted]         
         7.f09209ebd25efb13e2d0.js    5.09 kB       7  [emitted]         
         8.f09209ebd25efb13e2d0.js    65.2 kB       8  [emitted]         
         9.f09209ebd25efb13e2d0.js    2.29 kB       9  [emitted]         
       app.f09209ebd25efb13e2d0.js     350 kB      10  [emitted]  [big]  app
     0.f09209ebd25efb13e2d0.js.map     727 kB       0  [emitted]         
     1.f09209ebd25efb13e2d0.js.map     479 kB       1  [emitted]         
     2.f09209ebd25efb13e2d0.js.map     312 kB       2  [emitted]         
     3.f09209ebd25efb13e2d0.js.map     649 kB    3, 5  [emitted]         
     4.f09209ebd25efb13e2d0.js.map      43 kB       4  [emitted]         
     5.f09209ebd25efb13e2d0.js.map    32.1 kB       5  [emitted]         
     6.f09209ebd25efb13e2d0.js.map    26.5 kB       6  [emitted]         
     7.f09209ebd25efb13e2d0.js.map    23.9 kB       7  [emitted]         
     8.f09209ebd25efb13e2d0.js.map     470 kB       8  [emitted]         
     9.f09209ebd25efb13e2d0.js.map    10.8 kB       9  [emitted]         
   app.f09209ebd25efb13e2d0.js.map    2.21 MB      10  [emitted]         app
         1.f09209ebd25efb13e2d0.js    77.5 kB       1  [emitted]         
  4.f09209ebd25efb13e2d0.js.map.gz    7.82 kB          [emitted]         
  5.f09209ebd25efb13e2d0.js.map.gz    5.02 kB          [emitted]         
  6.f09209ebd25efb13e2d0.js.map.gz    6.01 kB          [emitted]         
  7.f09209ebd25efb13e2d0.js.map.gz     5.5 kB          [emitted]         
  9.f09209ebd25efb13e2d0.js.map.gz    2.68 kB          [emitted]         
      1.f09209ebd25efb13e2d0.js.gz    16.8 kB          [emitted]         
      8.f09209ebd25efb13e2d0.js.gz    18.1 kB          [emitted]         
      0.f09209ebd25efb13e2d0.js.gz    29.7 kB          [emitted]         
  2.f09209ebd25efb13e2d0.js.map.gz    58.4 kB          [emitted]         
    app.f09209ebd25efb13e2d0.js.gz    96.9 kB          [emitted]         
  1.f09209ebd25efb13e2d0.js.map.gz      93 kB          [emitted]         
      3.f09209ebd25efb13e2d0.js.gz     178 kB          [emitted]         
  8.f09209ebd25efb13e2d0.js.map.gz     105 kB          [emitted]         
  3.f09209ebd25efb13e2d0.js.map.gz     364 kB          [emitted]  [big]  
  0.f09209ebd25efb13e2d0.js.map.gz     151 kB          [emitted]         
app.f09209ebd25efb13e2d0.js.map.gz     532 kB          [emitted]  [big]  
                        index.html    3.01 kB          [emitted]         


```

To find out exactly the weight of each individual library, the tool [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

