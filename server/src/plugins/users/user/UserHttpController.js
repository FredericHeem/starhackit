import UserApi from './UserApi';

let log = require('logfilename')(__filename);

export default function(app){
  let userApi = UserApi(app);
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
