/**
 * Created by Wilbert vd Ridder on 4-2-2015.
 *
 * Todo:
 * - Emit event upon navigation
 * - Create breadcrumbs
 */
"use strict";
var Reflux = require("reflux");
var Immutable = require("immutable");
var navigationActions = require("local/actions/navigationActions");

var NavigationStore = Reflux.createStore({
  data: Immutable.Map({
    documentTitle: ""
  }),
  listenables: navigationActions,
  getInitialState: function() {
    return this.data;
  },
  setData: function(data) {
    this.data = this.data.merge(data);
  },
  triggerUpdate: function() {
    if (this.data.get("currentState") && this.data.get("availableRoutes") && this.data.get("documentTitle")) {
      this.trigger(this.data);
    }
  },
  onTransitionEnd: function(state) {
    this.setData({currentState: state});
    this.triggerUpdate();
  },
  onRouteUpdate: function(routes) {
    this.setData({availableRoutes: routes});
    this.triggerUpdate();
  },
  onDocumentTitleUpdate: function(title) {
    this.setData({documentTitle: title});
    this.triggerUpdate();
  }
});

module.exports = NavigationStore;
