module.exports = function(app, auth, controllers){
  "use strict";
  var express = require("express");
  var authenticationHttpCtrl = controllers.authentication;

  var router = new express.Router();
  router.post('/login', auth.passport.authenticate('login'), authenticationHttpCtrl.login);
  router.post('/register', auth.passport.authenticate('register'), authenticationHttpCtrl.register);

  router.post('/logout', auth.ensureAuthenticated, authenticationHttpCtrl.logout);
  router.get('/session', auth.ensureAuthenticated, authenticationHttpCtrl.session);
  return router;
};