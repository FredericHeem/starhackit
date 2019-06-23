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
* [i18next-xhr-backend](https://github.com/i18next/i18next-xhr-backend): backend layer for i18next using browsers xhr

The translation files are located in [locales](locales) directory.

### Production build

To build the production version:

    $ npm run build

*webpack* will produce a report with all the assets and their respective size.

```
Version: webpack 4.28.4
Time: 19061ms
Built at: 06/23/2019 12:31:27 PM
                            Asset       Size      Chunks                    Chunk Names
        0.3c19d7ce083a08f254a6.js   14.5 KiB           0  [emitted]         
     0.3c19d7ce083a08f254a6.js.gz   5.03 KiB              [emitted]         
        1.3c19d7ce083a08f254a6.js   7.56 KiB           1  [emitted]         
     1.3c19d7ce083a08f254a6.js.gz   2.25 KiB              [emitted]         
       10.3c19d7ce083a08f254a6.js   6.48 KiB  10, 13, 14  [emitted]         
    10.3c19d7ce083a08f254a6.js.gz   2.34 KiB              [emitted]         
       11.3c19d7ce083a08f254a6.js   7.73 KiB          11  [emitted]         
    11.3c19d7ce083a08f254a6.js.gz   3.38 KiB              [emitted]         
       12.3c19d7ce083a08f254a6.js   8.09 KiB          12  [emitted]         
    12.3c19d7ce083a08f254a6.js.gz   3.45 KiB              [emitted]         
       13.3c19d7ce083a08f254a6.js   6.33 KiB      13, 14  [emitted]         
    13.3c19d7ce083a08f254a6.js.gz   2.29 KiB              [emitted]         
       14.3c19d7ce083a08f254a6.js   6.01 KiB          14  [emitted]         
    14.3c19d7ce083a08f254a6.js.gz   2.21 KiB              [emitted]         
       15.3c19d7ce083a08f254a6.js   4.37 KiB          15  [emitted]         
    15.3c19d7ce083a08f254a6.js.gz   1.72 KiB              [emitted]         
       16.3c19d7ce083a08f254a6.js   4.29 KiB          16  [emitted]         
    16.3c19d7ce083a08f254a6.js.gz   1.63 KiB              [emitted]         
       17.3c19d7ce083a08f254a6.js   6.55 KiB          17  [emitted]         
    17.3c19d7ce083a08f254a6.js.gz   2.05 KiB              [emitted]         
       18.3c19d7ce083a08f254a6.js   39.5 KiB          18  [emitted]         
    18.3c19d7ce083a08f254a6.js.gz   13.3 KiB              [emitted]         
       19.3c19d7ce083a08f254a6.js   23.5 KiB          19  [emitted]         
    19.3c19d7ce083a08f254a6.js.gz   3.99 KiB              [emitted]         
       20.3c19d7ce083a08f254a6.js  428 bytes          20  [emitted]         
    20.3c19d7ce083a08f254a6.js.gz  281 bytes              [emitted]         
       21.3c19d7ce083a08f254a6.js  717 bytes          21  [emitted]         
    21.3c19d7ce083a08f254a6.js.gz  455 bytes              [emitted]         
       22.3c19d7ce083a08f254a6.js   81 bytes          22  [emitted]         
        6.3c19d7ce083a08f254a6.js   35.2 KiB           6  [emitted]         
     6.3c19d7ce083a08f254a6.js.gz   8.93 KiB              [emitted]         
                            6.css  608 bytes           6  [emitted]         
                         6.css.gz  248 bytes              [emitted]         
        7.3c19d7ce083a08f254a6.js    238 KiB           7  [emitted]         
     7.3c19d7ce083a08f254a6.js.gz    146 KiB              [emitted]         
        8.3c19d7ce083a08f254a6.js   7.67 KiB           8  [emitted]         
     8.3c19d7ce083a08f254a6.js.gz   2.86 KiB              [emitted]         
        9.3c19d7ce083a08f254a6.js   9.54 KiB           9  [emitted]         
     9.3c19d7ce083a08f254a6.js.gz   3.31 KiB              [emitted]         
    admin.3c19d7ce083a08f254a6.js    300 KiB           2  [emitted]  [big]  admin
 admin.3c19d7ce083a08f254a6.js.gz   95.1 KiB              [emitted]         
                        admin.css   39 bytes           2  [emitted]         admin
                 admin/index.html   2.21 KiB              [emitted]         
              admin/index.html.gz  868 bytes              [emitted]         
                      favicon.ico   1.12 KiB              [emitted]         
                   favicon.ico.gz  220 bytes              [emitted]         
                       index.html   2.31 KiB              [emitted]         
                    index.html.gz  933 bytes              [emitted]         
           locales/en/common.json  410 bytes              [emitted]         
        locales/en/common.json.gz  200 bytes              [emitted]         
           locales/fr/common.json  314 bytes              [emitted]         
        locales/fr/common.json.gz  207 bytes              [emitted]         
           locales/it/common.json  175 bytes              [emitted]         
        locales/it/common.json.gz  138 bytes              [emitted]         
    micro.3c19d7ce083a08f254a6.js    291 KiB           3  [emitted]  [big]  micro
 micro.3c19d7ce083a08f254a6.js.gz   92.1 KiB              [emitted]         
                        micro.css   39 bytes           3  [emitted]         micro
   public.3c19d7ce083a08f254a6.js    300 KiB           4  [emitted]  [big]  public
public.3c19d7ce083a08f254a6.js.gz     95 KiB              [emitted]         
                       public.css   39 bytes           4  [emitted]         public
                public/index.html   2.32 KiB              [emitted]         
             public/index.html.gz  935 bytes              [emitted]         
     user.3c19d7ce083a08f254a6.js    299 KiB           5  [emitted]  [big]  user
  user.3c19d7ce083a08f254a6.js.gz   94.8 KiB              [emitted]         
                         user.css   39 bytes           5  [emitted]         user
                  user/index.html   2.31 KiB              [emitted]         
               user/index.html.gz  933 bytes              [emitted]         
Entrypoint micro [big] = micro.css micro.3c19d7ce083a08f254a6.js
Entrypoint public [big] = public.css public.3c19d7ce083a08f254a6.js
Entrypoint user [big] = user.css user.3c19d7ce083a08f254a6.js
Entrypoint admin [big] = admin.css admin.3c19d7ce083a08f254a6.js


```

To find out exactly the weight of each individual library, the tool [https://github.com/webpack-contrib/webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) creates a report displaying the size and the relative percentage of the dependencies.

