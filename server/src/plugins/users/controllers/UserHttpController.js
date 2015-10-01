export default function(app, userApi){

  let log = require('logfilename')(__filename);
  let respond = app.utils.http.respond;
  
  function index(req, res) {
    respond(userApi, userApi.list,[req.query],res);
  }

  function show(req, res) {
    log.info("show user id: ", req.params.id);
    respond(userApi, userApi.get,[req.params.id],res);
  }

  return {
    index:index,
    show:show
  };
}
