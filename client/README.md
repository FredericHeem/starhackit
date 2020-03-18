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
* Unit tests with `karma` and `mocha`
* Code coverage with `nyc`
* End to end tests with `nightwatch`
* Concatenation, minification, obfuscation and compression of javascript and css file
* Bundle size and dependencies size under control
* Configuration depending of the environment: dev, uat, prod etc ...
* *Hot reloading**: Webpack detects any change in the code, it rebuilds automatically and pushes the new change the browser, no manual browser refresh required.

## TOC

* [Npm scripts](client/docs/NpmScripts.md)    
* [Unit testing](client/docs/UnitTesting.md)    
* [End 2 End Testing](client/docs/End2EndTest.md)    
* [Multi Application](client/docs/MultiApp.md)    
* [Production Build](client/docs/ProductionBuild.md)
* [Internationalization](client/docs/Internationalization.md)    
* [Cut and Paste detector](client/docs/CutAndPasteDetector.md)   

### TL;DR

    $ cd client
    $ npm install
    $ npm start

### Build & Serve

[Webpack](https://webpack.github.io/) has become the defacto standard for building React frontend, it is configured through 3 files:

* [webpack.config.js](webpack.config.js): the configuration common to all environment.
* [webpack.dev.js](webpack.dev.js): the configuration for development environment. Thanks to the Webpack plugin `OpenBrowserPlugin`, a new browser page will be opened at the right URL i.e: `http://localhost:8080`
* [webpack.prod.js](webpack.prod.js): the configuration for production environment.

## Configuration

The file [src/app/config.js](src/app/config.js) gathers the common configuration and the environment specific configuration which is selected by defining the variable `NODE_ENV` to `production`, `development`, `uat` etc ...
The `NODE_ENV` variable is injected through the *webpack* plugin `DefinePlugin`.


