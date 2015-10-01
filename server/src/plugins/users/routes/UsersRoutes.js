export default function(app, auth, userHttpCtrl){
  "use strict";
  var express = require("express");
  var router = new express.Router();

  //Users /users
  router.get('/users', auth.isAuthorized, userHttpCtrl.index);
  router.get('/users/:id', auth.isAuthorized, userHttpCtrl.show);
  return router;
}
