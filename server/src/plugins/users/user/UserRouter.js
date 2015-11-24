import Router from 'koa-66';
import UserApi from './UserApi';

let log = require('logfilename')(__filename);

export function UserHttpController(app){
  log.debug("UserHttpController");
  let userApi = UserApi(app);
  let respond = app.utils.http.respond;
  return {
    async getAll(context) {
      return respond(context, userApi, userApi.getAll, [context.querystring]);
    },
    async getOne(context) {
      let userId = context.params.id;
      return respond(context, userApi, userApi.getOne, [userId]);
    }
  };
}

export default function UserRouter(app, /*auth*/){
  let router = new Router();
  let userHttpController = UserHttpController(app);

  router.use(app.server.auth.isAuthenticated);
  router.use(app.server.auth.isAuthorized);

  router.get('/', userHttpController.getAll);
  router.get('/:id', userHttpController.getOne);

  app.server.baseRouter().mount("/users", router);
  return router;
}
