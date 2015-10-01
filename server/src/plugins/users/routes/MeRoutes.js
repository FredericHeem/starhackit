export default function(app, auth, meHttpCtrl){
  "use strict";
  var express = require("express");
  var router = new express.Router();

  // get /me
  router.get('/me', auth.isAuthorized, meHttpCtrl.index);
  return router;
}
