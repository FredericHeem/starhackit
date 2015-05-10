"use strict";
var Reflux = require("reflux");
var Immutable = require("immutable");
var sessionActions = require("local/actions/sessionActions");
var dataInterface = require("local/core/dataInterface");
var aug = require("aug");
var debug = require("debug")("stores:session");

var defaultData = {
  id: -1,
  username: null,
  auth: false,
  roles: ["guest"],
  msg: null,
  returnPath: null,
  pwdCheckState: null
};

var SessionStore = Reflux.createStore({
  init: function() {
    debug("init ");
    // Check session data locally
    var initialData = {};
    var me = this;
    dataInterface.get("/v1/auth/session", false)
    .then(function(data) {
      debug("auth session ", JSON.stringify(data));
      var user = data.user;
      if (user) {
        //user.auth = true;
        debug("init authenticated ");
        initialData = aug({}, defaultData, user);
        me.onLoginSuccess(user);
      } else {
        debug("no valid user");
      }
      //me.setData(initialData);
    })
    .catch(function(err) {
      debug("init error ", err);
    });

    this.data = Immutable.Map(initialData);
    // Set data
  },
  listenables: sessionActions,
  getInitialState: function() {
    return this.data;
  },
  setData: function(data) {
    this.data = this.data.merge(data);
  },

  // Login handlers
  onLoginSuccess: function(data) {
    debug("onLoginSuccess ", data);
    this.setData({
      auth: true,
      id: data.id,
      username: data.username,
      roles: ["auth"]
    });
    this.trigger(this.data);
  },
  onLoginFail: function(msg) {
    debug("onLoginFail ", msg);
    this.setData(defaultData);
    this.setData({msg: msg || "Invalid credentials"});
    this.trigger(this.data);

    // Clear volatile message
    this.setData({msg: null});
  },
  onLogoutSuccess: function() {
    debug("onLogoutSuccess");
    this.setData(defaultData);
    this.trigger(this.data);
  },

  onRegisterFail: function(jqXHR, textStatus) {
    debug("onRegisterFail ", jqXHR);
    this.setData(defaultData);
    this.setData({msg: jqXHR.responseText || "Unknown Error"});
    this.trigger(this.data);

    // Clear volatile message
    this.setData({msg: null});
  },
  // Session information
  onSetLoginReturnPath: function(path) {
    debug("onSetLoginReturnPath ", path);
    this.setData({returnPath: path});
  },
  // Password checker
  onLoadPasswordChecker: function() {
    this.setData({pwdCheckerState: "loading"});
    this.trigger(this.data);
  },
  onLoadPasswordCheckerSuccess: function() {
    this.setData({pwdCheckerState: "ready"});
    this.trigger(this.data);
  },
  onLoadPasswordCheckerFailed: function() {
    this.setData({pwdCheckerState: "failed"});
    this.trigger(this.data);
  },
  // API
  isLoggedIn: function() {
    var auth = this.data.get("auth");
    debug("isLoggedIn ", auth);
    return auth;
  }
});
module.exports = SessionStore;
