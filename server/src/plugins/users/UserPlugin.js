import Promise from 'bluebird';
import Log from 'logfilename';
import PassportAuth from './PassportAuth';

//Api
import MeApi from './api/MeApi';
import UserApi from './api/UserApi';

//Http Controller
import UserHttpController from './controllers/UserHttpController';
import MeHttpController from './controllers/MeHttpController';

import AuthenticationHttpController from './controllers/AuthenticationHttpController';

//Routes
import AuthenticationRoutes from './routes/AuthenticationRoutes';
import UsersRoutes from './routes/UsersRoutes';
import MeRoutes from './routes/MeRoutes';


let log = new Log(__filename);

export default class UserPlugin {
  constructor(app){
    log.debug("UserPlugin");

    this.auth = setupAuthentication(app);

    this.api = {
      me: new MeApi(app),
      user: new UserApi(app)
    };

    this.controllers = {
      user: new UserHttpController(app, this.api.user),
      me: new MeHttpController(app, this.api.user),
      authentication: AuthenticationHttpController(app)
    };

    this.routers = {
      users: UsersRoutes(app, this.auth, this.controllers.user),
      me: MeRoutes(app, this.auth, this.controllers.me),
      authentication: AuthenticationRoutes(app, this.auth, this.controllers.authentication)
    };

    this._models = app.data.sequelize.models;
  }

  seedDefault(){
    let seedDefaultFns = [
      this._models.Group.seedDefault,
      this._models.User.seedDefault,
      this._models.Permission.seedDefault,
      this._models.GroupPermission.seedDefault
    ];
    return Promise.each(seedDefaultFns, function(fn){
      return fn();
    });
  }

  isSeeded() {
    return this._models.User.count()
    .then(function(count) {
      log.debug("#users ", count);
      return Promise.resolve(count);
    });
  }

  registerRouter(server) {
    server.use('/api/v1/auth', this.routers.authentication);
    server.use('/api/v1/', this.auth.ensureAuthenticated, this.routers.users);
    server.use('/api/v1/', this.auth.ensureAuthenticated, this.routers.me);
  }
}

function setupAuthentication(app) {
  let auth = new PassportAuth(app);
  app.auth = auth;
  return auth;
}
