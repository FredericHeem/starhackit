import Log from 'logfilename';
import PassportAuth from './PassportAuth';

//Api
import MeApi from './api/MeApi';
import UserApi from './api/UserApi';

//Http Controller
import UserHttpController from './controllers/UserHttpController';
import AuthenticationHttpController from './controllers/AuthenticationHttpController';

//Routes
import AuthenticationRoutes from './routes/AuthenticationRoutes';
import UsersRoutes from './routes/UsersRoutes';

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
      authentication: AuthenticationHttpController(app)
    };

    this.routers = {
      users: UsersRoutes(app, this.auth, this.controllers),
      authentication:AuthenticationRoutes(app, this.auth, this.controllers)
    };

    this._models = app.data.sequelize.models;
  }

  seedDefault(){
    let seedDefaultFns = [
      this._models.Group.seedDefault,
      this._models.models.User.seedDefault,
      this._models.models.Permission.seedDefault,
      this._models.models.GroupPermission.seedDefault
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
    server.use('/api/v1', this.auth.ensureAuthenticated, this.routers.users);
  }
}

function setupAuthentication(app) {
  let auth = new PassportAuth(app);
  app.auth = auth;
  return auth;
}
