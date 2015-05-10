"use strict";
var restApiActions = require("local/actions/resourceActions");

var componentTransition = function(type, id, childrenType) {
  return {
    statics: {
      willTransitionTo: function(transition, params) {
        restApiActions.loadResource(type, params[id], childrenType);
      }
    }
  };
};

module.exports = componentTransition;
