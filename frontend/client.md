# The frontend

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
* _Hot reloading\*_: Webpack detects any change in the code, it rebuilds automatically and pushes the new change the browser, no manual browser refresh required.

## TOC

* [Npm scripts](npmscripts.md)    
* [Unit testing](unittesting.md)    
* [End 2 End Testing](end2endtest.md)    
* [Multi Application](multiapp.md)    
* [Production Build](productionbuild.md)
* [Internationalization](internationalization.md)    
* [Cut and Paste detector](cutandpastedetector.md)   

### TL;DR

```text
$ cd client
$ npm install
$ npm start
```

### Build & Serve

[Webpack](https://webpack.github.io/) has become the defacto standard for building React frontend, it is configured through 3 files:

* [webpack.config.js](https://github.com/FredericHeem/starhackit/tree/3c8df5eeddc6e36c0110f10530d2ef62fbb0f49b/client/webpack.config.js): the configuration common to all environment.
* [webpack.dev.js](https://github.com/FredericHeem/starhackit/tree/3c8df5eeddc6e36c0110f10530d2ef62fbb0f49b/client/webpack.dev.js): the configuration for development environment. Thanks to the Webpack plugin `OpenBrowserPlugin`, a new browser page will be opened at the right URL i.e: `http://localhost:8080`
* [webpack.prod.js](https://github.com/FredericHeem/starhackit/tree/3c8df5eeddc6e36c0110f10530d2ef62fbb0f49b/client/webpack.prod.js): the configuration for production environment.

## Configuration

The file [src/app/config.js](https://github.com/FredericHeem/starhackit/tree/3c8df5eeddc6e36c0110f10530d2ef62fbb0f49b/client/src/app/config.js) gathers the common configuration and the environment specific configuration which is selected by defining the variable `NODE_ENV` to `production`, `development`, `uat` etc ... The `NODE_ENV` variable is injected through the _webpack_ plugin `DefinePlugin`.

