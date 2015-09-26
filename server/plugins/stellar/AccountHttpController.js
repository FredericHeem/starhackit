module.exports = function(app){
  "use strict";

  var log = require('logfilename')(__filename);

  function index(req, res) {
    app.http.utils.respond(app.api.accounts.list, [req.query],res);
  }

  function create(req, res) {
    app.http.utils.respond(app.api.accounts.create,[req.body],res);
  }
  
  function show(req, res) {
    log.info("account: ", req.params.address);
    app.http.utils.respond(app.api.accounts.get, [req.params.address], res);
  }

  function getByUserId(req, res) {
    log.info("account for user_id ", req.params.user_id);
    app.http.utils.respond(app.api.accounts.getByUserId, [req.params.user_id], res);
  }

  return {
    index:index,
    create:create,
    show:show,
    getByUserId:getByUserId
  };
};
