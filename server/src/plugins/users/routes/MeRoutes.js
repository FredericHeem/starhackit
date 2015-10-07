export default function(app, auth, meHttpCtrl){
  "use strict";
  let express = require("express");
  let router = new express.Router();

  // get /me
  router.get('/me', auth.isAuthorized, meHttpCtrl.index);
  return router;
}
