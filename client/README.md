# StarHackIt React Frontend

A functional Preact/React based frontend starter kit:

* `preact` or `react` for pure view layer, 100% stateless compoment.  
* `mobx` for state management.
* `glamorous` for real-time styling.
* `universal-router` for the routing solution: code split, data fetching. 
* Internationalization with `i18next`
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
    v8.10.0

    $ npm -v
    5.6.0



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
Hash: fcc48ad427c813ae63bd                                                              
Version: webpack 4.4.1
Time: 4593ms
Built at: 2018-4-2 18:33:11
                         Asset       Size  Chunks                    Chunk Names
    14.fcc48ad427c813ae63bd.js    283 KiB      14  [emitted]  [big]  
     0.fcc48ad427c813ae63bd.js   9.38 KiB       0  [emitted]         
                         2.css  608 bytes       2  [emitted]         
     2.fcc48ad427c813ae63bd.js   24.9 KiB       2  [emitted]         
     3.fcc48ad427c813ae63bd.js     68 KiB       3  [emitted]         
     4.fcc48ad427c813ae63bd.js   88.6 KiB       4  [emitted]         
     5.fcc48ad427c813ae63bd.js      2 KiB       5  [emitted]         
     6.fcc48ad427c813ae63bd.js   4.87 KiB       6  [emitted]         
     7.fcc48ad427c813ae63bd.js   4.47 KiB       7  [emitted]         
     8.fcc48ad427c813ae63bd.js   4.69 KiB       8  [emitted]         
     9.fcc48ad427c813ae63bd.js   23.5 KiB       9  [emitted]         
    10.fcc48ad427c813ae63bd.js   81 bytes      10  [emitted]         
    11.fcc48ad427c813ae63bd.js   2.95 KiB      11  [emitted]         
    12.fcc48ad427c813ae63bd.js   8.11 KiB      12  [emitted]         
    13.fcc48ad427c813ae63bd.js      6 KiB      13  [emitted]         
     1.fcc48ad427c813ae63bd.js   39.4 KiB       1  [emitted]         
    15.fcc48ad427c813ae63bd.js  662 bytes      15  [emitted]         
                       app.css   39 bytes      16  [emitted]         app
   app.fcc48ad427c813ae63bd.js    313 KiB      16  [emitted]  [big]  app
                    index.html   3.05 KiB          [emitted]         
                   favicon.ico   1.12 KiB          [emitted]         
        locales/en/common.json  410 bytes          [emitted]         
        locales/fr/common.json  314 bytes          [emitted]         
        locales/it/common.json  175 bytes          [emitted]         
  2.fcc48ad427c813ae63bd.js.gz   5.89 KiB          [emitted]         
  9.fcc48ad427c813ae63bd.js.gz   3.99 KiB          [emitted]         
  1.fcc48ad427c813ae63bd.js.gz   13.3 KiB          [emitted]         
  3.fcc48ad427c813ae63bd.js.gz   16.9 KiB          [emitted]         
  4.fcc48ad427c813ae63bd.js.gz   28.4 KiB          [emitted]         
 14.fcc48ad427c813ae63bd.js.gz    172 KiB          [emitted]         
app.fcc48ad427c813ae63bd.js.gz   92.2 KiB          [emitted]        

```

To find out exactly the weight of each individual library, the tool [https://github.com/webpack-contrib/webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

