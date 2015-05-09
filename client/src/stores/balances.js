"use strict";
var restApiActions = require("local/actions/resourceActions");
var Reflux = require("reflux");
var Immutable = require("immutable");

var BalancesStore = Reflux.createStore({
  listenables: restApiActions,
  data: Immutable.List([]),
  resourceDef: {
    type: "balances"
  },
  getInitialState: function() {
    return this.data;
  },

  // Helpers
  forThisStore: function(type, id, childrenType) {
    return type === this.resourceDef.type && !id && !childrenType;
  },

  // Event handlers
  onLoadResourceSuccess: function(type, id, childrenType, data) {
    console.log("onLoadResourceSuccess type: %s, id: %s, data %s", type, id, JSON.stringify(data))
    if (this.forThisStore.apply(null, arguments)) {
      console.log("onLoadResourceSuccess for us")
      this.data = Immutable.fromJS(data);
      this.trigger(this.data);
    }
  },
  onLoadResourceFail: function(type, id, childrenType) {
    if (this.forThisStore.apply(null, arguments)) {
      console.log("balances loading failed!");
    }
  }
});
module.exports = BalancesStore;
