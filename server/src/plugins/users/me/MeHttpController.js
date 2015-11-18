import MeApi from './MeApi';

let log = require('logfilename')(__filename);

export default function(app){
  let respond = app.utils.http.respond;
  let meApi = MeApi(app);
  return {
    index: function(req, res){
      log.debug("get ", req.user);
      respond(meApi, meApi.index, [req.user.id], res);
    },
    patch: function(req, res){
      log.debug("patch ", req.user);
      respond(meApi, meApi.patch, [req.user.id, req.body], res, 204);
    }
  };
}
