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

export default function UserPlugin(app){

  app.data.registerModelsFromDir(__dirname, './models');

  let publisher = createPublisher();
  setupAuthentication(app, publisher);

  setupRouter(app, publisher);

  let models = app.data.models();

  let mailJob = MailJob(config);

  let startStop = [mailJob, publisher];

  return {
    publisher:publisher,
    async start(){
      await Promise.each(startStop, obj => obj.start(app));
    },

    async stop(){
      await Promise.each(startStop, obj => obj.stop(app));
    },

    seedDefault(){
      let seedDefaultFns = [
        models.Group.seedDefault,
        models.User.seedDefault,
        models.Permission.seedDefault,
        models.GroupPermission.seedDefault
      ];
      return Promise.each(seedDefaultFns, fn => fn());
    },

    async isSeeded() {
      let count = await models.User.count();
      log.debug("#users ", count);
      return count;
    }
  };
}

function setupRouter(app, publisherUser){
  //Authentication
  AuthenticationRouter(app, publisherUser);

  //Me
  MeRouter(app);

  //Users
  UserRouter(app);
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
