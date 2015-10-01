import Log from 'logfilename';
let log = new Log(__filename);

export default function(app, meApi){
  let respond = app.utils.http.respond;

  return {
    index: function(req, res){
      log.debug(req.user);
      respond(meApi, meApi.index, [req.user.id], res);
    }
  };
}
