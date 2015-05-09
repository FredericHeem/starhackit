"use strict";
var sessionStore = require("local/stores/session");
var sessionActions = require("local/actions/sessionActions");
var connect = require("local/libraries/tmp_connect");
var State = require("react-router").State;
var debug = require('debug')('mixins:authRoute')

var authRoute = {
  mixins: [connect(sessionStore, "session"), State],
  statics: {
    willTransitionTo: function (transition, params) {
      if (!sessionStore.isLoggedIn()) {
        // Set return path
        debug("willTransitionTo not logged in")
        sessionActions.setLoginReturnPath(transition.path);

        // Redirect
        transition.redirect("login");
      } else {
        debug("willTransitionTo logged in")
      }
    }
  },
  componentWillUpdate: function() {
    var router = require("local/core/router").router;
    if (!sessionStore.isLoggedIn()) {
      // Set return path
      debug("componentWillUpdate return path: ", this.getPath());
      sessionActions.setLoginReturnPath(this.getPath());

      // Redirect
      router.transitionTo("login");
    } else {
      debug("componentWillUpdate logged in")
    }
  }
};

module.exports = authRoute;
