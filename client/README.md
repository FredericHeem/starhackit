# StarHackIt React Frontend

A functional React based frontend starter kit:

* `react` for pure view layer, 100% stateless compoment.  
* `mobx` for state management.
* `emotion` for real-time styling.
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
Version: webpack 4.28.4
Time: 16929ms
Built at: 06/19/2019 6:26:27 PM
                            Asset       Size  Chunks                    Chunk Names
       10.39137f272569846297d4.js   23.5 KiB      10  [emitted]         
    10.39137f272569846297d4.js.gz   3.99 KiB          [emitted]         
       11.39137f272569846297d4.js  428 bytes      11  [emitted]         
    11.39137f272569846297d4.js.gz  280 bytes          [emitted]         
       12.39137f272569846297d4.js   1.71 KiB      12  [emitted]         
    12.39137f272569846297d4.js.gz  771 bytes          [emitted]         
       13.39137f272569846297d4.js   81 bytes      13  [emitted]         
        3.39137f272569846297d4.js   11.8 KiB       3  [emitted]         
     3.39137f272569846297d4.js.gz   3.76 KiB          [emitted]         
        4.39137f272569846297d4.js    276 KiB       4  [emitted]  [big]  
     4.39137f272569846297d4.js.gz    168 KiB          [emitted]         
        5.39137f272569846297d4.js   4.99 KiB       5  [emitted]         
     5.39137f272569846297d4.js.gz   2.38 KiB          [emitted]         
        6.39137f272569846297d4.js   5.47 KiB       6  [emitted]         
     6.39137f272569846297d4.js.gz   2.54 KiB          [emitted]         
        7.39137f272569846297d4.js   1.73 KiB       7  [emitted]         
     7.39137f272569846297d4.js.gz  767 bytes          [emitted]         
        8.39137f272569846297d4.js   39.5 KiB       8  [emitted]         
     8.39137f272569846297d4.js.gz   13.3 KiB          [emitted]         
        9.39137f272569846297d4.js   3.77 KiB       9  [emitted]         
     9.39137f272569846297d4.js.gz    1.1 KiB          [emitted]         
    admin.39137f272569846297d4.js    372 KiB       0  [emitted]  [big]  admin
 admin.39137f272569846297d4.js.gz    115 KiB          [emitted]         
                        admin.css  647 bytes       0  [emitted]         admin
                     admin.css.gz  262 bytes          [emitted]         
                 admin/index.html   2.21 KiB          [emitted]         
              admin/index.html.gz  870 bytes          [emitted]         
                      favicon.ico   1.12 KiB          [emitted]         
                   favicon.ico.gz  220 bytes          [emitted]         
                       index.html   2.32 KiB          [emitted]         
                    index.html.gz  937 bytes          [emitted]         
           locales/en/common.json  410 bytes          [emitted]         
        locales/en/common.json.gz  200 bytes          [emitted]         
           locales/fr/common.json  314 bytes          [emitted]         
        locales/fr/common.json.gz  207 bytes          [emitted]         
           locales/it/common.json  175 bytes          [emitted]         
        locales/it/common.json.gz  138 bytes          [emitted]         
   public.39137f272569846297d4.js    334 KiB       1  [emitted]  [big]  public
public.39137f272569846297d4.js.gz    106 KiB          [emitted]         
                       public.css   39 bytes       1  [emitted]         public
     user.39137f272569846297d4.js    334 KiB       2  [emitted]  [big]  user
  user.39137f272569846297d4.js.gz    106 KiB          [emitted]         
                         user.css   39 bytes       2  [emitted]         user
                  user/index.html   2.31 KiB          [emitted]         
               user/index.html.gz  935 bytes          [emitted]         
Entrypoint public [big] = public.css public.39137f272569846297d4.js
Entrypoint user [big] = user.css user.39137f272569846297d4.js
Entrypoint admin [big] = admin.css admin.39137f272569846297d4.js
  

```

To find out exactly the weight of each individual library, the tool [https://github.com/webpack-contrib/webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

