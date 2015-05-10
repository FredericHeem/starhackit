/**
 * React-spa initialization
 */
"use strict";

// Reflux config
var Reflux = require("reflux");
Reflux.nextTick(require("setimmediate2"));
Reflux.PublisherMethods.triggerAsync = Reflux.PublisherMethods.trigger;

// logging with https://github.com/visionmedia/debug
require("local/core/log");
var debug = require("debug")("app");

// Data interface
var DI = require("local/core/dataInterface");

module.exports = {
  init: function() {
    debug("init");
  },
  renderToDom: function(water) {
    // Check if initial data is available
    debug("renderToDom water: ", water);
    if (water) {
      require("local/core/syncDataProvider").hydrate(water);
    }

    // React tap event plugin
    require("react-tap-event-plugin")();

    // Init routes
    var router = require("local/core/router");

    // Init stores
    require("local/stores/session");

    // Temporary tap event plugin
    var injectTapEventPlugin = require("react-tap-event-plugin");
    injectTapEventPlugin();

    // Render
    router.renderToDom();

    // Clear initial data
    require("local/core/syncDataProvider").dry();
  },
  renderToString: function(path, water, profile) {
    debug("renderToString path: ", path);
    // Init data interface profiler
    DI.enableProfiling(profile);

    // Hydrate data
    require("local/core/syncDataProvider").hydrate(water || {});

    // Init stores
    require("local/stores/session");

    // Init routes
    var router = require("local/core/router");

    // Render html body
    var htmlBody = router.renderToString(path || "/");

    // Get document title
    var DocumentTitle = require("react-document-title");
    var docTitle = DocumentTitle.rewind();

    // Render application
    return {
      body: htmlBody,
      title: docTitle
    };
  },
  getProfile: function() {
    return DI.getProfile();
  }
};
