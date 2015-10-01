export default function(app, userApi){

  var log = require('logfilename')(__filename);

  function index(req, res) {
    app.utils.http.respond(userApi, userApi.list,[req.query],res);
  }
  /*
  function create(req, res) {
    app.utils.http.respond(userApi.create,[req.body],res);
  }
  */
  function show(req, res) {
    log.info("show user id: ", req.params.id);
    app.utils.http.respond(userApi, userApi.get,[req.params.id],res);
  }

  return {
    index:index,
    //create:create,
    show:show
  };
};
