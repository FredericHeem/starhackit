"use strict";
var reflux = require("reflux");
var dataInterface = require("local/core/dataInterface");

// Create actions
var actions = reflux.createActions([
  // Login
  "login",
  "loginFail",
  "loginSuccess",
  "loginError",

  // Register
  "register",
  "registerFail",
  "registerSuccess",

  // Session
  "sessionRetrieve",
  "sessionUpdate",

  // Logout
  "logout",
  "logoutSuccess",
  "logoutError",

  // Set session info
  "setLoginReturnPath",

  // Password check script
  "loadPasswordChecker",
  "loadPasswordCheckerSuccess",
  "loadPasswordCheckerFail"
]);
module.exports = actions;

// Action handlers
actions.login.listen(function(username, password) {
  dataInterface.post("/v1/auth/login", {username: username, password: password})
    .then(function(data) {
      if (data.success) {
        actions.loginSuccess(data.user);
      }
      else {
        actions.loginFail("");
      }
    })
    .catch(function(jqXHR, textStatus, errorThrown) {
      if(jqXHR.status === 401){
        actions.loginFail();
      } else {
        actions.loginError(textStatus, errorThrown);
      }
    });
});

actions.logout.listen(function() {
  dataInterface.post("/v1/auth/logout")
    .then(function(data) {
      actions.logoutSuccess();
    })
    .catch(function(jqXHR, textStatus, errorThrown) {
      actions.logoutError(textStatus, errorThrown);
    });
});

actions.register.listen(function(params) {
  console.log("register")
  dataInterface.post("/v1/auth/register", params)
  .then(function(data) {
    console.log("registerSuccess")
    actions.registerSuccess();
  })
  .catch(function(jqXHR, textStatus, errorThrown) {
    console.log("registerFail")
    actions.registerFail(jqXHR, textStatus, errorThrown);
  });
});

actions.loadPasswordChecker.listen(function() {
  dataInterface.loadScript("/js/vendor/zxcvbn.js")
    .then(function() {
      actions.loadPasswordCheckerSuccess();
    })
    .catch(function() {
      actions.loadPasswordCheckerError();
    });
});
