module.exports = function(app){
  "use strict";

  var log = require('logfilename')(__filename);

  function index(req, res) {
    app.http.utils.respond(app.api.users.list,[req.query],res);
  }
  /*
  function create(req, res) {
    app.http.utils.respond(app.api.users.create,[req.body],res);
  }
  */
  function show(req, res) {
    log.info("show user id: ", req.params.id);
    app.http.utils.respond( app.api.users.get,[req.params.id],res);
  }
  
  return {
    index:index,
    //create:create,
    show:show
  };
};
