import Promise from 'bluebird';
import Log from 'logfilename';
import {Publisher} from 'rabbitmq-pubsub';

import PassportAuth from './PassportAuth';

import config from 'config';

// Jobs
import MailJob from './jobs/mail/MailJob';

import MeRouter from './me/MeRouter';
import UserRouter from './user/UserRouter';
import AuthenticationRouter from './authentication/AuthenticationRouter';

let log = new Log(__filename);

const publisherOption = { exchange: "user" };

export default class UserPlugin {
  constructor(app){
    log.debug("UserPlugin");
    this.app = app;
    this.publisherUser = createPublisher();
    this.auth = setupAuthentication(app, this.publisherUser);

    let router = app.server.baseRouter();
    let authenticationRouter = AuthenticationRouter(app, this.auth, this.publisherUser);
    router.use('/auth', authenticationRouter);

    let meRouter = MeRouter(app, app.auth);
    router.use('/me', this.auth.ensureAuthenticated, meRouter);

    let usersRouter = UserRouter(app, app.auth);
    router.use('/users', this.auth.ensureAuthenticated, usersRouter);

    this._models = app.data.sequelize.models;

    this.jobs = {
      mail: new MailJob(config)
    };

    this.startStop = [this.jobs.mail, this.publisherUser];
  }

  async start(){
    await Promise.each(this.startStop, obj => obj.start(this.app));
  }

  async stop(){
    await Promise.each(this.startStop, obj => obj.stop(this.app));
  }

  seedDefault(){
    let seedDefaultFns = [
      this._models.Group.seedDefault,
      this._models.User.seedDefault,
      this._models.Permission.seedDefault,
      this._models.GroupPermission.seedDefault
    ];
    return Promise.each(seedDefaultFns, fn => fn());
  }

  async isSeeded() {
    let count = await this._models.User.count();
    log.debug("#users ", count);
    return count;
  }
}

function createPublisher(){
  let rabbitmq = config.rabbitmq;
  if(rabbitmq && rabbitmq.url){
    publisherOption.url = rabbitmq.url;
  }

  log.info("createPublisher: ", publisherOption);
  return new Publisher(publisherOption);
}
function setupAuthentication(app, publisherUser) {
  let auth = new PassportAuth(app, publisherUser);
  app.auth = auth;
  return auth;
}
