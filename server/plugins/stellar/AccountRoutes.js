module.exports = function(app, auth, controllers){
  "use strict";
  var express = require("express");
  var router = new express.Router();
  var accountHttpCtrl = controllers.account;

  router.get('/accounts', auth.isAuthorized, accountHttpCtrl.index);
  router.post('/accounts', auth.isAuthorized, accountHttpCtrl.create);

  router.get('/accounts/:address', auth.isAuthorized, accountHttpCtrl.show);

  router.get('/users/:id/address', auth.isAuthorized, accountHttpCtrl.getByUserId);
  return router;

};
