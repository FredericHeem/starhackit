import Log from 'logfilename';
let log = new Log(__filename);

export default function(app, meApi){
  let respond = app.utils.http.respond;

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
