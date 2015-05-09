"use strict";
var reflux = require("reflux");

// Create actions
var actions = reflux.createActions([
  "transitionStart",
  "transitionEnd",

  "routeUpdate",

  "documentTitleUpdate"
]);
module.exports = actions;
