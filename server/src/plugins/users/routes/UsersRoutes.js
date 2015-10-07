export default function(app, auth, userHttpCtrl){
  "use strict";
  let express = require("express");
  let router = new express.Router();

  //Users /users
  router.get('/users', auth.isAuthorized, userHttpCtrl.index);
  router.get('/users/:id', auth.isAuthorized, userHttpCtrl.show);
  return router;
}
