import Router from 'koa-66';
import MeApi from './MeApi';

let log = require('logfilename')(__filename);

export function MeHttpController(app){
  log.debug("MeHttpController");
  let respond = app.utils.http.respond;
  let meApi = MeApi(app);
  return {
    async get(context) {
      return respond(context, meApi, meApi.getByUserId, [context.passport.user.id]);
    },
    async patch(context) {
      return respond(context, meApi, meApi.patch, [context.passport.user.id, context.request.body]);
    }
  };
}

export default function MeRouter(app, /*auth*/){
  let router = new Router();
  let meHttpController = MeHttpController(app);
  router.use(app.server.auth.isAuthenticated);
  router.get('/', meHttpController.get);
  router.patch('/', meHttpController.patch);
  app.server.baseRouter().mount("/me", router);
  return router;
}
