/**
 * tmp updated connect file; awaiting pull request at reflux
 * @type {exports}
 */
"use strict";
var Reflux = require("reflux"),
  _ = require("reflux/src/utils");

module.exports = function (listenable, key) {
  return {
    getInitialState: function () {
      if (!_.isFunction(listenable.getInitialState)) {
        return {};
      }
      else if (key === undefined) {
        return listenable.getInitialState();
      }
      else {
        return _.object([key], [listenable.getInitialState()]);
      }
    },
    componentDidMount: function () {
      var warned = false;
      for (var m in Reflux.ListenerMethods) {
        if (this[m] && typeof console && typeof console.warn === "function" && !warned) {
          console.warn(
            "Component using Reflux.connect already had property '" + m + "'. " +
            "Either you had your own property with that name which was now overridden, " +
            "or you combined connect with ListenerMixin which is unnecessary as connect " +
            "will include the ListenerMixin methods automatically."
          );
          warned = true;
        }
        this[m] = Reflux.ListenerMethods[m];
      }
      var me = this, cb = (key === undefined ? this.replaceState : function (v) {
        me.setState(_.object([key], [v]));
      });
      this.listenTo(listenable, cb);
    },
    componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
  };
};
