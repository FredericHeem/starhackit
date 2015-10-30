export default function(app, auth, meHttpCtrl){
  "use strict";
  let express = require("express");
  let router = new express.Router();

  router.get('/me', auth.isAuthorized, meHttpCtrl.index);
  router.patch('/me', auth.isAuthorized, meHttpCtrl.patch);
  return router;
}
