"use strict";
var approveTransition = {
  statics: {
    willTransitionFrom: function (transition, component) {
      if (!component.mayTransition()) {
        if (!confirm("You have unsaved information, are you sure you want to leave this page?")) {
          transition.abort();
        }
      }
    }
  }
};

module.exports = approveTransition;
