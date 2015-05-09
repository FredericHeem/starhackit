"use strict";
var Q = require("q");
var inDOMEnvironment = typeof window !== "undefined";
var dataProvider = require("local/core/syncDataProvider");
var debug = require('debug')('core:dataInterface');

// TODO: Remove the following eslint directive once
// https://github.com/babel/babel-eslint/issues/21#issuecomment-76796488 is resolved
/*eslint no-unused-vars: 1*/
class DataInterface {
  constructor() {
    this.inDom = inDOMEnvironment;
    this.response = {};
    this.error = false;
    this.profiling = false;
    this.profile = {
      get: [],
      post: []
    };
  }

  // Rest methods
  get(path, localOnly) {
    // Check for hydrated data

    var hydratedData = dataProvider.getDataByPath(path);
    debug("get: %s, hydratedData: %s", path, JSON.stringify(hydratedData))
    if(Object.getOwnPropertyNames(hydratedData).length !== 0 || localOnly){
      this.response = hydratedData;

      if (localOnly && !this.response) {
        this.response = {};
      }
      return this;
    }
    else {
      if (this.inDom) {
        var $ = require("jquery");
        // Check if we need artificial server delay for testing
        return Q.when($.get("http://" + window.location.host + path)).then(function(result) {
          debug("get response: ", result)
          return result;
        });
      }
      else {
        this.response = dataProvider.getDataByPath(path);

        // Profiling
        if (this.profiling) {
          this.profile.get.push(path);
        }
        return this;
      }
    }
  }

  post(path, data) {
    if (this.inDom) {
      var $ = require("jquery");
      return Q.when($.post("http://" + window.location.host + path, data)).then(function(result) {
        return result;
      });
    }
    else {
      this.response = dataProvider.getDataByPath(path);

      // Profiling
      if (this.profiling) {
        this.profile.post.push(path);
      }

      return this;
    }
  }

  loadScript(path) {
    if (this.inDom) {
      var $ = require("jquery");
      $.cachedScript = function( url, options ) {

        // Allow user to set any option except for dataType, cache, and url
        options = $.extend( options || {}, {
          dataType: "script",
          cache: true,
          url: url
        });

        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return $.ajax( options );
      };

      // Retrieve password checker
      return Q.when($.cachedScript("http://" + window.location.host + path));
    }
  };

  // Callbacks
  then(callback) {
    if (!this.error) {
      callback(this.response);
    }
    return this;
  };

  catch(callback) {
    if (this.error) {
      callback(null, "", "");
    }
    return this;
  };

  // Helper methods
  enableProfiling() {
    this.profiling = true;
  };

  disableProfiling() {
    this.profiling = false;
  };

  getProfile() {
    return this.profile;
  };
}

module.exports = new DataInterface();
