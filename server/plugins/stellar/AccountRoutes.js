module.exports = function(app, auth, controllers){
  "use strict";
  var express = require("express");
  var router = new express.Router();
  var accountHttpCtrl = controllers.account;

  //Users
  router.get('/accounts', auth.isAuthorized, accountHttpCtrl.index);
  //router.post('/users', auth.isAuthorized, userHttpCtrl.create);
  router.get('/accounts/:id', auth.isAuthorized, accountHttpCtrl.show);
  return router;

};
