import Router from 'koa-66';
import Qs from 'qs';

let log = require('logfilename')(__filename);

export function UserHttpController(app, userApi){
  log.debug("UserHttpController");

  let respond = app.utils.http.respond;
  return {
    async getAll(context) {
      return respond(
        context,
        userApi,
        userApi.getAll,
        [Qs.parse(context.request.querystring)]);
    },
    async getOne(context) {
      let userId = context.params.id;
      return respond(context, userApi, userApi.getOne, [userId]);
    }
  };
}

export default function UserRouter(app, userApi){
  let router = new Router();
  let userHttpController = UserHttpController(app, userApi);

  router.use(app.server.auth.isAuthenticated);
  router.use(app.server.auth.isAuthorized);

  router.get('/', userHttpController.getAll);
  router.get('/:id', userHttpController.getOne);

  app.server.baseRouter().mount("/users", router);
  return router;
}
