"use strict";
var Reflux = require("reflux");
var Immutable = require("immutable");

var LocaleStore = Reflux.createStore({
  data: Immutable.Map({
    locale: "en_Us"
  }),
  getInitialState: function() {
    return this.data;
  },
  onLocaleChange: function(locale) {
    this.data = this.data.merge({
      locale: locale
    });
    this.trigger(this.data);
  }
});
module.exports = LocaleStore;
