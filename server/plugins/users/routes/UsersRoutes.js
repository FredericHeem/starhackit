module.exports = function(app, auth, controllers){
  "use strict";
  var express = require("express");
  var router = new express.Router();
  var userHttpCtrl = controllers.user;
  
  //Users
  router.get('/users', auth.isAuthorized, userHttpCtrl.index);
  router.post('/users', auth.isAuthorized, userHttpCtrl.create);
  router.get('/users/:id', auth.isAuthorized, userHttpCtrl.show);
  return router;
  
};