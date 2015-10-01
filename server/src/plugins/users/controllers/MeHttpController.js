export default function(app, meApi){
  let respond = app.utils.http.respond;

  return {
    index: function(req, res){
      respond(meApi, meApi.list, [req.query], res);
    }
  };
}
